package rahul.com.MovieWebApp.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "watchedlist")
public class WatchedList {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;

    private String username;
    private int movieId;
    private Date dateCreated;
    private int rating;
    private String comment;
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

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getIsMovie() {
        return isMovie;
    }

    public void setIsMovie(String isMovie) {
        this.isMovie = isMovie;
    }

    @Override
    public String toString() {
        return "WatchedList{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", movieId=" + movieId +
                ", dateCreated=" + dateCreated +
                ", rating=" + rating +
                ", comment='" + comment + '\'' +
                ", isMovie='" + isMovie + '\'' +
                '}';
    }
}
