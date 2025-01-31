package com.jmtsu.recordLitoral.controller;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jmtsu.recordLitoral.dto.CameraDTO;
import com.jmtsu.recordLitoral.dto.UserDTO;
import com.jmtsu.recordLitoral.models.CameraModel;
import com.jmtsu.recordLitoral.models.UserModel;
import com.jmtsu.recordLitoral.service.CameraService;
import com.jmtsu.recordLitoral.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/camera")
@CrossOrigin
public class CameraController {

	@Autowired
	private CameraService cameraService;
	
	
    @PostMapping("/forms")
    public ResponseEntity<CameraModel> EnvioCamera(@RequestBody @Valid CameraDTO cameraDTO) {
    	CameraModel cameraModel = cameraService.envioCamera(cameraDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(cameraModel);
    }
    
    @GetMapping("/forms/conectar")
    public ResponseEntity<String> conectar() {
        return ResponseEntity.ok("Conexão mantida com sucesso");
    }
}