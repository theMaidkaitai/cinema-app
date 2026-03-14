package org.kaitai.cinemaApp.repository.user;

import org.kaitai.cinemaApp.models.film.FilmModel;
import org.kaitai.cinemaApp.models.user.UserModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends CrudRepository<UserModel, Long> {
    UserModel findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUserName(String userName);

}
