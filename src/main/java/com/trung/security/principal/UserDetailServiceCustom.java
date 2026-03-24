package com.trung.security.principal;

import com.trung.domain.entity.Users;
import com.trung.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailServiceCustom implements UserDetailsService {
    private final IUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users users = userRepository.findByUsernameAndIsDeletedFalseAndIsActiveTrue(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return UserPrincipal.builder()
                .users(users)
                .authorities(
                        users.getRole() != null
                                ? Collections.singleton(new SimpleGrantedAuthority(users.getRole().name()))
                                : Collections.emptyList()
                )
                .build();
    }
}
