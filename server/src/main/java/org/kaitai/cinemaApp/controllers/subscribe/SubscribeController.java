package org.kaitai.cinemaApp.controllers.subscribe;


import org.antlr.v4.runtime.misc.NotNull;
import org.kaitai.cinemaApp.dto.subscribe.SubscribeReqDto;
import org.kaitai.cinemaApp.repository.subscribe.SubscribeRepository;
import org.kaitai.cinemaApp.services.subscribe.SubscribeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/subscribe")
public class SubscribeController {

    @Autowired
    private SubscribeRepository subscribeRepository;
    @Autowired
    private SubscribeService subscribeService;

    @PostMapping("/create")
    public ResponseEntity<LocalDateTime> subscribe(@RequestBody  SubscribeReqDto dto) {
        try {
            if (dto.userId() == null || dto.expiredAt() == null) {
                return ResponseEntity.badRequest().build();
            }
            subscribeService.subscribe(dto);
            return ResponseEntity.ok().body(LocalDateTime.now());
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("Error subscribe" + e.getMessage());
        }
    }

}
