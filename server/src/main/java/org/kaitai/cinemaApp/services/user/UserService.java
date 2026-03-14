package org.kaitai.cinemaApp.services.user;

import org.kaitai.cinemaApp.configs.encoder.PasswordCrypto;
import org.kaitai.cinemaApp.dto.user.req.UserDtoReq;
import org.kaitai.cinemaApp.models.user.UserModel;
import org.kaitai.cinemaApp.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordCrypto passwordCrypto;

    public UserModel createUser(UserDtoReq user) {
        try {
            String encodePassword = passwordCrypto.hashPassword(user.password());
            UserModel userModel = new UserModel(user.userName(), user.email(), encodePassword);
            if (user.password() == null || user.password().isEmpty()) {
                throw new IllegalArgumentException("Пароль не может быть пустым");
            }
            if (user.email() == null || user.email().isEmpty()) {
                throw new IllegalArgumentException("Email не может быть пустым");
            }
            if (user.userName() == null || user.userName().isEmpty()) {
                throw new IllegalArgumentException("Имя пользователя не может быть пустым");
            }
            if (!user.email().contains("@")) {
                throw new IllegalArgumentException("Почта введена некоректно!");
            }
            userRepository.save(userModel);
            return userModel;
        }

        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Ошибка аргумента: " + e.getMessage());
        }
    }

    public void deleteUser(Long userId) {
        try {
            UserModel user = userRepository.findById(userId)
                    .orElseThrow(() -> new Exception("Комната не найдена"));

            userRepository.delete(user);
        }

        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Ошибка аргумента: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


}
