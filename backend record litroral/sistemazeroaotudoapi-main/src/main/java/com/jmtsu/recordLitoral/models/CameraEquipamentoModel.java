package com.jmtsu.recordLitoral.models;

import java.io.Serializable;

import com.jmtsu.recordLitoral.models.enums.EquipamentoCamera;
import com.jmtsu.recordLitoral.models.enums.KitCamera;
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
@Table(name = "TB_EQUIPAMENTO_CAMERA")
public class CameraEquipamentoModel implements Serializable{
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	

	    @Enumerated(EnumType.STRING)
	    @Column(nullable = true)
	    private KitCamera kitCamera;

	    @Enumerated(EnumType.STRING)
	    @Column(nullable = true)
	    private EquipamentoCamera equipamentoCamera;

	    @Column(nullable = true, length = 100)
	    private String bateriaCamera;

	    @Column(nullable = true, length = 100)
	    private String pilhas;

	    @Column(nullable = true)
	    private Boolean mochilink;

	    @Column(nullable = true, length = 500)
	    private String obs;
}
