package com.ms.email.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

import com.ms.email.enums.StatusEmail;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
@Table(name = "TB_EMAILS")
public class EmailModel implements Serializable{
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy= GenerationType.AUTO)
	private UUID emailId;
	//private UUID id;
	private Long id;
	private String emailFrom;
	private String emailTo;
	private String Subject;
	@Column(columnDefinition = "TEXT")
	private String text;
	private LocalDateTime sendDataTimeEmail;
	private StatusEmail statusEmail;
	
}
