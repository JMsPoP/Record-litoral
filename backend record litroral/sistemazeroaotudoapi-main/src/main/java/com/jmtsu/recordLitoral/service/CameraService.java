package com.jmtsu.recordLitoral.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.jmtsu.recordLitoral.dto.CameraDTO;
import com.jmtsu.recordLitoral.dto.CameraEquipamentoDTO;
import com.jmtsu.recordLitoral.dto.CameraServicoDTO;
import com.jmtsu.recordLitoral.dto.InspecaoVeiculoDTO;
import com.jmtsu.recordLitoral.dto.OcorrenciasDTO;
import com.jmtsu.recordLitoral.dto.RetrancaDTO;
import com.jmtsu.recordLitoral.models.CameraEquipamentoModel;
import com.jmtsu.recordLitoral.models.CameraModel;
import com.jmtsu.recordLitoral.models.CameraServicoModel;
import com.jmtsu.recordLitoral.models.InspecaoVeiculoModel;
import com.jmtsu.recordLitoral.models.OcorrenciasModel;
import com.jmtsu.recordLitoral.models.RendimentoModel;
import com.jmtsu.recordLitoral.models.RetrancaModel;
import com.jmtsu.recordLitoral.models.UserModel;
import com.jmtsu.recordLitoral.models.enums.EquipeSemAtividade;
import com.jmtsu.recordLitoral.models.enums.NivelUrgencia;
import com.jmtsu.recordLitoral.models.enums.SituacaoRetranca;
import com.jmtsu.recordLitoral.producers.UserProducer;
import com.jmtsu.recordLitoral.repository.*;

@Service
public class CameraService {

    @Autowired
    private CameraRepository cameraRepository;
    
    @Autowired
    private CameraServicoRepository cameraServicoRepository;
    
    @Autowired
    private CameraEquipamentoRepository cameraEquipamentoRepository;
    
    @Autowired
    private RetrancaRepository retrancaRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InspecaoVeiculoRepository inspecaoVeiculoRepository;

    @Autowired
    private OcorrenciaRepository ocorrenciasRepository;
    
    @Autowired
    private UserProducer producer; 

    @Autowired
    private RendimentoRepository rendimentoRepository;

