package com.jmtsu.recordLitoral.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jmtsu.recordLitoral.models.UserVerifyModel;

public interface UserVerifyRepository extends JpaRepository<UserVerifyModel, Long>{

	public Optional<UserVerifyModel> findByUuid(UUID uuid);
}
