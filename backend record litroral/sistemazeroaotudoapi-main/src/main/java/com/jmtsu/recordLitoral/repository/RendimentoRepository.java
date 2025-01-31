package com.jmtsu.recordLitoral.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jmtsu.recordLitoral.models.RendimentoModel;
import com.jmtsu.recordLitoral.models.UserModel;

@Repository
public interface RendimentoRepository extends JpaRepository<RendimentoModel, Long> {
    
    RendimentoModel findByUsuario(UserModel usuario);
}
