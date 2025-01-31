package com.jmtsu.recordLitoral.controller;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jmtsu.recordLitoral.dto.UserDTO;
import com.jmtsu.recordLitoral.models.UserModel;
import com.jmtsu.recordLitoral.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/usuario")
@CrossOrigin
public class UserController {

	@Autowired
	private UserService userService;
/*	
	@GetMapping
	public List<UserDTO> listarTodos(){
		return userService.listarTodos();
	}*/

	@PostMapping
	public ResponseEntity<UserModel> inserir(@RequestBody @Valid UserDTO userDTO) {
		
		var userModel = new UserModel();
BeanUtils.copyProperties(userDTO, userModel);	

	return ResponseEntity.status(HttpStatus.CREATED).body(userService.inserirNovoUsuario(userModel));
	}
	/*
	@PutMapping
	public UserDTO alterar(@RequestBody UserDTO usuario) {
		return userService.alterar(usuario);
	}
	
	//http://endereco/usuario/3
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> excluir(@PathVariable("id") Long id){
		userService.excluir(id);
		return ResponseEntity.ok().build();
	}*/
}
