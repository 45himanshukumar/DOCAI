package com.doc.docai_v2.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class DocumentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String fileType;
    private String storagePath;

    @Lob // Allows storing large amounts of text
    @Column(columnDefinition = "TEXT")
    private String content; // We store the full text here for summarization

    private LocalDateTime uploadDate;

    @PrePersist
    public void prePersist() {
        this.uploadDate = LocalDateTime.now();
    }

}
