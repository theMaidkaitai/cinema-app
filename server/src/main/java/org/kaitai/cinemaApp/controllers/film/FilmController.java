package org.kaitai.cinemaApp.controllers.film;


import org.kaitai.cinemaApp.dto.film.req.FilmDtoReq;
import org.kaitai.cinemaApp.dto.film.res.FilmDtoRes;
import org.kaitai.cinemaApp.dto.user.req.UserIdsDtoReq;
import org.kaitai.cinemaApp.enums.GenresEnum;
import org.kaitai.cinemaApp.enums.HttpStatusCodeEnums;
import org.kaitai.cinemaApp.enums.TypeMovieEnums;
import org.kaitai.cinemaApp.exceptions.HttpException;
import org.kaitai.cinemaApp.models.film.FilmModel;
import org.kaitai.cinemaApp.repository.film.FilmRepository;
import org.kaitai.cinemaApp.services.files.FilesService;
import org.kaitai.cinemaApp.services.film.FilmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/film/api")
public class FilmController {
    @Autowired
    private FilmService filmService;
    @Autowired
    private FilesService filesService;
    @Autowired
    private FilmRepository filmRepository;

    @PostMapping(value = "/stream/add/movie", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?>  addFilm(
            @RequestHeader("Authorization") String authorization,
            @RequestParam(value = "filmFile", required = false) MultipartFile filmFile,
            @RequestParam("coverFile") MultipartFile coverFile,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("genre") GenresEnum genre,
            @RequestParam("type") String typeStr
    ) throws HttpException {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                throw new HttpException("Missing or invalid Authorization header",
                        HttpStatusCodeEnums.UNAUTHORIZED);
            }

            TypeMovieEnums type = TypeMovieEnums.valueOf(typeStr);

            if (type == TypeMovieEnums.RELEASE && (filmFile == null || filmFile.isEmpty())) {
                throw new IllegalArgumentException("Film file is required for RELEASE type");
            }

            FilmDtoReq textData = new FilmDtoReq(title, description, genre, type);
            FilmDtoRes res = filmService.addFilm(textData, filmFile, coverFile);

            return new ResponseEntity<>(res, HttpStatus.OK);
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new HttpException(e.getMessage(), HttpStatusCodeEnums.BAD_REQUEST);
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new HttpException("Внутренняя ошибка сервера: " + e.getMessage(),
                    HttpStatusCodeEnums.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/stream/release/movie/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String>  releaseFilm(
            @RequestHeader("Authorization") String authorization,
            @RequestParam(value = "filmFile") MultipartFile filmFile,
            @PathVariable Long id
    ) throws HttpException {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                throw new HttpException("Missing or invalid Authorization header",
                        HttpStatusCodeEnums.UNAUTHORIZED);
            }

            filmService.releaseFilm(filmFile, id);

            return ResponseEntity.ok().body("Movie released!");
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new HttpException(e.getMessage(), HttpStatusCodeEnums.BAD_REQUEST);
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new HttpException("Внутренняя ошибка сервера: " + e.getMessage(),
                    HttpStatusCodeEnums.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/stream/movie/{filename}")
    public ResponseEntity<Resource> streamVideo(@PathVariable String filename) {
        try {
            Resource resource = filesService.loadFileAsResource(filename);

            String contentType = "video/mp4";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);


        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/stream/cover/{filename}")
    public ResponseEntity<Resource> streamCover(@PathVariable String filename) {
        try {
            Resource resource = filesService.loadFileAsResource(filename);

            String contentType = "image/jpeg";
            if (filename.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                contentType = "image/jpeg";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);


        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stream/get/movies")
    public ResponseEntity<List<FilmModel>> getVideos() {
        try {
            List<FilmModel> films = (List<FilmModel>) filmRepository.findAll();
            if (films.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok().body(films);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stream/get/movie/{id}")
    public ResponseEntity<FilmModel> getVideoById(@PathVariable Long id) {
        try {
            FilmModel film = filmRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Not found by id: " + id));
            return ResponseEntity.ok().body(film);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/other/get/genres")
    public ResponseEntity<List<GenresEnum>> getAllGenres() {
        try {
            List<GenresEnum> genres = Arrays.asList(GenresEnum.values());
            return ResponseEntity.ok().body(genres);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/other/delete/movie/{id}")
    public ResponseEntity<String> deleteMovie(@PathVariable Long id) {
        try {
            FilmModel movie = filmRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Not found by id: " + id)) ;
            filmRepository.delete(movie);
            return ResponseEntity.ok().body("Movie is deleted!");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }




    @PostMapping("/action/like/movie")
    public ResponseEntity<String> likeMovie (
            @RequestHeader("Authorization") String authorization,
            @RequestBody UserIdsDtoReq dto
            ) throws HttpException {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new HttpException("Missing or invalid Authorization header",
                    HttpStatusCodeEnums.UNAUTHORIZED);
        }
        try {
            if (dto.userId() == null || dto.movieId() == null) {
                throw new IllegalArgumentException("Missing or invalid user id or movie id");
            }
            UserIdsDtoReq idsInstanse = new UserIdsDtoReq(dto.movieId() , dto.userId());
            filmService.likeFilm(idsInstanse);

            return ResponseEntity.ok().body("Movie is liked!");
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new HttpException(e.getMessage(), HttpStatusCodeEnums.BAD_REQUEST);
        }
    }

    @GetMapping ("/action/check/like/movie")
    public ResponseEntity<Boolean> checkLiked (
            @RequestHeader("Authorization") String authorization,
            @RequestParam("movieId") Long movieId,
            @RequestParam("userId") Long userId
    ) throws HttpException {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new HttpException("Missing or invalid Authorization header",
                    HttpStatusCodeEnums.UNAUTHORIZED);
        }
        try {
            if (userId == null || movieId == null) {
                throw new IllegalArgumentException("Missing or invalid user id or movie id");
            }

            UserIdsDtoReq idsInstanse = new UserIdsDtoReq(movieId , userId);

            if (filmService.checkLiked(idsInstanse)) {
                return ResponseEntity.ok().body(true);
            }
            else {
                return ResponseEntity.ok().body(false);
            }
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new HttpException(e.getMessage(), HttpStatusCodeEnums.BAD_REQUEST);
        }
    }


    @GetMapping ("/other/get/likes/movie/{id}")
    public ResponseEntity<List<FilmModel>> getLikesByUser (
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long id
    ) throws HttpException {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new HttpException("Missing or invalid Authorization header",
                    HttpStatusCodeEnums.UNAUTHORIZED);
        }
        try {
            if (id == null) {
                throw new IllegalArgumentException("Missing or invalid user id");
            }

            List<FilmModel> likedFilms = filmService.getLikesByUser(id);
            return ResponseEntity.ok(likedFilms);
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new HttpException(e.getMessage(), HttpStatusCodeEnums.BAD_REQUEST);
        }
    }


    @GetMapping ("/other/get/highest/likes/movie")
    public ResponseEntity<FilmModel> getHighestLikesFilm (
    ) throws HttpException {
        try {
            FilmModel film =  filmService.getHighestLikesFilm();
            if (film == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(film);
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new HttpException(e.getMessage(), HttpStatusCodeEnums.BAD_REQUEST);
        }
    }


    @GetMapping ("/other/get/recs/movie/{id}")
    public ResponseEntity<List<FilmModel>> getRecommendations (
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long id
    ) throws HttpException {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                throw new HttpException("Missing or invalid Authorization header",
                        HttpStatusCodeEnums.UNAUTHORIZED);
            }
            if (id == null) {
                return ResponseEntity.notFound().build();
            }

            List<FilmModel> recommendations = filmService.getRecommendations(id);
            return ResponseEntity.ok(recommendations);
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new HttpException(e.getMessage(), HttpStatusCodeEnums.BAD_REQUEST);
        }
    }

    @PostMapping("/action/add/favorite/movie")
    public ResponseEntity<String> addInFavorite (
            @RequestHeader("Authorization") String authorization,
            @RequestBody UserIdsDtoReq dto
    ) throws HttpException {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new HttpException("Missing or invalid Authorization header",
                    HttpStatusCodeEnums.UNAUTHORIZED);
        }
        try {
            if (dto.userId() == null || dto.movieId() == null) {
                throw new IllegalArgumentException("Missing or invalid user id or movie id");
            }
            UserIdsDtoReq idsInstance = new UserIdsDtoReq(dto.movieId() , dto.userId());
            filmService.addInFavorite(idsInstance);
            return ResponseEntity.ok().body("Added to favorites!");
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new HttpException(e.getMessage(), HttpStatusCodeEnums.BAD_REQUEST);
        }
    }

    @GetMapping ("/other/get/favorites/movie/{id}")
    public ResponseEntity<List<FilmModel>> getFavoritesByUser (
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long id
    ) throws HttpException {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new HttpException("Missing or invalid Authorization header",
                    HttpStatusCodeEnums.UNAUTHORIZED);
        }
        try {
            if (id == null) {
                throw new IllegalArgumentException("Missing or invalid user id");
            }

            List<FilmModel> likedFilms = filmService.getFavoritesByUser(id);
            return ResponseEntity.ok(likedFilms);
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new HttpException(e.getMessage(), HttpStatusCodeEnums.BAD_REQUEST);
        }
    }

    @GetMapping ("/action/check/favorite/movie")
    public ResponseEntity<Boolean> checkFavorite (
            @RequestHeader("Authorization") String authorization,
            @RequestParam("movieId") Long movieId,
            @RequestParam("userId") Long userId
    ) throws HttpException {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new HttpException("Missing or invalid Authorization header",
                    HttpStatusCodeEnums.UNAUTHORIZED);
        }
        try {
            if (userId == null || movieId == null) {
                throw new IllegalArgumentException("Missing or invalid user id or movie id");
            }

            UserIdsDtoReq idsInstanse = new UserIdsDtoReq(movieId, userId);

            if (filmService.checkFavorite(idsInstanse)) {
                return ResponseEntity.ok().body(true);
            }
            else {
                return ResponseEntity.ok().body(false);
            }
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new HttpException(e.getMessage(), HttpStatusCodeEnums.BAD_REQUEST);
        }
    }

}
