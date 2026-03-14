package org.kaitai.cinemaApp.dto.film.req;

import org.kaitai.cinemaApp.enums.GenresEnum;
import org.kaitai.cinemaApp.enums.TypeMovieEnums;

public record FilmDtoReq(String title, String description, GenresEnum genre, TypeMovieEnums type) {
}
