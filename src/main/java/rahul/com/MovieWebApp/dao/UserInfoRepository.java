package rahul.com.MovieWebApp.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import rahul.com.MovieWebApp.model.UserInfo;

import java.util.ArrayList;
import java.util.Optional;

public interface UserInfoRepository extends JpaRepository<UserInfo, Integer> {
    public Optional<UserInfo> findByUsername(String username);
    public Optional<UserInfo> findByEmail(String email);

    @Query(value = "SELECT username FROM userinfo", nativeQuery = true)
    public ArrayList<String> getAllUsernames();

    @Query(value = "SELECT * FROM userinfo WHERE verification_code = :verification_code", nativeQuery = true)
    public UserInfo findByVerificationCode(@Param("verification_code") String verificationCode);

    /*@Query(value = "select rating from watchedlist where movie_id = :movie_id", nativeQuery = true)
    public ArrayList<Integer> findRatingById(@Param("movie_id") int movie_id);*/

    @Query(value="select * from userinfo where username = :username ", nativeQuery = true)
    public UserInfo findTheUsernamefromUserInfo(@Param("username") String username);
}
