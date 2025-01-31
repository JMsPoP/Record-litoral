package com.jmtsu.recordLitoral.controller;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jmtsu.recordLitoral.dto.AuthenticationDTO;
import com.jmtsu.recordLitoral.dto.UserDTO;
import com.jmtsu.recordLitoral.models.UserModel;
import com.jmtsu.recordLitoral.service.AuthService;
import com.jmtsu.recordLitoral.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

	@Autowired
	private AuthService authService;
	
	@Autowired
	private UserService userService;
	
	@PostMapping(value = "/login")
	public ResponseEntity<?> login(@RequestBody AuthenticationDTO authDto){
		return ResponseEntity.ok(authService.login(authDto));
	}
	
	@PostMapping(value = "/signup")
	public ResponseEntity<UserModel> inserir(@RequestBody @Valid UserDTO userDTO) {
		
		var userModel = new UserModel();
BeanUtils.copyProperties(userDTO, userModel);	

	return ResponseEntity.status(HttpStatus.CREATED).body(userService.inserirNovoUsuario(userModel));
	}
	
	@GetMapping(value = "/verify/{uuid}")
	public String verificarCadastro(@PathVariable("uuid") String uuid) {
		return userService.verificarCadastro(uuid);
	}
	
}
