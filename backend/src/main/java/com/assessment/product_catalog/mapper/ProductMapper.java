package com.assessment.product_catalog.mapper;

import com.assessment.product_catalog.dto.ProductResponse;
import com.assessment.product_catalog.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {

        ProductResponse response = new ProductResponse();

        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());

        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
            response.setCategoryName(product.getCategory().getName());
        }

        response.setActive(product.getActive());
        response.setCreatedAt(product.getCreatedAt());
        response.setCreatedBy(product.getCreatedBy());
        response.setUpdatedAt(product.getUpdatedAt());
        response.setUpdatedBy(product.getUpdatedBy());

        return response;
    }
}