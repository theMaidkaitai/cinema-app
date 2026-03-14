package org.kaitai.cinemaApp.models.user;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.kaitai.cinemaApp.models.film.FilmModel;

@Entity
@Data
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "film_id"})
})
@NoArgsConstructor
public class UserLikesModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "film_id")
    @ToString.Exclude

    private FilmModel film;

    public UserLikesModel(UserModel user, FilmModel film) {
        this.user = user;
        this.film = film;
    }

}
