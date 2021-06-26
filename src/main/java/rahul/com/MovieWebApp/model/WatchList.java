package rahul.com.MovieWebApp.model;

import javax.persistence.*;
import java.util.ArrayList;

@Entity
@Table(name = "watchlist")
public class WatchList {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;

    private String username;
    private int movieId;
    private String isMovie;

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

    public int getMovieId() {
        return movieId;
    }

    public void setMovieId(int movieId) {
        this.movieId = movieId;
    }

    public String getIsMovie() {
        return isMovie;
    }

    public void setIsMovie(String isMovie) {
        this.isMovie = isMovie;
    }

    @Override
    public String toString() {
        return "WatchList{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", movieId=" + movieId +
                ", isMovie='" + isMovie + '\'' +
                '}';
    }
}
