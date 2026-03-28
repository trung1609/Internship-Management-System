package com.trung.security.jwt;

import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenBlacklistService {

    private final RedisTemplate<String, String> redisTemplate;

    @Value("${jwt_secret}")
    private String secretKey;

    private static final String BLACKLIST_PREFIX = "blacklist-token:";


    public void addToBlacklist(String token) {
        try {
            // Lấy expiration time từ token
            long expirationTime = getExpireFromToken(token);
            long timeToLive = (expirationTime - System.currentTimeMillis()) / 1000; // Chuyen sang giay

            if (timeToLive > 0) {
                String blacklistKey = BLACKLIST_PREFIX + token;
                // Lưu token vào Redis với TTL value
                String ttlValue = "ttl=" + timeToLive;
                redisTemplate.opsForValue().set(blacklistKey, ttlValue, timeToLive, TimeUnit.SECONDS);
            }
        } catch (Exception e) {
            log.error("Error adding token to blacklist: {}", e.getMessage());
        }
    }

    public boolean isTokenBlacklisted(String token) {
        try {
            String blacklistKey = BLACKLIST_PREFIX + token;
            Boolean exists = redisTemplate.hasKey(blacklistKey);
            return exists != null && exists;
        } catch (Exception e) {
            log.error("Error checking token blacklist: {}", e.getMessage());
            return false;
        }
    }

    public void removeFromBlacklist(String token) {
        try {
            String blacklistKey = BLACKLIST_PREFIX + token;
            redisTemplate.delete(blacklistKey);
            log.info("Token removed from blacklist");
        } catch (Exception e) {
            log.error("Error removing token from blacklist: {}", e.getMessage());
        }
    }
    

    private long getExpireFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey.getBytes(StandardCharsets.UTF_8))
                .parseClaimsJws(token)
                .getBody().getExpiration()
                .getTime();
    }
}

