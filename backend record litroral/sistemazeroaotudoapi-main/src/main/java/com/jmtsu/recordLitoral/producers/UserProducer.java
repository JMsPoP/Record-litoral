package com.jmtsu.recordLitoral.producers;


import com.jmtsu.recordLitoral.dto.EmailDTO;
import com.jmtsu.recordLitoral.models.OcorrenciasModel;
import com.jmtsu.recordLitoral.models.UserModel;
import com.jmtsu.recordLitoral.models.UserVerifyModel;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class UserProducer {

    final RabbitTemplate rabbitTemplate;

    public UserProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Value(value = "${broker.queue.email.name}")
    private String routingKey;

    public void publishMessageEmail(UserModel userModel, UserVerifyModel userVerifyModel) {
        var emailDTO = new EmailDTO();
        emailDTO.setId(userModel.getId());
        emailDTO.setEmailTo("Jm.teles.silva@gmail.com");
        emailDTO.setSubject("Novo cadastro na Aplicação!");
        emailDTO.setText("Olá novamente! \nO usuario " + userModel.getNome() + " realizou cadastro, o codigo de verificação de acesso é: " + userVerifyModel.getUuid() + "\n O prazo de verificação é de 1 hora. \nObrigado pela atenção!");

        rabbitTemplate.convertAndSend("", routingKey, emailDTO);
    }
    
    
    public void publishOcorrenciaEmail(UserModel userModel, OcorrenciasModel ocorrenciaModel) {
        var emailDTO = new EmailDTO();
        emailDTO.setId(userModel.getId());
        emailDTO.setEmailTo("Jm.teles.silva@gmail.com");
        emailDTO.setSubject("Relatorio de Ocorrência!");
        emailDTO.setText("Olá novamente! \nO usuario " + userModel.getNome() + " enviou um relatorio de ocorrência caracterizada como " + ocorrenciaModel.getNivelUrgencia() + "\nTrazendo a seguinte ocorrência: \n'" + ocorrenciaModel.getOcorrencia() + "'");

        rabbitTemplate.convertAndSend("", routingKey, emailDTO);
    }
}
