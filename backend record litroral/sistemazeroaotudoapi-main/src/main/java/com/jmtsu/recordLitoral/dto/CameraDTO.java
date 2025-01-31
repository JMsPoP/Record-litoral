package com.jmtsu.recordLitoral.dto;

import java.util.List;


public record CameraDTO(
		Long id,
		UserDTO usuario,
		Boolean presenca,
		String motivo,
		List<CameraServicoDTO> servico,
		List<CameraEquipamentoDTO> equipamento,
		List<InspecaoVeiculoDTO> inspecaoVeiculo,
		Boolean links,
		List<RetrancaDTO> retranca,
		List<OcorrenciasDTO> ocorrencias

		) {
}
