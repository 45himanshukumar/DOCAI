package com.doc.docai_v2.service;

import com.doc.docai_v2.model.DocumentEntity;
import com.doc.docai_v2.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final VectorStore vectorStore;
    private final ChatClient.Builder chatClientBuilder;
    private final DocumentRepository documentRepository;

    public record ChatResponse(String answer, List<Double> relevantTimestamps) {}

    public ChatResponse chat(String userQuery) {
        SearchRequest request = SearchRequest.builder()
                .query(userQuery)
                .topK(3)
                .build();

        List<Document> similarDocuments = vectorStore.similaritySearch(request);

//        String context = similarDocuments.stream()
//                .map(Document::getText)
//                .collect(Collectors.joining("\n"));
        String context = similarDocuments.isEmpty()
                ? "No context available."
                : similarDocuments.stream().map(Document::getText).collect(Collectors.joining("\n"));

        List<Double> timestamps = similarDocuments.stream()
                .filter(d -> d.getMetadata().containsKey("timestamp_start"))
                .map(d -> (Double) d.getMetadata().get("timestamp_start"))
                .collect(Collectors.toList());

        var chatClient = chatClientBuilder.build();
        String answer = chatClient.prompt()
                .system("You are a helpful AI assistant.")
                .user("Context:\n" + context + "\n\nQuestion: " + userQuery)
                .call()
                .content();
        return new ChatResponse(answer, timestamps);
    }

    public String summarize(Long fileId) {
        DocumentEntity doc = documentRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        String content = doc.getContent();
        if (content == null || content.isEmpty()) return "No content found to summarize.";

        // Limit content to prevent Token Limit errors (Gemini Flash can handle more, but this is safe)
        if (content.length() > 50000) {
            content = content.substring(0, 50000);
        }

        try {
            var chatClient = chatClientBuilder.build();
            String prompt = "Provide a concise summary of the following content:\n\n" + content;
            return chatClient.prompt().user(prompt).call().content();
        } catch (Exception e) {
            // Log the full stack trace
            e.printStackTrace();
            // Return the ACTUAL error to the UI for debugging
            return "Error generating summary: " + e.getMessage();
        }
    }
}
