package org.kaitai.cinemaApp.enums;


import lombok.Data;

public enum UserRolesEnums {
    ADMIN("admin"),
    SENIOR("senior"),
    USER("user");


    private final String role;

    UserRolesEnums(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

}
