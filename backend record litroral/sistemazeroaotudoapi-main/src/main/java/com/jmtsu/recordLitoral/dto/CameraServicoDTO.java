package com.jmtsu.recordLitoral.dto;

import com.jmtsu.recordLitoral.models.enums.EquipeSemAtividade;

public record CameraServicoDTO(
		 Boolean equipeSemAtividade,
		 EquipeSemAtividade tipoSemAtividade,
		 Boolean notaCoberta,
		 String reporter,
		 String outros
		) {
}
