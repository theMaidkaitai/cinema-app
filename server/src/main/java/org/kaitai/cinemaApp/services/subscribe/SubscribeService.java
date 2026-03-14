package org.kaitai.cinemaApp.services.subscribe;

import org.kaitai.cinemaApp.dto.subscribe.SubscribeReqDto;
import org.kaitai.cinemaApp.models.subscribe.SubscribeModel;
import org.kaitai.cinemaApp.models.user.UserModel;
import org.kaitai.cinemaApp.repository.subscribe.SubscribeRepository;
import org.kaitai.cinemaApp.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SubscribeService {

    @Autowired
    private SubscribeRepository subscribeRepository;
    @Autowired
    private UserRepository userRepository;


    public LocalDateTime subscribe(SubscribeReqDto dto) {
        try {

            UserModel user = userRepository.findById(dto.userId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            user.setSubscriber(true);
            SubscribeModel subscribeModel = new SubscribeModel(user, dto.expiredAt());
            userRepository.save(user);
            subscribeRepository.save(subscribeModel);
            return subscribeModel.getExpiresAt();
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage());
        }
    }

}
