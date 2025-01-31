package com.jmtsu.recordLitoral.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jmtsu.recordLitoral.dto.UserDTO;
import com.jmtsu.recordLitoral.models.UserModel;
import com.jmtsu.recordLitoral.models.UserVerifyModel;
import com.jmtsu.recordLitoral.models.enums.SituacaoUsuario;
import com.jmtsu.recordLitoral.producers.UserProducer;
import com.jmtsu.recordLitoral.repository.UserRepository;
import com.jmtsu.recordLitoral.repository.UserVerifyRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserProducer userProducer;
	
	@Autowired
	private UserVerifyRepository userVerifyRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	
	public List<UserDTO> listarTodos(){
		List<UserModel> usuarios = userRepository.findAll();
		return usuarios.stream().map(UserDTO::new).toList();
	}
	
	public void inserir(UserDTO usuario) {
		UserModel userModel = new UserModel(usuario);
		userModel.setSenha(passwordEncoder.encode(usuario.getSenha()));
		userRepository.save(userModel);
	}
	
	@Transactional
	public UserModel inserirNovoUsuario(UserModel userModel) {
		userModel = userRepository.save(userModel);
		userModel.setSenha(passwordEncoder.encode(userModel.getSenha()));
		userModel.setSituacao(SituacaoUsuario.PENDENTE);
	//	usuarioEntity.setId(null);
	//	usuarioRepository.save(usuarioEntity);
		
		UserVerifyModel verificador = new UserVerifyModel();
		verificador.setUsuario(userModel);
		verificador.setUuid(UUID.randomUUID());
		verificador.setDataExpiracao(Instant.now().plusMillis(900000));
		userVerifyRepository.save(verificador);
		
	 	 userProducer.publishMessageEmail(userModel, verificador);
	return userModel;
		
	}
	
	public String verificarCadastro(String uuid) {
	
		UserVerifyModel usuarioVerificacao = userVerifyRepository.findByUuid(UUID.fromString(uuid)).get();
		
		if(usuarioVerificacao != null) {
			if(usuarioVerificacao.getDataExpiracao().compareTo(Instant.now()) >= 0) {
				
				UserModel u = usuarioVerificacao.getUsuario();
				u.setSituacao(SituacaoUsuario.ATIVO);
				
				userRepository.save(u);
				
				return "Usuário Verificado";
			}else {
				userVerifyRepository.delete(usuarioVerificacao);
				return "Tempo de verificação expirado";
			}
		}else {
			return "Usuario não verificado";
		}
		
	}
	
	public UserDTO alterar(UserDTO usuario) {
		UserModel userModel = new UserModel(usuario);
		userModel.setSenha(passwordEncoder.encode(usuario.getSenha()));
		return new UserDTO(userRepository.save(userModel));
	}
	
	public void excluir(Long id) {
		UserModel usuario = userRepository.findById(id).get();
		userRepository.delete(usuario);
	}
	
	public UserDTO buscarPorId(Long id) {
		return new UserDTO(userRepository.findById(id).get());
	}
}
