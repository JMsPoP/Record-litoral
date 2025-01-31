package com.jmtsu.recordLitoral.dto;

import com.jmtsu.recordLitoral.models.enums.EquipamentoCamera;
import com.jmtsu.recordLitoral.models.enums.KitCamera;
import com.jmtsu.recordLitoral.models.enums.Veiculo;

public record CameraEquipamentoDTO(
 		KitCamera kitCamera,
		EquipamentoCamera equipamentoCamera,
		String bateriaCamera,
		String pilhas,
		Boolean mochilink,
		String obs
		) {
}
