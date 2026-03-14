package org.kaitai.cinemaApp.services.film;


import lombok.extern.slf4j.Slf4j;
import org.kaitai.cinemaApp.dto.film.req.FilmDtoReq;
import org.kaitai.cinemaApp.dto.film.res.FilmDtoRes;
import org.kaitai.cinemaApp.dto.user.req.UserIdsDtoReq;
import org.kaitai.cinemaApp.enums.GenresEnum;
import org.kaitai.cinemaApp.enums.TypeMovieEnums;
import org.kaitai.cinemaApp.models.film.FilmModel;
import org.kaitai.cinemaApp.models.user.UserFavoritesModel;
import org.kaitai.cinemaApp.models.user.UserLikesModel;
import org.kaitai.cinemaApp.models.user.UserModel;
import org.kaitai.cinemaApp.repository.film.FilmRepository;
import org.kaitai.cinemaApp.repository.user.UserFavoritesRepository;
import org.kaitai.cinemaApp.repository.user.UserLikesRepository;
import org.kaitai.cinemaApp.repository.user.UserRepository;
import org.kaitai.cinemaApp.services.files.FilesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FilmService {
    @Autowired
    private UserFavoritesRepository userFavoritesRepository;
    @Autowired
    private FilmRepository filmRepository;
    @Autowired
    private UserLikesRepository  userLikesRepository;
    @Autowired
    private FilesService filesService;
    @Autowired
    private UserRepository userRepository;

    public FilmDtoRes addFilm (FilmDtoReq dto, MultipartFile filmFile, MultipartFile coverFile) {
        if (dto.type() == TypeMovieEnums.RELEASE) {
            String filmPathName = filesService.storeFile(filmFile);
            String coverPathName = filesService.storeFile(coverFile);

            if (filmFile == null || filmFile.isEmpty()) {
                throw new IllegalArgumentException("Film file is required for RELEASE type");
            }

            FilmModel filmModel = new FilmModel(
                    dto.title(),
                    dto.description(),
                    dto.genre(),
                    dto.type()
            );

            filmModel.setPath_film_fileName(filmPathName);
            filmModel.setPath_film("/api/videos/stream/" + filmPathName);

            filmModel.setPath_cover_fileName(coverPathName);
            filmModel.setPath_cover("/api/videos/stream/" + coverPathName);

            filmRepository.save(filmModel);
            FilmDtoRes res = new FilmDtoRes(filmModel.getTitle(), filmModel.getDescription(), filmModel.getPath_film(), filmModel.getPath_cover(), filmModel.getGenre(), filmModel.getType());
            return res;
        }

        else if (dto.type() == TypeMovieEnums.SOON) {
            String coverPathName = filesService.storeFile(coverFile);


            FilmModel filmModel = new FilmModel(
                    dto.title(),
                    dto.description(),
                    dto.genre(),
                    dto.type()
            );

            filmModel.setPath_cover_fileName(coverPathName);
            filmModel.setPath_cover("/api/videos/stream/" + coverPathName); // path in application properties

            filmRepository.save(filmModel);
            FilmDtoRes res = new FilmDtoRes(filmModel.getTitle(), filmModel.getDescription(), filmModel.getPath_film(), filmModel.getPath_cover(), filmModel.getGenre(), filmModel.getType());
            return res;
        }
        throw new IllegalArgumentException("Unknown film type argument?");
    }


    public void releaseFilm (MultipartFile filmFile, Long id) {
        try {
            FilmModel movie = filmRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Illegal Film ID: " + id));
            String filmPathName = filesService.storeFile(filmFile);
            movie.setPath_film_fileName(filmPathName);
            movie.setPath_film("/api/videos/stream/" + filmPathName);
            filmRepository.save(movie);

        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    // TODO: Find by highest rating
    // TODO: find for user by likes

    public void likeFilm (UserIdsDtoReq dto) {
        try {
            FilmModel movie = filmRepository.findById(dto.movieId())
                    .orElseThrow(() -> new IllegalArgumentException("Illegal Film ID: " + dto.movieId()));
            UserModel user = userRepository.findById(dto.userId())
                    .orElseThrow(() -> new IllegalArgumentException("Illegal user ID: " + dto.userId()));

            UserLikesModel like = new UserLikesModel(user, movie);
            userLikesRepository.save(like);
            movie.setRating(movie.getRating() + 1);
            filmRepository.save(movie);
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    public boolean checkLiked (UserIdsDtoReq dto) {
        try {
            FilmModel movie = filmRepository.findById(dto.movieId())
                    .orElseThrow(() -> new IllegalArgumentException("Illegal Film ID: " + dto.movieId()));
            UserModel user = userRepository.findById(dto.userId())
                    .orElseThrow(() -> new IllegalArgumentException("Illegal user ID: " + dto.userId()));

            if (userLikesRepository.existsByUserAndFilm(user, movie)) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    public List<FilmModel> getLikesByUser (Long userId) {
        try {
            UserModel user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("Illegal user ID: " + userId));
            List<UserLikesModel> likesByUser = userLikesRepository.findByUser(user);
            List<FilmModel> films = new ArrayList<>();
            for (int i = 0; i < likesByUser.size(); i++) {
                films.add(likesByUser.get(i).getFilm());
            }

            return films;
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    public FilmModel getHighestLikesFilm () {
        try {
            FilmModel film = filmRepository.findFirstByOrderByRatingDesc();
            if (film == null) {
                throw new ChangeSetPersister.NotFoundException();
            }
            return film;
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage());
        } catch (ChangeSetPersister.NotFoundException e) {
            throw new RuntimeException(e);
        }
    }


    public List<FilmModel> getRecommendations (Long userId) {
        try {
            List<UserLikesModel> userLikes = userLikesRepository.findByUserId(userId);
            List<FilmModel> result = new ArrayList<>();


            if (userLikes.isEmpty()) {
                return filmRepository.findTopRated(PageRequest.of(0, 12))
                        .stream()
                        .filter(film -> film.getType() != TypeMovieEnums.SOON)
                        .toList();
            }

            Map<String, Integer> userGenres = new HashMap<>();

            for (UserLikesModel like : userLikes) {
                String genre = like.getFilm().getGenre().toString();
                userGenres.put(genre, userGenres.getOrDefault(genre, 0) + 1);
            }

            List<String> topGenres = userGenres.entrySet()
                    .stream()
                    .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                    .limit(3) // limit genres
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());

            Set<Long> filter= userLikes.stream()
                    .map(like -> like.getFilm().getId())
                    .collect(Collectors.toSet());



            for (String genre : topGenres) {
                List<FilmModel> genreFilms = filmRepository.findTopByGenreOrderByRatingDesc(
                        GenresEnum.valueOf(genre),
                        TypeMovieEnums.RELEASE,
                        PageRequest.of(0, 6)
                );
                List<FilmModel> filteredFilms = genreFilms.stream()
                                .filter(film -> !filter.contains(film.getId()))
                                        .toList();
                result.addAll(filteredFilms);
            }

            System.out.println(result);
            return result;
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    public void addInFavorite (UserIdsDtoReq dto) {
        try {
            FilmModel movie = filmRepository.findById(dto.movieId())
                    .orElseThrow(() -> new IllegalArgumentException("Illegal Film ID: " + dto.movieId()));
            UserModel user = userRepository.findById(dto.userId())
                    .orElseThrow(() -> new IllegalArgumentException("Illegal user ID: " + dto.userId()));

            UserFavoritesModel fav = new UserFavoritesModel(user, movie);
            userFavoritesRepository.save(fav);

        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    public boolean checkFavorite (UserIdsDtoReq dto) {
        try {
            FilmModel movie = filmRepository.findById(dto.movieId())
                    .orElseThrow(() -> new IllegalArgumentException("Illegal Film ID: " + dto.movieId()));
            UserModel user = userRepository.findById(dto.userId())
                    .orElseThrow(() -> new IllegalArgumentException("Illegal user ID: " + dto.userId()));

            if (userFavoritesRepository.existsByUserAndFilm(user, movie)) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    public List<FilmModel> getFavoritesByUser (Long userId) {
        try {
            UserModel user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("Illegal user ID: " + userId));
            List<UserFavoritesModel> favsByUser = userFavoritesRepository.findByUser(user);
            List<FilmModel> films = new ArrayList<>();
            for (int i = 0; i < favsByUser.size(); i++) {
                films.add(favsByUser.get(i).getFilm());
            }

            return films;
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage());
        }
    }
}
