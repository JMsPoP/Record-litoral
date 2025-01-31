package com.jmtsu.recordLitoral.models;

import java.io.Serializable;

import com.jmtsu.recordLitoral.models.enums.EquipeSemAtividade;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "TB_SERVICO_CAMERA")
public class CameraServicoModel implements Serializable {
	  	@Id
	    @GeneratedValue(strategy = GenerationType.AUTO)
	    private Long id;

	    @Column(nullable = false)
	    private Boolean equipeSemAtividade;

	    @Enumerated(EnumType.STRING)
	    @Column(nullable = true)
	    private EquipeSemAtividade tipoSemAtividade;
	    
	    @Column(nullable = true)
	    private Boolean notaCoberta;

	    @Column(nullable = true)
	    private String reporter;

	    @Column(nullable = true)
	    private String outros; 

}
