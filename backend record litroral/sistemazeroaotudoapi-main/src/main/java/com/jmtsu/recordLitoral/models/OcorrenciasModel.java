package com.jmtsu.recordLitoral.models;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.jmtsu.recordLitoral.models.enums.NivelUrgencia;
import com.jmtsu.recordLitoral.models.enums.Veiculo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "TB_OCORRENCIAS")
public class OcorrenciasModel implements Serializable  {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "ID_USUARIO")
	private UserModel usuario;
	
	@Column(nullable = true)
	private Boolean presenca;
	
    @Column(nullable = true, length = 500)
    private String motivoFalta;
	 
	@Column(nullable = true)
	private Boolean HoraExtra;
	
    @Column(nullable = true, length = 500)
    private String motivoHoraExtra;
    
    @Column(nullable = true, length = 1000)
    private String ocorrencia;

	 @Enumerated(EnumType.STRING)
	    @Column(nullable = true)
	    private NivelUrgencia nivelUrgencia;
	 
		@Column(nullable = true)
		private Boolean imagem;
	 /*
	 @ManyToOne
	 @JoinColumn(name = "ID_IMAGEM")
	 private ImagemModel imagem;
	*/
	private LocalDateTime horaEnvioRespostas;
}
