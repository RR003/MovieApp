package rahul.com.MovieWebApp.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import rahul.com.MovieWebApp.model.Friend;

import java.util.ArrayList;

public interface FriendRepository extends JpaRepository<Friend, Integer> {
    @Query(value = "SELECT * FROM friend where sender_id = :sender_id and receiver_id = :receiver_id", nativeQuery = true)
    public Friend getFriendFromParams(@Param("sender_id") String senderId, @Param("receiver_id") String receiverId);

    @Transactional
    @Modifying
    @Query(value = "delete from friend where (receiver_id = :receiver_id and sender_id = :sender_id) " +
            "or (receiver_id = :sender_id and sender_id = :receiver_id)", nativeQuery = true)
    public void deleteFriendFromParams(@Param("sender_id") String senderId, @Param("receiver_id") String receiverId);

    @Query(value= " select receiver_id from friend where sender_id = :sender_id and is_verified = :is_verified ", nativeQuery = true)
    public ArrayList<String> getFriendsFromUser(@Param("sender_id") String senderId, @Param("is_verified") String isVerified);

    @Query(value= " select sender_id from friend where receiver_id = :receiver_id and is_verified = :is_verified ", nativeQuery = true)
    public ArrayList<String> getFriendRequestsFromUser(@Param("receiver_id") String receiverId, @Param("is_verified") String isVerified);
}
