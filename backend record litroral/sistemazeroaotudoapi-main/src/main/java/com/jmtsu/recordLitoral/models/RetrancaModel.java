package com.jmtsu.recordLitoral.models;

import java.io.Serializable;

import com.jmtsu.recordLitoral.models.enums.SituacaoRetranca;
import com.jmtsu.recordLitoral.models.enums.SituacaoUsuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "TB_RETRANCA")
public class RetrancaModel implements Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Column(nullable = true)
	private String retranca;

	@Column(nullable = true)
	private String cidade;
	
	@Column(nullable = true)
	private Boolean horaExtra;
	
	@Column(nullable = true)
	private Boolean execucao;
	
    @Column(nullable = true, length = 500)
    private String motivo;
    
	@Enumerated(EnumType.STRING)
	//@Column(nullable = false)
	private SituacaoRetranca status;
}
