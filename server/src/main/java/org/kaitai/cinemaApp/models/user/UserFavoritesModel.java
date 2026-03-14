package org.kaitai.cinemaApp.models.user;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.kaitai.cinemaApp.models.film.FilmModel;

@Entity
@NoArgsConstructor
@Data
@Table(
        name = "user_favorites",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "film_id"})}
)
public class UserFavoritesModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "film_id")
    private FilmModel film;

    public UserFavoritesModel(UserModel user, FilmModel film) {
        this.user = user;
        this.film = film;
    }

}
