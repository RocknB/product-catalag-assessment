package com.assessment.product_catalog.controller;

import com.assessment.product_catalog.entity.CatalogUser;
import com.assessment.product_catalog.repository.CatalogUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

/**
 * Controller to get user info, like roles, last login, etc.
 */
@RestController
@RequestMapping("/api/user")
public class CatalogUserController {

    @Autowired
    private CatalogUserRepository catalogUserRepository;

    @GetMapping("/info")
    public CatalogUser getUserDetails(){
        String userName = (String) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();
        if (catalogUserRepository.findByUsername(userName).isPresent()) {
            return catalogUserRepository.findByUsername(userName).get();
        }
        return null;
    }
}
