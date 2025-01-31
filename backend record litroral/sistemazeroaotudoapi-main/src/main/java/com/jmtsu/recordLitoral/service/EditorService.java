package com.jmtsu.recordLitoral.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.jmtsu.recordLitoral.dto.EditorDTO;
import com.jmtsu.recordLitoral.dto.OcorrenciasDTO;
import com.jmtsu.recordLitoral.dto.RetrancaDTO;
import com.jmtsu.recordLitoral.dto.RetrancaExistenteDTO;
import com.jmtsu.recordLitoral.models.CameraModel;
import com.jmtsu.recordLitoral.models.EditorModel;
import com.jmtsu.recordLitoral.models.OcorrenciasModel;
import com.jmtsu.recordLitoral.models.RendimentoModel;
import com.jmtsu.recordLitoral.models.RetrancaExistenteModel;
import com.jmtsu.recordLitoral.models.RetrancaModel;
import com.jmtsu.recordLitoral.models.UserModel;
import com.jmtsu.recordLitoral.models.enums.NivelUrgencia;
import com.jmtsu.recordLitoral.models.enums.SituacaoRetranca;
import com.jmtsu.recordLitoral.producers.UserProducer;
import com.jmtsu.recordLitoral.repository.EditorRepository;
import com.jmtsu.recordLitoral.repository.OcorrenciaRepository;
import com.jmtsu.recordLitoral.repository.RendimentoRepository;
import com.jmtsu.recordLitoral.repository.RetrancaExistenteRepository;
import com.jmtsu.recordLitoral.repository.RetrancaRepository;
import com.jmtsu.recordLitoral.repository.UserRepository;

@Service
public class EditorService {

    //private static final Logger logger = LoggerFactory.getLogger(EditorService.class);

    @Autowired
    private EditorRepository editorRepository;

    @Autowired
    private RetrancaRepository retrancaRepository;

   /* @Autowired
    private RetrancaExistenteRepository retrancaExistenteRepository;*/

    @Autowired
    private RetrancaExistenteService retrancaExistenteService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OcorrenciaRepository ocorrenciasRepository;
    
    @Autowired
    private UserProducer producer; 
    @Autowired
    private RendimentoRepository rendimentoRepository;

    @Transactional
    public EditorModel envioEditor(EditorDTO editorDTO) {
        String login = getAuthenticatedLogin();
        UserModel usuario = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        EditorModel editorModel = new EditorModel();
        editorModel.setUsuario(usuario);
        editorModel.setPresenca(editorDTO.presenca());
        editorModel.setEscolhaRetranca(editorDTO.escolhaRetranca());

        boolean presenca = editorDTO.presenca();
        boolean equipeSemAtividade = false; // Inicialize como false; atualize se necessário
        boolean horaExtraRetrancaCriada = false;
        boolean horaExtraRetrancaExistente = false;

        if (Boolean.FALSE.equals(presenca)) {
            if (!StringUtils.hasText(editorDTO.motivo())) {
                throw new IllegalArgumentException("Motivo é obrigatório se a presença for falsa.");
            }
            editorModel.setMotivo(editorDTO.motivo());
        } else {
            if (Boolean.TRUE.equals(editorDTO.escolhaRetranca())) {
                // Criar nova retranca
                if (editorDTO.criarRetranca() != null && !editorDTO.criarRetranca().isEmpty()) {
                    RetrancaDTO retrancaDTO = editorDTO.criarRetranca().get(0);
                    RetrancaModel retrancaModel = new RetrancaModel();
                    retrancaModel.setRetranca(retrancaDTO.retranca());
                    retrancaModel.setCidade(retrancaDTO.cidade());
                    retrancaModel.setHoraExtra(retrancaDTO.horaExtra());
                    retrancaModel.setExecucao(retrancaDTO.execucao());

                    if (Boolean.TRUE.equals(retrancaDTO.execucao())) {
                        retrancaModel.setStatus(SituacaoRetranca.CONCLUIDA);
                    } else {
                        retrancaModel.setStatus(SituacaoRetranca.INCONCLUSA);
                    }

                    if (Boolean.FALSE.equals(retrancaDTO.execucao()) && StringUtils.hasText(retrancaDTO.motivo())) {
                        retrancaModel.setMotivo(retrancaDTO.motivo());
                    }

                    retrancaRepository.save(retrancaModel);
                    editorModel.setCriarRetranca(retrancaModel);
                    horaExtraRetrancaCriada = retrancaDTO.horaExtra();  // Marca se foi hora extra na nova retranca
                }
            } else {
                // Selecionar retranca existente
                List<RetrancaExistenteDTO> retrancaExistenteDTOList = editorDTO.retrancaExistente();
                if (retrancaExistenteDTOList != null && !retrancaExistenteDTOList.isEmpty()) {
                    RetrancaExistenteDTO retrancaExistenteDTO = retrancaExistenteDTOList.get(0);
                    RetrancaExistenteModel retrancaExistenteModel = retrancaExistenteService.envioRetrancaExistente(retrancaExistenteDTO);
                    editorModel.setRetrancaExistente(retrancaExistenteModel);

                    // Verifica se o editor está fazendo hora extra na retranca existente
                    if (retrancaExistenteDTO.getHoraExtra()) {
                        horaExtraRetrancaExistente = true; // Marca que está fazendo hora extra na retranca existente
                    }
                }
            }
        }

        // Processamento de ocorrências
        if (editorDTO.ocorrencias() != null && !editorDTO.ocorrencias().isEmpty()) {
            OcorrenciasDTO ocorrenciaDTO = editorDTO.ocorrencias().get(0);
            if (ocorrenciaDTO.nivelUrgencia() == NivelUrgencia.NULL) {
                editorModel.setOcorrencias(null);
            } else {
                OcorrenciasModel ocorrenciaModel = new OcorrenciasModel();
                ocorrenciaModel.setUsuario(usuario);
                ocorrenciaModel.setOcorrencia(ocorrenciaDTO.ocorrencia());
                ocorrenciaModel.setNivelUrgencia(ocorrenciaDTO.nivelUrgencia());
                ocorrenciaModel.setImagem(ocorrenciaDTO.imagem());
                ocorrenciaModel.setHoraEnvioRespostas(LocalDateTime.now());

                ocorrenciaModel = ocorrenciasRepository.save(ocorrenciaModel);
                editorModel.setOcorrencias(ocorrenciaModel);
                
                if (ocorrenciaDTO.ocorrencia() != null) {
                    producer.publishOcorrenciaEmail(usuario, ocorrenciaModel);
                }
            }
        }

        editorModel.setHoraEnvioRespostas(LocalDateTime.now());

        // Atualiza a tabela Rendimento
        atualizarRendimento(usuario, presenca, equipeSemAtividade, horaExtraRetrancaCriada, horaExtraRetrancaExistente);

        return editorRepository.save(editorModel);
    }
    private void atualizarRendimento(UserModel usuario, boolean presenca, boolean equipeSemAtividade, boolean horaExtraCriada, boolean horaExtraExistente) {
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
        
        // Incrementa horas extras separadamente
        if (horaExtraCriada) {
            rendimento.setHora_extras(rendimento.getHora_extras() + 1); // Para nova retranca
        }
        if (horaExtraExistente) {
            rendimento.setHora_extras(rendimento.getHora_extras() + 1); // Para retranca existente
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

    public List<EditorModel> listarTodosEnvioEditor() {
        return editorRepository.findAll();
    }

    public List<String> buscarRetrancasPendentes() {
        return retrancaRepository.findRetrancasByStatus(SituacaoRetranca.PENDENTE);
    }
}