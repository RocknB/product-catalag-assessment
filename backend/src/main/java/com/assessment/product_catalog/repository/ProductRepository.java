package com.assessment.product_catalog.repository;

import com.assessment.product_catalog.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue();
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);
    Optional<Product> findByNameAndActiveTrue(String name);
    Optional<Product> findByName(String name);
    
    int countByActiveTrue();
}