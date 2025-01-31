package com.jmtsu.recordLitoral.dto;

import com.jmtsu.recordLitoral.models.enums.TipoDanosVeiculo;
import com.jmtsu.recordLitoral.models.enums.Veiculo;

public record InspecaoVeiculoDTO(
		Veiculo veiculo,
		Boolean verificar_Condicoes,
		Boolean danos,
		TipoDanosVeiculo tipo_Danos_Veiculo,
		String kmInicial,
		String kmFinal,
		String obs
		) {}
