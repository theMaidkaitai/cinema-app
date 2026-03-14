package org.kaitai.cinemaApp.dto.user.req;

import org.kaitai.cinemaApp.enums.UserRolesEnums;

public record UserDtoReq(Long id, String userName, String email, String password, UserRolesEnums role) {

}
