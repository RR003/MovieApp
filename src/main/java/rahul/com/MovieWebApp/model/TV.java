package rahul.com.MovieWebApp.model;

import java.io.Serializable;

public class TV implements Serializable {
    public int id;
    private String title;
    private String overview;
    private String startingDate;
    private String endDate;
    private double rating;
    private int seasons;

    public TV(int id, String title, String overview, String startingDate, String endDate, double rating, int seasons) {
        this.id = id;
        this.title = title;
        this.overview = overview;
        this.startingDate = startingDate;
        this.endDate = endDate;
        this.rating = rating;
        this.seasons = seasons;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(String startingDate) {
        this.startingDate = startingDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getSeasons() {
        return seasons;
    }

    public void setSeasons(int seasons) {
        this.seasons = seasons;
    }
}
