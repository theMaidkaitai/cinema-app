package org.kaitai.cinemaApp.exceptions;


import org.kaitai.cinemaApp.enums.HttpStatusCodeEnums;

public class HttpException extends Exception  {
    private final HttpStatusCodeEnums statusCode;

    public HttpException(String message, HttpStatusCodeEnums statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getCode() {
        return statusCode.getCode();
    }

    public String getMessage() {
        return statusCode.getMessage();
    }
}
