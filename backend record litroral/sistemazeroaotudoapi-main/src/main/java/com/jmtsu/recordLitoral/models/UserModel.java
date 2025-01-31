package com.jmtsu.recordLitoral.models;

import java.util.Objects;

import org.springframework.beans.BeanUtils;
import org.springframework.security.core.GrantedAuthority;

import com.jmtsu.recordLitoral.dto.UserDTO;
import com.jmtsu.recordLitoral.models.enums.RolesUser;
import com.jmtsu.recordLitoral.models.enums.SituacaoUsuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_USER")
public class UserModel implements GrantedAuthority{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String nome;
	
	@Column(nullable = false, unique = true)
	private String login;
	
	@Column(nullable = false)
	private String senha;
	
	@Column(nullable = false)
	private String email;
	
	@Enumerated(EnumType.STRING)
	//@Column(nullable = false)
	private SituacaoUsuario situacao;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private RolesUser roles;
	
	public UserModel(UserDTO usuario) {
		BeanUtils.copyProperties(usuario, this);
	}
	
	public UserModel() {
		
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
	

	public RolesUser getRoles() {
		return roles;
	}

	public void setRoles(RolesUser roles) {
		this.roles = roles;
	}

	public void setSituacao(SituacaoUsuario situacao) {
		this.situacao = situacao;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		UserModel other = (UserModel) obj;
		return Objects.equals(id, other.id);
	}

	@Override
	public String getAuthority() {
		return this.roles.toString();
	}
	
	
}
