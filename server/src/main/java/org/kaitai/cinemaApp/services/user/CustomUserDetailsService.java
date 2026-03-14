package org.kaitai.cinemaApp.services.user;


import org.kaitai.cinemaApp.models.user.UserModel;
import org.kaitai.cinemaApp.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService  {

    @Autowired
    private UserRepository userRepository;


//    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
//        UserModel user = userRepository.findByEmail(email);
//        if (user == null) {
//            throw new UsernameNotFoundException("User Not Found with email: " + email);
//        }
//
//
//        return org.springframework.security.core.userdetails.User.builder()
//                .username(user.getEmail())
//                .password(user.getPassword())
//                .authorities(new ArrayList<>())
//                .build();
//    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Ищем по email, так как в системе идентификатор - email
        UserModel user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Пользователь с email " + email + " не найден");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())  // Используем email как username
                .password(user.getPassword())
                .authorities(new ArrayList<>())
                .build();
    }
}


