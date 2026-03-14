package org.kaitai.cinemaApp.models.user;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.kaitai.cinemaApp.enums.UserRolesEnums;
import org.kaitai.cinemaApp.models.subscribe.SubscribeModel;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20, unique = true)
    private String userName;
    @Column(length = 25, unique = true)
    private String email;
    @Column(length = 255)
    private String password;
    @Enumerated(EnumType.STRING)
    private UserRolesEnums role;
    private Boolean subscriber;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private SubscribeModel subscribe;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<UserLikesModel> likes = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserFavoritesModel> favorites = new ArrayList<>();


    public UserModel(String userName, String email, String password) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        role = UserRolesEnums.USER;
        subscriber = false;
    }

}
