package org.kaitai.cinemaApp.enums;

public enum GenresEnum {
    Comedy("Комедия"),
    Drama("Драма"),
    Fantasy("Фэнтези"),
    Horror("Хоррор"),
    Sci_fi("Научная фантастика"),
    Action("Экшн"),
    Thriller("Триллер"),
    Adventure("Приключения"),
    Western("Вестерн"),
    Documentary("Документальный"),
    Family("Семейный"),
    Romance("Мелодрама");




    private String genre;

    GenresEnum(String genre) {
        this.genre = genre;
    }

    public String getGenre() {
        return genre;
    }
}
