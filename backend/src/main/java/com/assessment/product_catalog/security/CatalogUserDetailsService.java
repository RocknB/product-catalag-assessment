package com.assessment.product_catalog.security;

import com.assessment.product_catalog.entity.CatalogUser;
import com.assessment.product_catalog.repository.CatalogUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;

import static com.assessment.product_catalog.utils.Constants.USER_ROLE;

@Component
public class CatalogUserDetailsService implements UserDetailsService {

    @Autowired
    private CatalogUserRepository catalogUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<CatalogUser> userRes = catalogUserRepository.findByUsername(username);

        if (userRes.isEmpty())
            throw new UsernameNotFoundException("No user found with this username " + username);

        CatalogUser user = userRes.get();
        return new
            User(
                username,
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + USER_ROLE))
        );
    }
}
