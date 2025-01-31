package com.jmtsu.recordLitoral.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jmtsu.recordLitoral.dto.OcorrenciasDTO;
import com.jmtsu.recordLitoral.models.ImagemModel;
import com.jmtsu.recordLitoral.models.OcorrenciasModel;
import com.jmtsu.recordLitoral.service.ImagemService;
import com.jmtsu.recordLitoral.service.OcorrenciasService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/ocorrencias")
@CrossOrigin
public class OcorrenciasController {

	@Autowired
	private OcorrenciasService ocorrenciasService;
	
	@Autowired
	private ImagemService imagemService;
	
    @PostMapping("/forms")
    public ResponseEntity<OcorrenciasModel> EnvioOcorrencia(@RequestBody @Valid OcorrenciasDTO ocorrenciasDTO) {
    	OcorrenciasModel ocorrenciasModel = ocorrenciasService.envioOcorrencia(ocorrenciasDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ocorrenciasModel);
    }
    
    @GetMapping("/forms/conectar")
    public ResponseEntity<String> conectar() {
        return ResponseEntity.ok("Conexão mantida com sucesso");
    }
    
    
    
    
    @GetMapping("/imagem/{id}")
    public List<ImagemModel> buscarPorOcorrencia(@PathVariable("id") Long ID_OCORRENCIA) {
        return imagemService.buscarPorOcorrencia(ID_OCORRENCIA);
    }
    
    
    
    
    @PostMapping("/imagem")
    public ImagemModel inserir(@RequestParam("ID_OCORRENCIA") Long ID_OCORRENCIA, @RequestParam("file") MultipartFile file)  {
    	return imagemService.inserir(ID_OCORRENCIA, file);
    }
    
    @GetMapping("/{id}")
    public OcorrenciasModel buscarPorId(@PathVariable("id") Long id) {
    	return ocorrenciasService.buscarPorId(id);
    }
}

