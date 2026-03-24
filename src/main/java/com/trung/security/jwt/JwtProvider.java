package com.trung.security.jwt;

import com.trung.domain.entity.Users;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Component
public class JwtProvider {

    @Value("${jwt_secret}")
    private String secretKey;

    @Value("${jwt_expire}")
    private long expire;

    private Key key(){
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    // generate token
    public String generateToken(Users users){
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
        try {
            Jwts.parser()
                    .setSigningKey(key())
                    .parseClaimsJws(token);
            return true;
        }catch (ExpiredJwtException e) {
            request.setAttribute("exception", "ExpiredJwtException");
        }catch (UnsupportedJwtException e) {
            request.setAttribute("exception", "UnsupportedJwtException");
        }catch (IllegalArgumentException e) {
            request.setAttribute("exception", "IllegalArgumentException");
        }catch (SignatureException e) {
            request.setAttribute("exception", "SignatureException");
        }catch (MalformedJwtException e) {
            request.setAttribute("exception", "MalformedJwtException");
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
