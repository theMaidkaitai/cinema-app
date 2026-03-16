package org.kaitai.cinemaApp.controllers.auth;


import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.kaitai.cinemaApp.configs.jwt.JwtUtil;
import org.kaitai.cinemaApp.dto.auth.req.AuthUserDtoReq;
import org.kaitai.cinemaApp.dto.auth.res.AuthRes;
import org.kaitai.cinemaApp.dto.user.req.UserDtoReq;
import org.kaitai.cinemaApp.enums.HttpStatusCodeEnums;
import org.kaitai.cinemaApp.exceptions.HttpException;
import org.kaitai.cinemaApp.models.user.UserModel;
import org.kaitai.cinemaApp.services.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthControllers {

    @Autowired
    private AuthService authService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthRes> login(@RequestBody AuthUserDtoReq loginRequest, HttpServletResponse response) throws HttpException {
        try {
            AuthRes authRes = authService.login(loginRequest);



            Cookie refreshCookie = new Cookie("refreshToken", authRes.tokenRefresh());
            refreshCookie.setHttpOnly(true);
            refreshCookie.setSecure(false); // http
            refreshCookie.setPath("/");
            refreshCookie.setMaxAge(7 * 24 * 60 * 60);

            response.addCookie(refreshCookie);

            AuthRes responseBody = new AuthRes(
                    "********",
                    authRes.tokenAccess(),
                    authRes.userName(),
                    authRes.email()
            );


            return ResponseEntity.ok(responseBody);
        } catch (HttpClientErrorException.NotFound e) {
            return (ResponseEntity<AuthRes>) ResponseEntity.status(404);
        } catch (Exception e) {
            System.out.println(e);
            return (ResponseEntity<AuthRes>) ResponseEntity.status(500);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthRes> register(@RequestBody UserDtoReq registerRequest,
                                            HttpServletResponse response) throws HttpException {
        try {
            AuthRes authRes = authService.register(registerRequest);

            Cookie refreshCookie = new Cookie("refreshToken", authRes.tokenRefresh());
            refreshCookie.setHttpOnly(true);
            refreshCookie.setSecure(true);
            refreshCookie.setPath("/");
            refreshCookie.setMaxAge(7 * 24 * 60 * 60);

            response.addCookie(refreshCookie);


            AuthRes responseBody = new AuthRes(
                    "********",
                    authRes.tokenAccess(),
                    authRes.userName(),
                    authRes.email()
            );

            return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
        }
        catch (Exception e) {
            System.err.println(e);
            throw new HttpException("Ошибка сервера", HttpStatusCodeEnums.UNEXPECTED);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshAccessToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken) throws HttpException {
        try {
            if (refreshToken == null) {
                throw new HttpException("Refresh token not found", HttpStatusCodeEnums.UNAUTHORIZED);
            }

            String newAccessToken = jwtUtil.refreshAccessToken(refreshToken);
            Map<String, String> response = new HashMap<>();
            response.put("tokenAccess", newAccessToken);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println(e);
            throw new HttpException("Ошибка сервера", HttpStatusCodeEnums.UNEXPECTED);
        }
    }
}
