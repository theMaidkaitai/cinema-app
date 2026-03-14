package org.kaitai.cinemaApp.models.film;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.kaitai.cinemaApp.enums.GenresEnum;
import org.kaitai.cinemaApp.enums.TypeMovieEnums;
import org.kaitai.cinemaApp.models.user.UserFavoritesModel;
import org.kaitai.cinemaApp.models.user.UserLikesModel;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class FilmModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 30, nullable = false, unique = true)
    private String title;
    @Column(length = 3300, nullable = false)
    private String description;
    private String path_film;
    private String path_film_fileName;
    private String path_cover;
    private String path_cover_fileName;
    private Integer rating;

    @Enumerated(EnumType.STRING)
    private GenresEnum genre;
    @Enumerated(EnumType.STRING)
    private TypeMovieEnums type;

    @JsonIgnore
    @OneToMany(mappedBy = "film", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserLikesModel> likes = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "film", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserFavoritesModel> favorites = new ArrayList<>();

    public FilmModel(String title, String description, GenresEnum genre, TypeMovieEnums type) {
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.type = type;
        this.rating = 0;
    }
}
