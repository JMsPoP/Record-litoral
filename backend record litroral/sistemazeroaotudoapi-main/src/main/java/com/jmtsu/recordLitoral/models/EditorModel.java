package com.jmtsu.recordLitoral.models;

import java.io.Serializable;
import java.time.LocalDateTime;

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
@Table(name = "TB_EDITOR")
public class EditorModel implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "ID_EDITOR")
	private UserModel usuario;
	
	@Column(nullable = false)
	private Boolean presenca;
	
    @Column(nullable = true, length = 500)
    private String motivo;
    
	@Column(nullable = true)
	private Boolean escolhaRetranca;
	
	@ManyToOne
	@JoinColumn(name = "ID_RETRANCA_NOVA")
	private RetrancaModel criarRetranca;
	
	@ManyToOne
	@JoinColumn(name = "ID_RETRANCA_EXISTENTE")
	private RetrancaExistenteModel retrancaExistente;
	
	@ManyToOne
	@JoinColumn(name = "ID_OCORRENCIAS")
	private OcorrenciasModel ocorrencias;
	
	private LocalDateTime horaEnvioRespostas;
}
