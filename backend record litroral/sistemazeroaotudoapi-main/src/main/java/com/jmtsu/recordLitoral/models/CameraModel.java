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
@Table(name = "TB_CAMERA")
public class CameraModel implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "ID_CAMERA")
	private UserModel usuario;
	
	@Column(nullable = false)
	private Boolean presenca;
	
    @Column(nullable = true, length = 500)
    private String motivo;
	 
	@ManyToOne
	@JoinColumn(name = "ID_SERVICO")
	private CameraServicoModel servico;
	
	@ManyToOne
	@JoinColumn(name = "ID_EQUIPAMENTO")
	private CameraEquipamentoModel equipamento;
	
	@ManyToOne
	@JoinColumn(name = "ID_INSPECAO_VEICULO")
	private InspecaoVeiculoModel inspecaoVeiculo;
	
	@Column(nullable = true)
	private Boolean links;
	
	@ManyToOne
	@JoinColumn(name = "ID_RETRANCA")
	private RetrancaModel retranca;
	
	@ManyToOne
	@JoinColumn(name = "ID_OCORRENCIAS")
	private OcorrenciasModel ocorrencias;
	
	private LocalDateTime horaEnvioRespostas;
}
