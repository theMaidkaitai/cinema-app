package org.kaitai.cinemaApp.dto.film.req;

import org.kaitai.cinemaApp.enums.GenresEnum;

public record FilmCreateReq(
        String title,
        String description,
        GenresEnum genre
) {
}