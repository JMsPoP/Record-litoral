package com.jmtsu.recordLitoral.models;

import java.io.Serializable;

import com.jmtsu.recordLitoral.models.enums.EquipamentoCamera;
import com.jmtsu.recordLitoral.models.enums.KitCamera;
import com.jmtsu.recordLitoral.models.enums.TipoDanosVeiculo;
import com.jmtsu.recordLitoral.models.enums.Veiculo;

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
@Table(name = "TB_INSPECAO_VEICULO_CAMERA")
public class InspecaoVeiculoModel implements Serializable  {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	 @Enumerated(EnumType.STRING)
	    @Column(nullable = true)
	    private Veiculo veiculo;
	 
		@Column(nullable = true)
		private Boolean verificar_Condicoes;
		
		@Column(nullable = true)
		private Boolean danos;
		
		 @Enumerated(EnumType.STRING)
		    @Column(nullable = true)
		    private TipoDanosVeiculo tipo_Danos_Veiculo;
		 
		    @Column(nullable = true, length = 100)
		    private String KmInicial;

		    @Column(nullable = true, length = 100)
		    private String kmFinal;
		    
		    @Column(nullable = true, length = 500)
		    private String obs;

}
