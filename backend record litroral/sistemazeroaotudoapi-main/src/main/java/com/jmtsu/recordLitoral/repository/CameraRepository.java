package com.jmtsu.recordLitoral.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jmtsu.recordLitoral.models.CameraModel;

public interface CameraRepository extends JpaRepository<CameraModel, Long>{

}
