package com.doc.docai_v2.service;






import com.doc.docai_v2.model.DocumentEntity;
import com.doc.docai_v2.repository.DocumentRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.content.Media; // <--- CORRECT IMPORT FOR 1.1.2
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class IngestionService {
    private final DocumentRepository documentRepository;
    private final VectorStore vectorStore;
    private final ObjectMapper objectMapper;
    private final ChatClient.Builder chatClientBuilder;

    private static final String UPLOAD_DIR = "uploads/";

    public DocumentEntity processFile(MultipartFile file) throws IOException {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String filePath = UPLOAD_DIR + file.getOriginalFilename();
        Path path = Path.of(filePath);
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        DocumentEntity doc = new DocumentEntity();
        doc.setFileName(file.getOriginalFilename());
        doc.setFileType(file.getContentType());
        doc.setStoragePath(filePath);

        List<Document> documents = new ArrayList<>();
        StringBuilder fullContent = new StringBuilder();

        if (file.getContentType() != null && file.getContentType().contains("pdf")) {
            String text = extractTextFromPdf(path.toFile());
            fullContent.append(text);
            documents.add(new Document(text, Map.of("fileId", "TEMP_ID", "type", "PDF")));
        }
        else if (file.getContentType().contains("audio") || file.getContentType().contains("video")) {
            documents = transcribeWithGemini(path.toFile(), "TEMP_ID", file.getContentType());
            for (Document d : documents) {
                fullContent.append(d.getText()).append(" ");
            }
        }

        doc.setContent(fullContent.toString());
        doc = documentRepository.save(doc);

        final Long finalId = doc.getId();
        List<Document> taggedDocuments = documents.stream()
                .map(d -> {
                    Map<String, Object> metadata = new java.util.HashMap<>(d.getMetadata());
                    metadata.put("fileId", finalId);
                    return new Document(d.getText(), metadata);
                })
                .toList();

        TokenTextSplitter splitter = new TokenTextSplitter();
        List<Document> splitDocuments = splitter.apply(taggedDocuments);

//        if (!splitDocuments.isEmpty()) {
//            vectorStore.add(splitDocuments);
//            log.info("Saved {} chunks for file: {}", splitDocuments.size(), doc.getFileName());
//        }
        if (!splitDocuments.isEmpty()) {
            try {
                vectorStore.add(splitDocuments);
                log.info("Saved {} chunks for file: {}", splitDocuments.size(), doc.getFileName());
            } catch (Exception e) {
                log.error("Vector Store Error - Ensure pgvector is enabled!", e);
                // We do NOT throw here, so the user still sees the file uploaded
            }
        }

        return doc;
    }

    private String extractTextFromPdf(File file) throws IOException {
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private List<Document> transcribeWithGemini(File file, String tempId, String mimeType) {
        try {
            var chatClient = chatClientBuilder.build();
            String promptText = """
                Listen to this audio/video. Transcribe the speech into text.
                You MUST output the result in this strict JSON format:
                {
                  "segments": [
                    {"start": 0.0, "end": 10.0, "text": "spoken text..."},
                    {"start": 10.0, "end": 20.0, "text": "more text..."}
                  ]
                }
                Do not include markdown formatting. Just the raw JSON.
                """;

            // Correct Spring AI 1.1.2 Logic
            Media media = new Media(MimeTypeUtils.parseMimeType(mimeType), new FileSystemResource(file));

            // Use the Fluent API (u.media) to avoid constructor issues
            String jsonResponse = chatClient.prompt()
                    .user(u -> u.text(promptText).media(media))
                    .call()
                    .content();

            if (jsonResponse.startsWith("```json")) {
                jsonResponse = jsonResponse.substring(7);
                if (jsonResponse.endsWith("```")) {
                    jsonResponse = jsonResponse.substring(0, jsonResponse.length() - 3);
                }
            }

            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode segments = rootNode.path("segments");

            List<Document> docs = new ArrayList<>();
            if (segments.isArray()) {
                for (JsonNode segment : segments) {
                    docs.add(new Document(segment.path("text").asText(), Map.of(
                            "fileId", tempId,
                            "type", "AUDIO_VIDEO",
                            "timestamp_start", segment.path("start").asDouble(),
                            "timestamp_end", segment.path("end").asDouble()
                    )));
                }
            }
            return docs;
        } catch (Exception e) {
            log.error("Error transcribing with Gemini", e);
//
            return List.of(new Document("Transcription placeholder", Map.of("fileId", tempId)));
        }
    }
}