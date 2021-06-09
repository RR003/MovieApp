package rahul.com.MovieWebApp.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import rahul.com.MovieWebApp.model.User;
import rahul.com.MovieWebApp.model.WatchedList;

import java.util.ArrayList;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    public Optional<User> findByUsername(String username);
    public Optional<User> findByEmail(String email);

    @Query(value = "SELECT username FROM user", nativeQuery = true)
    public ArrayList<String> getAllUsernames();

    @Query(value = "SELECT * FROM user WHERE verification_code = :verification_code", nativeQuery = true)
    public User findByVerificationCode(@Param("verification_code") String verificationCode);

    /*@Query(value = "select rating from watchedlist where movie_id = :movie_id", nativeQuery = true)
    public ArrayList<Integer> findRatingById(@Param("movie_id") int movie_id);*/
}
