package com.trung.repository;

import com.trung.domain.entity.Users;
import com.trung.domain.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByUsernameAndIsDeletedFalseAndIsActiveTrue(String username);
    boolean existsByUsernameAndIsDeletedFalseAndIsActiveTrue(String username);
    boolean existsByEmailAndIsDeletedFalseAndIsActiveTrue(String email);

    Page<Users> findByIsDeletedFalseAndIsActiveTrue(Pageable pageable);
    Page<Users> findByRoleAndIsDeletedFalseAndIsActiveTrue(Role role, Pageable pageable);
}
