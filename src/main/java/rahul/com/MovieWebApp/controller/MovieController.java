package rahul.com.MovieWebApp.controller;

import com.fasterxml.jackson.databind.util.JSONPObject;
import org.apache.coyote.Response;
import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import rahul.com.MovieWebApp.dao.WatchedListRepository;
import rahul.com.MovieWebApp.model.Image;
import rahul.com.MovieWebApp.model.Movie;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

@RestController
@RequestMapping("/movie")
public class MovieController {

    @Value("${api.key}")
    private String apiKey;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private WatchedListRepository watchedListRepository;

    public JSONArray helperFunction(String title) {
        String url = "https://api.themoviedb.org/3/search/movie?api_key=" +  apiKey +
                "&language=en-US&query=" + title;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        String string = response.getBody();
        JSONObject root = new JSONObject(string);
        return root.getJSONArray("results");
    }

    @GetMapping("/get/{id}")
    public Movie getTheMovie(@PathVariable int id) {
        String url = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + apiKey + "&language=en-US";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        String string = response.getBody();
        // System.out.println(string);
        JSONObject root = new JSONObject(string);
        return new Movie(root.getInt("id"), root.getString("original_title"), root.getString("overview"),
                root.getString("release_date"), root.getDouble("vote_average"));
    }

    @GetMapping("/{title}")
    public String[][] getMovieInfo(@PathVariable("title") String title) {
        JSONArray movies = helperFunction(title);
        String[] movieTitles = new String[movies.length()];
        String[] movieImages = new String[movies.length()];
        // HashMap<String, String> map = new HashMap<>();
        for (int i = 0; i < movies.length(); i++) {
            JSONObject movie = movies.getJSONObject(i);
            movieTitles[i] = movie.getString("original_title");
            Object object = movie.get("backdrop_path");
            // System.out.print(i + " " + object);
            if (object.equals(null)) {
                // System.out.println("null");
                movieImages[i] = "-1";
            }else {
                movieImages[i] = "http://image.tmdb.org/t/p/w500" + object;
            }
        }
        String[][] result = new String[2][];
        result[0] = movieTitles;
        result[1] = movieImages;
        return result;
    }

    @GetMapping("/getImage/{id}")
    public Image getImage(@PathVariable int id) {
        String url = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + apiKey + "&language=en-US";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        String string = response.getBody();
        JSONObject root = new JSONObject(string);
        return new Image("http://image.tmdb.org/t/p/w500" + root.getString("backdrop_path"));
    }

    /* @GetMapping("/getImage/{title}")
    public Object[] getMovies(@PathVariable("title") String title) {
        JSONArray movies = helperFunction(title);
        // HashMap<String, String> map = new HashMap<>();
        String[] movieImages = new String[movies.length()];
        for (int i = 0; i < movies.length(); i++) {
            JSONObject movie = movies.getJSONObject(i);
        }
        return movieImages;
    }*/

    @GetMapping("/{title}/{index}")
    public Movie getMovieInfo(@PathVariable("title") String title, @PathVariable("index") int index) {
        JSONArray movies = helperFunction(title);
        // System.out.println(movies);
        JSONObject movie = movies.getJSONObject(index);
        return new Movie(movie.getInt("id"), movie.getString("original_title"), movie.getString("overview"),
                movie.getString("release_date"), movie.getDouble("vote_average"));
    }

    @GetMapping("/rating/{id}")
    public double getMovieRating(@PathVariable("id") int id) {
        ArrayList<Integer> ratings = watchedListRepository.findRatingById(id);
        double totalCount = 0;
        int total = 0;
        for (int rating : ratings) {
            if (rating != -1) {
                totalCount++;
                total += rating;
            }
        }
        if (totalCount == 0) return -1;
        return total / totalCount;
    }

    @GetMapping("/comment&rating/{id}")
    public ArrayList<ArrayList<Object>> getCommentAndRating(@PathVariable("id") int id) {
        ArrayList<ArrayList<Object>> list2 = watchedListRepository.findCommentsAndRatingById(id);
        ArrayList<ArrayList<Object>> list = new ArrayList<>();
        for (int i = list2.size() - 1; i >= 0; i--) {
            list.add(list2.get(i));
        }
        System.out.println(list);
        return list;
    }
}

