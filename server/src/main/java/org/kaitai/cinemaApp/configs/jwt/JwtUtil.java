package org.kaitai.cinemaApp.configs.jwt;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.kaitai.cinemaApp.dto.user.req.UserDtoReq;
import org.kaitai.cinemaApp.models.user.UserModel;
import org.kaitai.cinemaApp.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${app.secret}")
    private String jwtSecret;

    private final int accessTokenExpirationMs = 1000 * 60 * 5; // 5 min
    private final int refreshTokenExpirationMs = 1000 * 60 * 60 * 24 * 7; // week

    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    @Autowired
    UserRepository userRepository;

    public String generateAccessToken(UserDtoReq user) {
        Map<String, Object> claims = new HashMap<>();
        UserModel userModel = userRepository.findByEmail(user.email());

        claims.put("id", userModel.getId());
        claims.put("subscriber", userModel.getSubscriber());
        claims.put("email", user.email());
        claims.put("userName", user.userName());
        claims.put("role", userModel.getRole());
        claims.put("type", "access");


        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.email())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + accessTokenExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(UserDtoReq user) {
        Map<String, Object> claims = new HashMap<>();
        UserModel userModel = userRepository.findByEmail(user.email());

        claims.put("id", userModel.getId());
        claims.put("type", "refresh");

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.email())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


    public Long getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(key)
                    .parseClaimsJws(token)
                    .getBody();
            return claims.get("id", Long.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid token");
        }
    }

    public String getUserEmail(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(key)
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Invalid token");
        }
    }

    public String getUserName(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(key)
                    .parseClaimsJws(token)
                    .getBody();
            return claims.get("userName", String.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid token");
        }
    }

    public Claims getFullUser(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(key)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new RuntimeException("Invalid token");
        }
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException e) {
            System.out.println("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }


    //get user by role admin

    public String refreshAccessToken(String refreshToken) {
        if (validateJwtToken(refreshToken)) {
            Claims claims = getFullUser(refreshToken);

            if (!"refresh".equals(claims.get("type"))) {
                throw new RuntimeException("Invalid token type");
            }

            UserModel userModel = userRepository.findByEmail(claims.getSubject());

            UserDtoReq userDto = new UserDtoReq(userModel.getId(), userModel.getUserName(), userModel.getEmail(), "*********", userModel.getRole());

            return generateAccessToken(userDto);


        }
        throw new RuntimeException("Невалидный токен");
    }

}
