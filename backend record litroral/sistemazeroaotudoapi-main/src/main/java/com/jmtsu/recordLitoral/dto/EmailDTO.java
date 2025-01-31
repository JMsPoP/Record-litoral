package com.jmtsu.recordLitoral.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class EmailDTO {
	private Long id;
	private String emailTo;
	private  String subject;
	private String text;
}