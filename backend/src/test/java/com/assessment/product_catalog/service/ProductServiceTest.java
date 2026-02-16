package com.assessment.product_catalog.service;

import com.assessment.product_catalog.dto.ProductRequest;
import com.assessment.product_catalog.dto.ProductResponse;
import com.assessment.product_catalog.entity.Category;
import com.assessment.product_catalog.entity.Product;
import com.assessment.product_catalog.mapper.ProductMapper;
import com.assessment.product_catalog.repository.CategoryRepository;
import com.assessment.product_catalog.repository.ProductRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock private ProductRepository productRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private ProductMapper productMapper;
    @InjectMocks private ProductService productService;

    private Category category;
    private Product product;
    private ProductRequest request;
    private ProductResponse response;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("testuser", "pass"));

        category = new Category();
        category.setId(1L);
        category.setName("Electronics");

        product = new Product();
        product.setId(1L);
        product.setName("Laptop");
        product.setDescription("A laptop");
        product.setPrice(new BigDecimal("999.99"));
        product.setCategory(category);
        product.setActive(true);

        request = new ProductRequest();
        request.setName("Laptop");
        request.setDescription("A laptop");
        request.setPrice(new BigDecimal("999.99"));
        request.setCategoryId(1L);

        response = new ProductResponse();
        response.setId(1L);
        response.setName("Laptop");
        response.setPrice(new BigDecimal("999.99"));
        response.setCategoryName("Electronics");
        response.setActive(true);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createProduct() {
        when(productRepository.findByName("Laptop")).thenReturn(Optional.empty());
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(productMapper.toResponse(product)).thenReturn(response);

        ProductResponse result = productService.createOrReactivateProduct(request);

        assertEquals("Laptop", result.getName());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void listActiveProducts() {
        when(productRepository.findByActiveTrue()).thenReturn(List.of(product));
        when(productMapper.toResponse(product)).thenReturn(response);

        List<ProductResponse> results = productService.getAllActiveProducts();

        assertEquals(1, results.size());
        assertEquals("Laptop", results.get(0).getName());
    }

    @Test
    void getProductById() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productMapper.toResponse(product)).thenReturn(response);

        ProductResponse result = productService.getProductById(1L);

        assertEquals(1L, result.getId());
    }

    @Test
    void updateProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(productMapper.toResponse(any(Product.class))).thenReturn(response);

        ProductResponse result = productService.updateProduct(1L, request);

        assertNotNull(result);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void deleteProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        productService.deactivateProduct(1L);

        assertFalse(product.getActive());
        verify(productRepository).save(product);
    }
}
