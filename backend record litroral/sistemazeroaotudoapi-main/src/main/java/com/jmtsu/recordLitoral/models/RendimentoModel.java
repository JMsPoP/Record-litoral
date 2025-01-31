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
@Table(name = "TB_RENDIMENTO")
public class RendimentoModel implements Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "ID_CAMERA")
	private UserModel usuario;
	
	@Column(nullable = true)
	private int faltas;
	
	@Column(nullable = true)
	private int equipe_sem_atividade;
	
	
	@Column(nullable = true)
	private int envios;
	
	@Column(nullable = true)
	private int envios_sucesso;
	
	@Column(nullable = true)
	private int hora_extras;
}
