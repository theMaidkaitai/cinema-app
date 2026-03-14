package org.kaitai.cinemaApp.repository.user;

import org.kaitai.cinemaApp.models.film.FilmModel;
import org.kaitai.cinemaApp.models.user.UserLikesModel;
import org.kaitai.cinemaApp.models.user.UserModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserLikesRepository extends CrudRepository<UserLikesModel, Long> {
    //boolean findByUserAndFilm(UserModel user, FilmModel film);
    boolean existsByUserAndFilm(UserModel user, FilmModel film);

    List<UserLikesModel> findByUser(UserModel user);

    List<UserLikesModel> findByUserId(Long userId);
}
