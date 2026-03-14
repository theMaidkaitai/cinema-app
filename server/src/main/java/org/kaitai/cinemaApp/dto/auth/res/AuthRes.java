package org.kaitai.cinemaApp.dto.auth.res;

public record AuthRes(String tokenRefresh ,String tokenAccess, String email, String userName) {
}
