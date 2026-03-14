package org.kaitai.cinemaApp.controllers.user;


import org.kaitai.cinemaApp.configs.encoder.PasswordCrypto;
import org.kaitai.cinemaApp.dto.user.req.UserDtoReq;
import org.kaitai.cinemaApp.dto.user.res.UserDtoRes;
import org.kaitai.cinemaApp.enums.HttpStatusCodeEnums;
import org.kaitai.cinemaApp.exceptions.HttpException;
import org.kaitai.cinemaApp.models.user.UserModel;
import org.kaitai.cinemaApp.services.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordCrypto passwordCrypto;

    @PostMapping("/create")
    public ResponseEntity<UserDtoRes> createUser(@RequestBody UserDtoReq user) throws HttpException {
        try {
           UserModel userModel = userService.createUser(user);
           UserDtoRes res = new UserDtoRes(userModel.getUserName(), userModel.getEmail());
           return new ResponseEntity<>(res, HttpStatus.OK);
        }

        catch (IllegalArgumentException e) {
            throw new HttpException(e.getMessage(), HttpStatusCodeEnums.BAD_REQUEST);
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new HttpException("Внутренняя ошибка сервера: " + e.getMessage(),
                    HttpStatusCodeEnums.INTERNAL_SERVER_ERROR);
        }
    }



}
