package com.jmtsu.recordLitoral.dto;

import org.springframework.web.multipart.MultipartFile;

import com.jmtsu.recordLitoral.models.enums.NivelUrgencia;

public record OcorrenciasDTO(
		Long id,
		UserDTO usuario,
		Boolean presenca,
		String motivoFalta,
		Boolean horaExtra,
		String motivoHoraExtra,
		String ocorrencia,
		NivelUrgencia nivelUrgencia,
		Boolean imagem
		) {}
	 //   MultipartFile imagem
