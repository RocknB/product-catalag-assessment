package com.assessment.product_catalog.controller;

import com.assessment.product_catalog.security.JWTUtil;
import com.assessment.product_catalog.dto.CatalogUserRegistrationRequest;
import com.assessment.product_catalog.dto.LoginRequest;
import com.assessment.product_catalog.dto.LoginResponse;
import com.assessment.product_catalog.repository.CatalogUserRepository;
import com.assessment.product_catalog.entity.CatalogUser;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import static com.assessment.product_catalog.utils.Constants.USER_ROLE;

/**
 * API to manage user related requests.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CatalogUserRepository catalogUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * On registration, we check for uniqueness
     * @param request - From the frontend, we only get the username and pw
     * @return
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody CatalogUserRegistrationRequest request) {
        if (catalogUserRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Username already exists");
        }

        CatalogUser newUser = new CatalogUser();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(USER_ROLE);
        newUser.setActive(true);

        catalogUserRepository.save(newUser);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginHandler( @RequestBody LoginRequest loginRequest) {
        try{
            String username = loginRequest.getUsername();

            UsernamePasswordAuthenticationToken authInputToken =
                    new UsernamePasswordAuthenticationToken(username, loginRequest.getPassword());
            authenticationManager.authenticate(authInputToken);

            String token = jwtUtil.generateToken(username);

            CatalogUser user = catalogUserRepository.findByUsername(username).orElseThrow();

            return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getRole()));
        } catch(AuthenticationException authExc){
            throw new RuntimeException("Invalid username/password.");
        }

    }

}