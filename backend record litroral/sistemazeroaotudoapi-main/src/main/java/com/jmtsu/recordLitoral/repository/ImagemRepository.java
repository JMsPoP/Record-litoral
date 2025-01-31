package com.jmtsu.recordLitoral.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jmtsu.recordLitoral.models.ImagemModel;

public interface ImagemRepository extends JpaRepository<ImagemModel, Long> {

	public List<ImagemModel> findByOcorrenciaId(Long id);
}
