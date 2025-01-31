package com.jmtsu.recordLitoral.dto;

import org.springframework.beans.BeanUtils;

import com.jmtsu.recordLitoral.models.UserModel;
import com.jmtsu.recordLitoral.models.enums.RolesUser;
import com.jmtsu.recordLitoral.models.enums.SituacaoUsuario;

public class UserDTO {

	private Long id;	
	private String nome;	
	private String login;	
	private String senha;
	private String email;
	private SituacaoUsuario situacao;
	private RolesUser roles;
	
	public UserDTO(UserModel usuario) {
		BeanUtils.copyProperties(usuario, this);
	}
	
	public UserDTO() {
		
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getLogin() {
		return login;
	}
	public void setLogin(String login) {
		this.login = login;
	}
	public String getSenha() {
		return senha;
	}
	public void setSenha(String senha) {
		this.senha = senha;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	public SituacaoUsuario getSituacao() {
		return situacao;
	}

	public void setSituacao(SituacaoUsuario situacao) {
		this.situacao = situacao;
	}

	public RolesUser getRoles() {
		return roles;
	}

	public void setRoles(RolesUser roles) {
		this.roles = roles;
	}
	
}
