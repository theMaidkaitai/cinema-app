package org.kaitai.cinemaApp.repository.subscribe;

import org.kaitai.cinemaApp.models.subscribe.SubscribeModel;
import org.kaitai.cinemaApp.models.user.UserModel;
import org.springframework.data.repository.CrudRepository;

public interface SubscribeRepository extends CrudRepository<SubscribeModel, Long> {

    Boolean existsByUser(UserModel user);
}
