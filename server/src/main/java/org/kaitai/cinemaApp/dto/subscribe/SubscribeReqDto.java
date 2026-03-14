package org.kaitai.cinemaApp.dto.subscribe;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

public record SubscribeReqDto(
        Long userId,

        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        LocalDateTime expiredAt
        ) {
}
