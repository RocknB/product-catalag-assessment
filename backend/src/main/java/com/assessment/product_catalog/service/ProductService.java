package com.assessment.product_catalog.service;

import com.assessment.product_catalog.dto.ProductRequest;
import com.assessment.product_catalog.dto.ProductResponse;
import com.assessment.product_catalog.entity.Category;
import com.assessment.product_catalog.entity.Product;
import com.assessment.product_catalog.mapper.ProductMapper;
import com.assessment.product_catalog.repository.CategoryRepository;
import com.assessment.product_catalog.repository.ProductRepository;
import com.assessment.product_catalog.utils.UserUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository,
                          ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }

    public List<ProductResponse> getAllActiveProducts() {
        return productRepository.findByActiveTrue()
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId)
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public int getActiveProductCount() {
        return productRepository.countByActiveTrue();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return productMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse createOrReactivateProduct(ProductRequest request) {

        String username = UserUtil.getCurrentUsername();

        return productRepository.findByName(request.getName())
                .map(existingProduct -> {

                    if (!existingProduct.getActive()) {

                        existingProduct.setActive(true);
                        existingProduct.setDescription(request.getDescription());
                        existingProduct.setPrice(request.getPrice());
                        existingProduct.setUpdatedBy(username);

                        Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new RuntimeException("Category not found"));

                        existingProduct.setCategory(category);

                        return productMapper.toResponse(
                                productRepository.save(existingProduct)
                        );

                    } else {
                        throw new RuntimeException(
                                "Product with name '" + request.getName() + "' already exists"
                        );
                    }
                })
                .orElseGet(() -> {

                    Product product = new Product();

                    product.setName(request.getName());
                    product.setDescription(request.getDescription());
                    product.setPrice(request.getPrice());
                    product.setCreatedBy(username);
                    product.setUpdatedBy(username);

                    Category category = categoryRepository.findById(request.getCategoryId())
                            .orElseThrow(() -> new RuntimeException("Category not found"));

                    product.setCategory(category);

                    return productMapper.toResponse(
                            productRepository.save(product)
                    );
                });
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        String username = UserUtil.getCurrentUsername();

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setUpdatedBy(username);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setCategory(category);

        return productMapper.toResponse(
                productRepository.save(product)
        );
    }

    @Transactional
    public void deactivateProduct(Long id) {

        String username = UserUtil.getCurrentUsername();

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setActive(false);
        product.setUpdatedBy(username);

        productRepository.save(product);
    }
}
