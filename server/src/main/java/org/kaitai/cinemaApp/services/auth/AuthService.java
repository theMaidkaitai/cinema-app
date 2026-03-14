package org.kaitai.cinemaApp.services.auth;


import org.kaitai.cinemaApp.configs.encoder.PasswordCrypto;
import org.kaitai.cinemaApp.configs.jwt.JwtUtil;
import org.kaitai.cinemaApp.dto.auth.req.AuthUserDtoReq;
import org.kaitai.cinemaApp.dto.auth.res.AuthRes;
import org.kaitai.cinemaApp.dto.user.req.UserDtoReq;
import org.kaitai.cinemaApp.enums.HttpStatusCodeEnums;
import org.kaitai.cinemaApp.exceptions.HttpException;
import org.kaitai.cinemaApp.models.user.UserModel;
import org.kaitai.cinemaApp.repository.user.UserRepository;
import org.kaitai.cinemaApp.services.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordCrypto crypto;


    public AuthRes login(AuthUserDtoReq dto) throws HttpException { // Меняем на HttpException
        try {
            UserModel user = userRepository.findByEmail(dto.email());
            if (user == null) {
                throw new HttpException("Пользователь не найден", HttpStatusCodeEnums.NOT_FOUND);
            }

            if (!crypto.verifyPassword(dto.password(), user.getPassword())) {
                throw new HttpException("Неверный пароль", HttpStatusCodeEnums.UNAUTHORIZED);
            }

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            dto.email(),
                            dto.password()
                    )
            );

            UserDtoReq res = new UserDtoReq(user.getId(), user.getUserName(), user.getEmail(), "**********", user.getRole());
            SecurityContextHolder.getContext().setAuthentication(auth);
            String accessToken = jwtUtil.generateAccessToken(res);
            String refreshToken = jwtUtil.generateRefreshToken(res);

            return new AuthRes(refreshToken, accessToken, res.email(), res.userName());

        } catch (BadCredentialsException e) {
            System.out.println(e);
            System.err.println("Bad credentials for email: " + dto.email());
            throw new HttpException("Wrong email or password", HttpStatusCodeEnums.UNAUTHORIZED);
        } catch (HttpException e) {
            throw new HttpException("Unexpected error from AuthService", HttpStatusCodeEnums.UNEXPECTED);

        } catch (Exception e) {
            e.printStackTrace();
            throw new HttpException("Внутренняя ошибка сервера при входе", HttpStatusCodeEnums.INTERNAL_SERVER_ERROR);
        }
    }

    public AuthRes register(UserDtoReq userDtoReq) throws HttpException {
        if (userRepository.existsByEmail(userDtoReq.email())) {
            throw new HttpException("Пользователь уже зарегестрирован", HttpStatusCodeEnums.BAD_REQUEST);
        }
        if (userRepository.existsByUserName(userDtoReq.userName())) {
            throw new HttpException("Имя пользователя уже занято", HttpStatusCodeEnums.BAD_REQUEST);
        }
        UserModel userModel = userService.createUser(userDtoReq);
        String tokenRefresh = jwtUtil.generateRefreshToken(userDtoReq);
        String tokenAccess = jwtUtil.generateAccessToken(userDtoReq);
        return new AuthRes(
                tokenRefresh,
                tokenAccess,
                userModel.getUserName(),
                userModel.getEmail()
        );
    }




    // TODO: buy subscribe func

}
