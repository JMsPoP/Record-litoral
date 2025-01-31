package com.jmtsu.recordLitoral.service;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jmtsu.recordLitoral.models.ImagemModel;
import com.jmtsu.recordLitoral.models.OcorrenciasModel;
import com.jmtsu.recordLitoral.repository.ImagemRepository;
import com.jmtsu.recordLitoral.repository.OcorrenciaRepository;

@Service
public class ImagemService {

	
	@Autowired
	private ImagemRepository imagemRepository;
	
	@Autowired
	private OcorrenciaRepository ocorrenciaRepository;
	
	public List<ImagemModel> buscarTodos(){
		return imagemRepository.findAll();
	}
	
	
	public List<ImagemModel> buscarPorOcorrencia(Long ID_OCORRENCIA){
		List<ImagemModel> listarImagensOcorrencia = imagemRepository.findByOcorrenciaId(ID_OCORRENCIA);
		 for(ImagemModel imagemModel : listarImagensOcorrencia) {
			 
			 try {
				InputStream in = new FileInputStream("C:/Users/Notebook/OneDrive/Área de Trabalho/professor-api-zeroaotudo/imagem/" + imagemModel.getNome());
				imagemModel.setArquivo(IOUtils.toByteArray(in));
			} catch (IOException e) {
				e.printStackTrace();
			}
		 }
		return listarImagensOcorrencia;
	}
	
	
	public ImagemModel inserir(Long ID_OCORRENCIA, MultipartFile file) {
		OcorrenciasModel ocorrencia = ocorrenciaRepository.findById(ID_OCORRENCIA).get();
		ImagemModel imagem = new ImagemModel();
		try {
			if(!file.isEmpty()) {
				byte[] bytes = file.getBytes();
				String nomeImagem = String.valueOf(ocorrencia.getId()) + file.getOriginalFilename();
				Path caminho = Paths
						.get("C:/Users/Notebook/OneDrive/Área de Trabalho/professor-api-zeroaotudo/imagem/" + nomeImagem);
				Files.write(caminho, bytes);
				
				imagem.setNome(nomeImagem);					
			}
		}catch(IOException e){
			e.printStackTrace();
		}
		
		imagem.setOcorrencia(ocorrencia);
		imagem = imagemRepository.saveAndFlush(imagem);
		
        //ocorrencia.setImagem(imagem);
        //ocorrenciaRepository.saveAndFlush(ocorrencia);
		return imagem;
	}
	
	//						.get("C:/Users/Notebook/OneDrive/Área de Trabalho/professor-api-zeroaotudo/imagem/" + nomeImagem);

}
