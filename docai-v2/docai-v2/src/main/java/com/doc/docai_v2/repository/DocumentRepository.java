package com.doc.docai_v2.repository;

import com.doc.docai_v2.model.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<DocumentEntity,Long> {
}
