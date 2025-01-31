package com.jmtsu.recordLitoral.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.jmtsu.recordLitoral.dto.EditorDTO;
import com.jmtsu.recordLitoral.dto.RetrancaExistenteDTO;
import com.jmtsu.recordLitoral.models.EditorModel;
import com.jmtsu.recordLitoral.models.RetrancaExistenteModel;
import com.jmtsu.recordLitoral.models.RetrancaModel;
import com.jmtsu.recordLitoral.service.EditorService;
import com.jmtsu.recordLitoral.service.RetrancaExistenteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/editor")
@CrossOrigin
public class EditorController {

    @Autowired
    private EditorService editorService;

	
    @PostMapping("/forms")
    public ResponseEntity<EditorModel> EnvioEditor(@RequestBody @Valid EditorDTO editorDTO) {
    	EditorModel editorModel = editorService.envioEditor(editorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(editorModel);
    }
	
	
    @GetMapping("/forms/conectar")
    public ResponseEntity<String> conectar() {
        return ResponseEntity.ok("Conexão mantida com sucesso");
    }
    
    
    @GetMapping("/forms")
    public ResponseEntity<List<String>> listarTodos() {
        List<String> retrancasPendentes = editorService.buscarRetrancasPendentes();
        return ResponseEntity.ok(retrancasPendentes);
    }
    @Autowired
    private RetrancaExistenteService retrancaExistenteService;
    
    @PostMapping("/RetrancaExistente")
    public ResponseEntity<RetrancaExistenteModel> envioRetrancaExistente(@RequestBody @Valid RetrancaExistenteDTO retrancaExistenteDTO) {
        RetrancaExistenteModel retrancaExistenteModel = retrancaExistenteService.envioRetrancaExistente(retrancaExistenteDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(retrancaExistenteModel);
    }
}
