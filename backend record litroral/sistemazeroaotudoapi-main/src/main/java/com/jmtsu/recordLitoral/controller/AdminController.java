package com.jmtsu.recordLitoral.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jmtsu.recordLitoral.dto.UserDTO;
import com.jmtsu.recordLitoral.models.CameraModel;
import com.jmtsu.recordLitoral.models.EditorModel;
import com.jmtsu.recordLitoral.models.InspecaoVeiculoModel;
import com.jmtsu.recordLitoral.models.OcorrenciasModel;
import com.jmtsu.recordLitoral.models.RendimentoModel;
import com.jmtsu.recordLitoral.models.RetrancaModel;
import com.jmtsu.recordLitoral.repository.RetrancaRepository;
import com.jmtsu.recordLitoral.service.CameraService;
import com.jmtsu.recordLitoral.service.EditorService;
import com.jmtsu.recordLitoral.service.OcorrenciasService;
import com.jmtsu.recordLitoral.service.UserService;


@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {
	
	@Autowired
	private UserService userService;

	@Autowired
	private CameraService cameraService;

	@Autowired
	private EditorService editorService;
	
	@Autowired
	private OcorrenciasService ocorrenciasService;
	
	
	
	
	@GetMapping("/usuarios")
	public List<UserDTO> listarTodos(){
		return userService.listarTodos();
	}
	
	@PutMapping("/usuarios")
	public UserDTO alterar(@RequestBody UserDTO usuario) {
		return userService.alterar(usuario);
	}
	
	
	
	
	
    @GetMapping("/camera")
    public ResponseEntity<List<CameraModel>> listarTodosEnviosCamera() {
        List<CameraModel> cameras = cameraService.listarTodosEnvioCamera();
        return ResponseEntity.ok(cameras);
    }
    
    @GetMapping("/inspecaoVeiculo")
    public ResponseEntity<List<InspecaoVeiculoModel>> listarTodosEnviosInspecaoVeiculo() {
        List<InspecaoVeiculoModel> veiculo = cameraService.listarTodosEnvioInspecaoVeiculo();
        return ResponseEntity.ok(veiculo);
    }
    
    @GetMapping("/retranca")
    public ResponseEntity<List<RetrancaModel>> listarTodosEnviosRetranca() {
        List<RetrancaModel> retrancas = cameraService.listarTodosEnvioRetranca();
        return ResponseEntity.ok(retrancas);
    }
    
    @GetMapping("/editor")
    public ResponseEntity<List<EditorModel>> listarTodosEnviosEditor() {
        List<EditorModel> editor = editorService.listarTodosEnvioEditor();
        return ResponseEntity.ok(editor);
    }
    
    
    @GetMapping("/ocorrencias")
    public ResponseEntity<List<OcorrenciasModel>> listarTodosEnviosOcorrencias() {
        List<OcorrenciasModel> ocorrencias = ocorrenciasService.listarTodosEnvioOcorrencias();
        return ResponseEntity.ok(ocorrencias);
    }
    
    
    

    
    @GetMapping("/rendimento")
    public ResponseEntity<List<RendimentoModel>> listarTodosEnviosRendimento() {
        List<RendimentoModel> rendimentos = ocorrenciasService.listarTodosRendimento();
        return ResponseEntity.ok(rendimentos);
    }
}
