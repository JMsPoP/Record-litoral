package com.jmtsu.recordLitoral.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jmtsu.recordLitoral.dto.RetrancaExistenteDTO;
import com.jmtsu.recordLitoral.models.RetrancaExistenteModel;
import com.jmtsu.recordLitoral.models.RetrancaModel;
import com.jmtsu.recordLitoral.models.enums.SituacaoRetranca;
import com.jmtsu.recordLitoral.repository.RetrancaExistenteRepository;
import com.jmtsu.recordLitoral.repository.RetrancaRepository;

import java.util.Optional;

@Service
public class RetrancaExistenteService {

    @Autowired
    private RetrancaExistenteRepository retrancaExistenteRepository;

    @Autowired
    private RetrancaRepository retrancaRepository;

    public RetrancaExistenteModel envioRetrancaExistente(RetrancaExistenteDTO retrancaExistenteDTO) {
        // Busca a retranca pelo nome, que deve ser uma String
        Optional<RetrancaModel> retrancaOpt = retrancaRepository.findByRetranca(retrancaExistenteDTO.getRetrancaEscolhida());

        if (retrancaOpt.isEmpty()) {
            throw new RuntimeException("Retranca escolhida não foi encontrada.");
        }

        RetrancaModel retrancaModel = retrancaOpt.get();

        if (!SituacaoRetranca.PENDENTE.equals(retrancaModel.getStatus())) {
            throw new RuntimeException("Somente retrancas com status PENDENTE podem ser escolhidas.");
        }

        RetrancaExistenteModel retrancaExistente = new RetrancaExistenteModel();
        retrancaExistente.setRetrancaEscolhida(retrancaModel);
        retrancaExistente.setHoraExtra(retrancaExistenteDTO.getHoraExtra());
        retrancaExistente.setExecucao(retrancaExistenteDTO.getExecucao());

        if (!retrancaExistenteDTO.getExecucao()) {
            if (retrancaExistenteDTO.getMotivo() == null || retrancaExistenteDTO.getMotivo().trim().isEmpty()) {
                throw new RuntimeException("Motivo é obrigatório quando a execução não é concluída.");
            }
            retrancaExistente.setMotivo(retrancaExistenteDTO.getMotivo());
        } else {
            retrancaExistente.setMotivo(null); 
        }

        retrancaModel.setStatus(Boolean.TRUE.equals(retrancaExistenteDTO.getExecucao()) 
                                ? SituacaoRetranca.CONCLUIDA 
                                : SituacaoRetranca.INCONCLUSA);

        retrancaExistenteRepository.save(retrancaExistente);
        retrancaRepository.save(retrancaModel);

        return retrancaExistente;
    }
}
