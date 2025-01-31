package com.jmtsu.recordLitoral.dto;


public class RetrancaExistenteDTO {
    
    private String retrancaEscolhida;  // ID da retranca
    private Boolean horaExtra;
    private Boolean execucao;
    private String motivo;

    // Getters e Setters

    public String getRetrancaEscolhida() {
        return retrancaEscolhida;
    }

    public void setRetrancaEscolhida(String retrancaEscolhida) {
        this.retrancaEscolhida = retrancaEscolhida;
    }

    public Boolean getHoraExtra() {
        return horaExtra;
    }

    public void setHoraExtra(Boolean horaExtra) {
        this.horaExtra = horaExtra;
    }

    public Boolean getExecucao() {
        return execucao;
    }

    public void setExecucao(Boolean execucao) {
        this.execucao = execucao;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}
