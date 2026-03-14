package org.kaitai.cinemaApp.dto.film.res;

import org.kaitai.cinemaApp.enums.GenresEnum;
import org.kaitai.cinemaApp.enums.TypeMovieEnums;

public record FilmDtoRes(String title, String description, String path_film, String path_cover, GenresEnum genre, TypeMovieEnums type) {
}
