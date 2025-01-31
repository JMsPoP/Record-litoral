package com.jmtsu.recordLitoral.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jmtsu.recordLitoral.models.RetrancaModel;
import com.jmtsu.recordLitoral.models.enums.SituacaoRetranca;

import java.util.List;
import java.util.Optional;

@Repository
public interface RetrancaRepository extends JpaRepository<RetrancaModel, Long> {

    @Query("SELECT r FROM RetrancaModel r WHERE r.retranca = :retranca")
    Optional<RetrancaModel> findByRetranca(@Param("retranca") String retranca);

    @Query("SELECT r.retranca FROM RetrancaModel r WHERE r.status = :status")
    List<String> findRetrancasByStatus(@Param("status") SituacaoRetranca status);
}
