package com.ms.email.dtos;

//import java.util.UUID;

public record EmailDTO(
		//UUID id,
		Long id,
		String emailTo,
		String subject,
		String text) {

}
