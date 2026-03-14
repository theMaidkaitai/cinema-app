package org.kaitai.cinemaApp.repository.user;


import org.kaitai.cinemaApp.models.film.FilmModel;
import org.kaitai.cinemaApp.models.user.UserFavoritesModel;
import org.kaitai.cinemaApp.models.user.UserLikesModel;
import org.kaitai.cinemaApp.models.user.UserModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFavoritesRepository extends CrudRepository<UserFavoritesModel, Long> {
    boolean existsByUserAndFilm(UserModel user, FilmModel movie);

    List<UserFavoritesModel> findByUser(UserModel user);
}
