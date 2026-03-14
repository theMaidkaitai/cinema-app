package org.kaitai.cinemaApp.repository.film;

import org.kaitai.cinemaApp.enums.GenresEnum;
import org.kaitai.cinemaApp.enums.TypeMovieEnums;
import org.kaitai.cinemaApp.models.film.FilmModel;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilmRepository extends CrudRepository<FilmModel, Long> {
    FilmModel findByTitle(String title);


    FilmModel findFirstByOrderByRatingDesc();

    @Query("SELECT f FROM FilmModel f ORDER BY f.rating DESC")
    List<FilmModel> findTopRated(Pageable pageable);

    @Query("SELECT f FROM FilmModel f WHERE f.genre = :genre AND f.type = 'RELEASE' ORDER BY f.rating DESC")
    List<FilmModel> findTopByGenreOrderByRatingDesc(
            @Param("genre") GenresEnum genre,
            @Param("type") TypeMovieEnums type,
            Pageable pageable
    );
}
