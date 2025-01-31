package com.jmtsu.recordLitoral.dto;

public record RetrancaDTO(
		String retranca,
		String cidade,
		Boolean horaExtra,
		Boolean execucao,
		String motivo
		) {
}
