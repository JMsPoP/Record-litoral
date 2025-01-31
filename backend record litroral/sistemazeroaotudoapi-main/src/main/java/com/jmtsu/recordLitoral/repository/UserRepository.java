package com.jmtsu.recordLitoral.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jmtsu.recordLitoral.models.UserModel;

public interface UserRepository extends JpaRepository<UserModel, Long>{

	Optional<UserModel> findByLogin(String login);
}
