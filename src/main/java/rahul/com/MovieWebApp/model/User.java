package rahul.com.MovieWebApp.model;

import com.fasterxml.jackson.annotation.JsonTypeId;
import org.springframework.http.ResponseEntity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Optional;

@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;

    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String verified;
    private String verificationCode;

    @Transient // not in database
    private ArrayList<WatchedList> watchedList = new ArrayList<>();

    @Transient
    private ArrayList<Integer> watchList = new ArrayList<>();

    public User() {}
    public User(String firstName, String lastName, String email, String password, String verified) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.verified = verified;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public ArrayList<WatchedList> getWatchedList() {
        return watchedList;
    }

    public void setWatchedList(ArrayList<WatchedList> watchedList) {
        this.watchedList = watchedList;
    }

    public ArrayList<Integer> getWatchList() {
        return watchList;
    }

    public void setWatchList(ArrayList<Integer> watchList) {
        this.watchList = watchList;
    }

    public String getVerified() {
        return verified;
    }

    public void setVerified(String verified) {
        this.verified = verified;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", verified=" + verified +
                ", watchedList=" + watchedList +
                ", watchList=" + watchList +
                '}';
    }
}
