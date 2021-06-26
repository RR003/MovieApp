package rahul.com.MovieWebApp.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import rahul.com.MovieWebApp.model.WatchList;
import rahul.com.MovieWebApp.model.WatchedList;

import java.util.ArrayList;
import java.util.List;

public interface WatchListRepository extends JpaRepository<WatchList, Integer> {


    @Query(value = "SELECT movie_id FROM watchlist WHERE username = :username and is_movie = :is_movie", nativeQuery = true)
    public List<Integer> findByUsername(@Param("username") String username, @Param("is_movie") String is_movie);

    @Query(value = "SELECT movie_id, is_movie FROM watchlist WHERE username = :username", nativeQuery = true)
    public List<List<Object>> findAllByUsername(@Param("username") String username);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM WATCHLIST WHERE username = :username and movie_id = :movie_id and is_movie = :is_movie", nativeQuery = true)
    public void deleteByUsernameAndMovieId(@Param("username") String username, @Param("movie_id") int movie_id, @Param("is_movie") String isMovie);
}


