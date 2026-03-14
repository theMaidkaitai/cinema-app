package org.kaitai.cinemaApp.models.subscribe;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.TimeZoneStorage;
import org.hibernate.annotations.TimeZoneStorageType;
import org.hibernate.annotations.UpdateTimestamp;
import org.kaitai.cinemaApp.models.user.UserModel;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Data
public class SubscribeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @JoinColumn(name = "user_id")
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private UserModel user;

    @CreationTimestamp
    @TimeZoneStorage(TimeZoneStorageType.NATIVE)
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    @TimeZoneStorage(TimeZoneStorageType.NATIVE)
    private LocalDateTime expiresAt;


    @UpdateTimestamp
    @TimeZoneStorage(TimeZoneStorageType.NATIVE)
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;



    public SubscribeModel(UserModel user, LocalDateTime expiresAt) {
        this.user = user;
        this.expiresAt = expiresAt;
    }

}
