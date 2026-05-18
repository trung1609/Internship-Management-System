package com.trung.repository;

import com.trung.entity.User;
import com.trung.util.enums.Role;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndIsDeletedFalseAndIsActiveTrue(String username);

    boolean existsByUsernameAndIsDeletedFalseAndIsActiveTrue(String username);

    boolean existsByEmailAndIsDeletedFalseAndIsActiveTrue(String email);

    Optional<User> findByUserIdAndIsDeletedFalseAndIsActiveTrue(Long userId);

    Optional<User> findByUserIdAndIsDeletedFalse(Long userId);

    Page<User> findAllByIsDeletedFalseAndIsActiveTrue(Pageable pageable);

    Page<User> findByRoleAndIsDeletedFalseAndIsActiveTrue(Role role, Pageable pageable);

    boolean existsByUsernameAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(String username, Long id);

    boolean existsByEmailAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(String email, Long id);

}
