package rahul.com.MovieWebApp.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import rahul.com.MovieWebApp.model.WatchedList;

import java.util.ArrayList;
import java.util.List;

public interface WatchedListRepository extends JpaRepository<WatchedList, String> {
    @Query(value = "SELECT * FROM watchedlist WHERE username = :username order by date_created DESC", nativeQuery = true)
    public List<WatchedList> findByUsername(@Param("username") String username);

    @Query(value = "select rating from watchedlist where movie_id = :movie_id and is_movie = :is_movie", nativeQuery = true)
    public ArrayList<Integer> findRatingById(@Param("movie_id") int movie_id, @Param("is_movie") String isMovie);

    @Query(value = "select * from watchedlist where username = :username and movie_id = :movie_id", nativeQuery = true)
    public WatchedList findWatchlistByUsernameAndRating(@Param("username") String username,
                                                               @Param("movie_id") int movie_id);

    @Query(value="select comment, rating from watchedlist where movie_id = :movie_id and comment != '' and is_movie = :is_movie", nativeQuery = true)
    public ArrayList<ArrayList<Object>> findCommentsAndRatingById(@Param("movie_id") int movie_id, @Param("is_movie") String isMovie);

    @Query(value = "select movie_id from watchedlist where username = :username and is_movie = :is_movie", nativeQuery = true)
    public ArrayList<Integer> findWatchlistByUsername(@Param("username") String username, @Param("is_movie") String isMovie);

}
