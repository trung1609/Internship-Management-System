package com.trung.security.jwt;

import com.trung.domain.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Component
@RequiredArgsConstructor
public class JwtProvider {

    private final TokenBlacklistService tokenBlacklistService;

    @Value("${jwt_secret}")
    private String secretKey;

    @Value("${jwt_expire}")
    private long expire;

    private Key key(){
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));// chuyen doi chuoi thanh key
    }

    // generate token
    public String generateToken(User users){
        Date now = new Date();
        Date expireDate = new Date(now.getTime() + expire);
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", users.getRole().name());
        claims.put("email", users.getEmail());
        return Jwts.builder()
                .setSubject(users.getUsername())
                .setIssuedAt(now)
                .setExpiration(expireDate)
                .addClaims(claims)
                .signWith(key(), SignatureAlgorithm.HS512)
                .compact();
    }

    // validate token
    public boolean validateToken(String token, HttpServletRequest request){
        // Kiểm tra token có trong blacklist không
        if (tokenBlacklistService.isTokenBlacklisted(token)) {
            request.setAttribute("error", "TokenBlacklisted");
            return false;
        }

        try {
            Jwts.parser()
                    .setSigningKey(key())
                    .parseClaimsJws(token);
            return true;
        }catch (ExpiredJwtException e) {
            request.setAttribute("error", "ExpiredJwtException");
        }catch (UnsupportedJwtException e) {
            request.setAttribute("error", "UnsupportedJwtException");
        }catch (IllegalArgumentException e) {
            request.setAttribute("error", "IllegalArgumentException");
        }catch (SignatureException e) {
            request.setAttribute("error", "SignatureException");
        }catch (MalformedJwtException e) {
            request.setAttribute("error", "MalformedJwtException");
        }
        return false;
    }

    // get username from token
    public String getUsernameFromToken(String token){
        try {
            return Jwts.parser()
                    .setSigningKey(key())
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        }catch (Exception e){
            return null;
        }
    }

}
