package com.trung.security.config;

import com.trung.security.exception.JwtAuthenticationEntryPoint;
import com.trung.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {
    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/users/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/v1/students/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MENTOR", "ROLE_STUDENT")
                        .requestMatchers("/api/v1/mentors/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MENTOR", "ROLE_STUDENT")
                        .requestMatchers("/api/v1/internship-phases/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MENTOR", "ROLE_STUDENT")
                        .requestMatchers("/api/v1/evaluation-criterias/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MENTOR", "ROLE_STUDENT")
                        .requestMatchers("/api/v1/assessment-rounds/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MENTOR", "ROLE_STUDENT")
                        .requestMatchers("/api/v1/round-criterias/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MENTOR", "ROLE_STUDENT")
                        .requestMatchers("/api/v1/internship-assignments/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MENTOR", "ROLE_STUDENT")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authenticationEntryPoint()))
                .exceptionHandling(exception -> exception.accessDeniedHandler(accessDeniedHandler()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider());
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return new com.trung.security.exception.AccessDeniedException();
    }
}
