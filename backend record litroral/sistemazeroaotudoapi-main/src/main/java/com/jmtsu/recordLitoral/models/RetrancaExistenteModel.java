package com.jmtsu.recordLitoral.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "TB_RETRANCA_EXISTENTE")
public class RetrancaExistenteModel {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "ID_RETRANCA_ESCOLHIDA")
	private RetrancaModel retrancaEscolhida;

	@Column(nullable = true)
	private Boolean horaExtra;
	
	@Column(nullable = false)
	private Boolean execucao;
	
    @Column(nullable = true, length = 500)
    private String motivo;
}
