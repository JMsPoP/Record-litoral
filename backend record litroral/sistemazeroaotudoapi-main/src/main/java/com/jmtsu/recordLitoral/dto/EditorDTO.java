package com.jmtsu.recordLitoral.dto;

import java.util.List;

public record EditorDTO(
		Long id,
		UserDTO usuario,
		Boolean presenca,
		String motivo,
		Boolean escolhaRetranca,
		List<RetrancaDTO> criarRetranca,
		List<RetrancaExistenteDTO> retrancaExistente,
		List<OcorrenciasDTO> ocorrencias
		
		) {}
