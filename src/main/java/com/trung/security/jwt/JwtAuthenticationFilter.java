package com.trung.security.jwt;

import com.trung.domain.entity.Users;
import com.trung.repository.IUserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserDetailsService userDetailsService;
    private final IUserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = getTokenFromRequest(request);
            if (token != null && jwtProvider.validateToken(token, request)){
                String username = jwtProvider.getUsernameFromToken(token);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (userDetails != null){
                    Users users = userRepository.findByUsernameAndIsDeletedFalseAndIsActiveTrue(username)
                            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

                    if (users != null && users.isActive() && !users.isDeleted()){
                        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities()
                        ));
                    }else {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User is not active or deleted");
                        return;
                    }
                }
                filterChain.doFilter(request, response);
            }
        }catch (Exception e) {
            log.error(e.getMessage());
        }
        filterChain.doFilter(request, response);
    }

    // get token from request
    private String getTokenFromRequest(HttpServletRequest request){
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")){
            return token.substring(7);
        }
        return null;
    }
}
