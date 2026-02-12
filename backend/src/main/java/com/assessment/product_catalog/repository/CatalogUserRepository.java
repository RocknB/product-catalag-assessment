package com.assessment.product_catalog.repository;

import com.assessment.product_catalog.entity.CatalogUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CatalogUserRepository extends JpaRepository<CatalogUser, Long> {
    Optional<CatalogUser> findByUsername(String username);
}