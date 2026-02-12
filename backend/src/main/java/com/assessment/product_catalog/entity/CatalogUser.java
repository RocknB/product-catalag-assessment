package com.assessment.product_catalog.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import static com.assessment.product_catalog.utils.Constants.USER_ROLE;

@Entity
@Table(name = "catalog_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatalogUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotNull
    private String username;

    @Column(nullable = false)
    @NotNull
    private String password;

    /**
     * in case we want to have admins or different permission control
     */
    @Column(nullable = false)
    @NotNull
    private String role = USER_ROLE;

    @Column(nullable = false)
    @NotNull
    private Boolean active = true;

    @Column(name = "created_at")
    @NotNull
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}