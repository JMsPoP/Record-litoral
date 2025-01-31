package com.jmtsu.recordLitoral.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.jmtsu.recordLitoral.dto.OcorrenciasDTO;
import com.jmtsu.recordLitoral.models.OcorrenciasModel;
import com.jmtsu.recordLitoral.models.RendimentoModel;
import com.jmtsu.recordLitoral.models.UserModel;
import com.jmtsu.recordLitoral.producers.UserProducer;
import com.jmtsu.recordLitoral.repository.OcorrenciaRepository;
import com.jmtsu.recordLitoral.repository.RendimentoRepository;
import com.jmtsu.recordLitoral.repository.UserRepository;

@Service
public class OcorrenciasService {

    @Autowired
    private OcorrenciaRepository ocorrenciaRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RendimentoRepository rendimentoRepository;

    @Autowired
    private UserProducer producer; 
    
    @Transactional
    public OcorrenciasModel envioOcorrencia(OcorrenciasDTO ocorrenciasDTO) {
        String login = getAuthenticatedLogin();
        UserModel usuario = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        OcorrenciasModel ocorrenciasModel = new OcorrenciasModel();
        ocorrenciasModel.setUsuario(usuario);
        ocorrenciasModel.setPresenca(ocorrenciasDTO.presenca());
        
        boolean equipeSemAtividade = false; // Adicione lógica para determinar se a equipe está sem atividade
        boolean horaExtra = ocorrenciasDTO.horaExtra() != null && ocorrenciasDTO.horaExtra();

        if (Boolean.FALSE.equals(ocorrenciasDTO.presenca())) {
            if (!StringUtils.hasText(ocorrenciasDTO.motivoFalta())) {
                throw new IllegalArgumentException("Motivo da falta é obrigatório se a presença for falsa.");
            }
            ocorrenciasModel.setMotivoFalta(ocorrenciasDTO.motivoFalta());
        } else {
            if (horaExtra) {
                if (!StringUtils.hasText(ocorrenciasDTO.motivoHoraExtra())) {
                    throw new IllegalArgumentException("Motivo da hora extra é obrigatório se houve hora extra.");
                }
                ocorrenciasModel.setMotivoHoraExtra(ocorrenciasDTO.motivoHoraExtra());
            }
        }

        ocorrenciasModel.setOcorrencia(ocorrenciasDTO.ocorrencia());
        ocorrenciasModel.setNivelUrgencia(ocorrenciasDTO.nivelUrgencia());
        
        if (ocorrenciasDTO.ocorrencia() != null && ocorrenciasDTO.nivelUrgencia() != null) {
            producer.publishOcorrenciaEmail(usuario, ocorrenciasModel);
        }
        
        ocorrenciasModel.setImagem(ocorrenciasDTO.imagem());
    
        ocorrenciasModel.setHoraEnvioRespostas(LocalDateTime.now());

        // Salvar a ocorrência no repositório
        OcorrenciasModel savedOcorrencia = ocorrenciaRepository.save(ocorrenciasModel);

        // Atualizar o rendimento
        atualizarRendimento(usuario, ocorrenciasModel.getPresenca(), equipeSemAtividade, horaExtra);

        return savedOcorrencia;
    }
    
    private void atualizarRendimento(UserModel usuario, boolean presenca, boolean equipeSemAtividade, boolean horaExtra) {
        RendimentoModel rendimento = rendimentoRepository.findByUsuario(usuario);
        
        if (rendimento == null) {
            rendimento = new RendimentoModel();
            rendimento.setUsuario(usuario);
            rendimento.setFaltas(0);
            rendimento.setEquipe_sem_atividade(0);
            rendimento.setEnvios(0);
            rendimento.setEnvios_sucesso(0);
            rendimento.setHora_extras(0);
        }
        
        // Atualizações com base nos envios
        if (!presenca) {
            rendimento.setFaltas(rendimento.getFaltas() + 1);
        }

        if (equipeSemAtividade) {
            rendimento.setEquipe_sem_atividade(rendimento.getEquipe_sem_atividade() + 1);
        }

        rendimento.setEnvios(rendimento.getEnvios() + 1);
        rendimento.setEnvios_sucesso(rendimento.getEnvios() - rendimento.getFaltas() - rendimento.getEquipe_sem_atividade());
        
        if (horaExtra) {
            rendimento.setHora_extras(rendimento.getHora_extras() + 1);
        }

        rendimentoRepository.save(rendimento);
    }

    private String getAuthenticatedLogin() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }
    
    public List<OcorrenciasModel> listarTodosEnvioOcorrencias() {
        return ocorrenciaRepository.findAll();
    }

    public List<RendimentoModel> listarTodosRendimento() {
        return rendimentoRepository.findAll();
    }
    
    public OcorrenciasModel buscarPorId(Long id) {
    	OcorrenciasModel ocorrencia = ocorrenciaRepository.findById(id).get();
    	return ocorrencia;
    }
}
