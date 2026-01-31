package com.doc.docai_v2.controller;

import com.doc.docai_v2.model.DocumentEntity;
import com.doc.docai_v2.service.ChatService;
import com.doc.docai_v2.service.IngestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DocController {
    private final IngestionService ingestionService;
    private final ChatService chatService;

    // 1. Upload
    @PostMapping("/upload")
    public ResponseEntity<DocumentEntity> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            DocumentEntity doc = ingestionService.processFile(file);
            return ResponseEntity.ok(doc);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 2. Chat
    @PostMapping("/chat")
    public ResponseEntity<ChatService.ChatResponse> chat(@RequestBody Map<String, String> payload) {
        String query = payload.get("query");
        return ResponseEntity.ok(chatService.chat(query));
    }

    // 3. Summarize
    @GetMapping("/summarize/{fileId}")
    public ResponseEntity<String> summarize(@PathVariable Long fileId) {
        return ResponseEntity.ok(chatService.summarize(fileId));
    }


}