    @Transactional
    public CameraModel envioCamera(CameraDTO cameraDTO) {
        String login = getAuthenticatedLogin();
        UserModel usuario = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        CameraModel cameraModel = new CameraModel();
        cameraModel.setUsuario(usuario);
        cameraModel.setPresenca(cameraDTO.presenca());

        if (Boolean.FALSE.equals(cameraDTO.presenca())) {
            if (!StringUtils.hasText(cameraDTO.motivo())) {
                throw new IllegalArgumentException("Motivo é obrigatório se a presença for falsa.");
            }
            cameraModel.setMotivo(cameraDTO.motivo());
        } 

else if (cameraDTO.servico() != null && !cameraDTO.servico().isEmpty()) {
            CameraServicoDTO servicoDTO = cameraDTO.servico().get(0);
            CameraServicoModel servicoModel = new CameraServicoModel();

            servicoModel.setEquipeSemAtividade(servicoDTO.equipeSemAtividade() != null ? servicoDTO.equipeSemAtividade() : false);

            if (Boolean.TRUE.equals(servicoDTO.equipeSemAtividade())) {
                servicoModel.setTipoSemAtividade(servicoDTO.tipoSemAtividade());
                

                if (servicoDTO.tipoSemAtividade() == EquipeSemAtividade.OUTROS && !StringUtils.hasText(servicoDTO.outros())) {
                    throw new IllegalArgumentException("Se 'Outros' for selecionado, o motivo deve ser preenchido.");
                    
                }

                servicoModel.setOutros(servicoDTO.outros());
            } else if (Boolean.TRUE.equals(servicoDTO.notaCoberta())) {
                servicoModel.setNotaCoberta(true);
            } else if (StringUtils.hasText(servicoDTO.reporter())) {
                servicoModel.setReporter(servicoDTO.reporter());
            } else {
                throw new IllegalArgumentException("Uma opção válida de serviço deve ser selecionada.");
            }
            boolean equipeSemAtividade = servicoModel.getEquipeSemAtividade();
            CameraEquipamentoModel equipamentoModel = null;
            if (cameraDTO.equipamento() != null && !cameraDTO.equipamento().isEmpty() && !equipeSemAtividade) {
            	
                CameraEquipamentoDTO equipamentoDTO = cameraDTO.equipamento().get(0);

                equipamentoModel = new CameraEquipamentoModel();
                equipamentoModel.setKitCamera(equipamentoDTO.kitCamera());
                equipamentoModel.setEquipamentoCamera(equipamentoDTO.equipamentoCamera());
                equipamentoModel.setBateriaCamera(equipamentoDTO.bateriaCamera());
                equipamentoModel.setPilhas(equipamentoDTO.pilhas());
                equipamentoModel.setMochilink(equipamentoDTO.mochilink());
                equipamentoModel.setObs(equipamentoDTO.obs());

                cameraEquipamentoRepository.save(equipamentoModel);
            }
    


        // Processamento de inspeção de veículo
            if (cameraDTO.inspecaoVeiculo() != null && !cameraDTO.inspecaoVeiculo().isEmpty() && !equipeSemAtividade) {
                // Verifica se a equipe está sem atividade
                    InspecaoVeiculoDTO inspecaoDTO = cameraDTO.inspecaoVeiculo().get(0);
                    
                    InspecaoVeiculoModel inspecaoModel = new InspecaoVeiculoModel();
                    inspecaoModel.setVeiculo(inspecaoDTO.veiculo());
                    inspecaoModel.setVerificar_Condicoes(inspecaoDTO.verificar_Condicoes());
                    inspecaoModel.setDanos(inspecaoDTO.danos());
                    inspecaoModel.setTipo_Danos_Veiculo(inspecaoDTO.tipo_Danos_Veiculo());
                    inspecaoModel.setKmInicial(inspecaoDTO.kmInicial());
                    inspecaoModel.setKmFinal(inspecaoDTO.kmFinal());
                    inspecaoModel.setObs(inspecaoDTO.obs());
                    
                    inspecaoModel = inspecaoVeiculoRepository.save(inspecaoModel);
                    cameraModel.setInspecaoVeiculo(inspecaoModel);
                
            }

            // Salvar o serviço
            servicoModel = cameraServicoRepository.save(servicoModel);
            cameraModel.setServico(servicoModel);
            cameraModel.setEquipamento(equipamentoModel);
            
            
            
            
            if (cameraDTO.retranca() != null && !cameraDTO.retranca().isEmpty() && !equipeSemAtividade) {
                RetrancaDTO retrancaDTO = cameraDTO.retranca().get(0);
                RetrancaModel retrancaModel = new RetrancaModel();
                retrancaModel.setRetranca(retrancaDTO.retranca());
                retrancaModel.setCidade(retrancaDTO.cidade());
                retrancaModel.setHoraExtra(retrancaDTO.horaExtra());
                retrancaModel.setExecucao(retrancaDTO.execucao());

                if (Boolean.FALSE.equals(retrancaDTO.execucao()) && StringUtils.hasText(retrancaDTO.motivo())) {
                    retrancaModel.setMotivo(retrancaDTO.motivo());
                } else if (Boolean.TRUE.equals(retrancaDTO.execucao()) && StringUtils.hasText(retrancaDTO.motivo())) {
                    throw new IllegalArgumentException("Por qual 'motivo' não pode fazer a execução?");
                } else if (Boolean.FALSE.equals(retrancaDTO.execucao()) && !StringUtils.hasText(retrancaDTO.motivo())) {
                    throw new IllegalArgumentException("Por qual 'motivo' não pode fazer a execução?");
                }

                // Define o status com base no valor de execucao
                if (Boolean.TRUE.equals(retrancaDTO.execucao())) {
                    retrancaModel.setStatus(SituacaoRetranca.PENDENTE);
                } else {
                    retrancaModel.setStatus(SituacaoRetranca.INCONCLUSA);
                }

                retrancaModel = retrancaRepository.save(retrancaModel);
                cameraModel.setRetranca(retrancaModel);
            } else if (!equipeSemAtividade) {
                throw new IllegalArgumentException("As perguntas de retranca devem ser preenchidas.");
            }
        }

        cameraModel.setLinks(cameraDTO.links());


        if (cameraDTO.ocorrencias() != null && !cameraDTO.ocorrencias().isEmpty()) {
            OcorrenciasDTO ocorrenciaDTO = cameraDTO.ocorrencias().get(0);
            
            // Verifica se o nivelUrgencia é null
            if (ocorrenciaDTO.nivelUrgencia() == NivelUrgencia.NULL) {
                cameraModel.setOcorrencias(null); // Define como null se nivelUrgencia for null
            } else {
                OcorrenciasModel ocorrenciaModel = new OcorrenciasModel();
                ocorrenciaModel.setUsuario(usuario);
                ocorrenciaModel.setOcorrencia(ocorrenciaDTO.ocorrencia());
                ocorrenciaModel.setNivelUrgencia(ocorrenciaDTO.nivelUrgencia());
                ocorrenciaModel.setImagem(ocorrenciaDTO.imagem());
                ocorrenciaModel.setHoraEnvioRespostas(LocalDateTime.now());

                // Salva a ocorrência
                ocorrenciaModel = ocorrenciasRepository.save(ocorrenciaModel);
                cameraModel.setOcorrencias(ocorrenciaModel);

                // Somente envia o email se Ocorrencia e NivelUrgencia NÃO forem nulos
                if (ocorrenciaDTO.ocorrencia() != null) {
                    producer.publishOcorrenciaEmail(usuario, ocorrenciaModel);
                }
            }
        }

        // Processamento para o rendimento
        boolean presenca = cameraDTO.presenca() != null && cameraDTO.presenca();
        boolean equipeSemAtividade = false;

        if (cameraDTO.servico() != null && !cameraDTO.servico().isEmpty()) {
            CameraServicoDTO servicoDTO = cameraDTO.servico().get(0);
            equipeSemAtividade = servicoDTO.equipeSemAtividade() != null && servicoDTO.equipeSemAtividade();
        }

        boolean horaExtra = false;
        if (cameraDTO.retranca() != null && !cameraDTO.retranca().isEmpty()) {
            RetrancaDTO retrancaDTO = cameraDTO.retranca().get(0);
            horaExtra = retrancaDTO.horaExtra() != null && retrancaDTO.horaExtra();
        }

        // Atualiza a tabela Rendimento
        atualizarRendimento(usuario, presenca, equipeSemAtividade, horaExtra);

        if (equipeSemAtividade) {
            cameraModel.setEquipamento(null);
            cameraModel.setInspecaoVeiculo(null);
            cameraModel.setLinks(null);
            cameraModel.setRetranca(null);
        }

        
        cameraModel.setHoraEnvioRespostas(LocalDateTime.now());
        return cameraRepository.save(cameraModel);
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
    
    public List<CameraModel> listarTodosEnvioCamera() {
        return cameraRepository.findAll();
    }
    
    public List<InspecaoVeiculoModel> listarTodosEnvioInspecaoVeiculo() {
        return inspecaoVeiculoRepository.findAll();
    }
    
    public List<RetrancaModel> listarTodosEnvioRetranca() {
        return retrancaRepository.findAll();
    }
}
