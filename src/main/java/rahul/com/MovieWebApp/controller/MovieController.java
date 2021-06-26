package rahul.com.MovieWebApp.controller;

import com.fasterxml.jackson.databind.util.JSONPObject;
import org.apache.coyote.Response;
import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import rahul.com.MovieWebApp.dao.UserInfoRepository;
import rahul.com.MovieWebApp.dao.WatchListRepository;
import rahul.com.MovieWebApp.dao.WatchedListRepository;
import rahul.com.MovieWebApp.model.Image;
import rahul.com.MovieWebApp.model.Movie;
import rahul.com.MovieWebApp.model.WatchList;

import java.util.*;

@RestController
@RequestMapping("/movie")
public class MovieController {

    @Value("${api.key}")
    private String apiKey;

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private WatchedListRepository watchedListRepository;
    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private WatchListRepository watchListRepository;

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

    @GetMapping("/recommendations/{username}")
    public ArrayList<ArrayList<Object>> getMovieRecommendations(@PathVariable("username") String username) {
        ArrayList<Integer> listOfWatchedMovies = watchedListRepository.findWatchlistByUsername(username, "yes");
        // List<Integer> listOfToWatchMovies = watchListRepository.findByUsername(username, "yes");
        ArrayList<Object> listOfRecMovies = new ArrayList<>();
        ArrayList<Object> titles = new ArrayList<>();
        ArrayList<Object> images = new ArrayList<>();
        // ArrayList<ArrayList<Object>> RecMovies = new ArrayList<>();

        for (int i = 0; i < listOfWatchedMovies.size(); i++) {

            String url = "https://api.themoviedb.org/3/movie/" + listOfWatchedMovies.get(i) + "/recommendations?api_key=" + apiKey
                    + "&language=en-US&page=1";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            String string = response.getBody();
            JSONObject root = new JSONObject(string);
            JSONArray array = root.getJSONArray("results");
            // System.out.println(array);
            for (int j = 0; j < array.length(); j++) {
                // ArrayList<Object> movie = new ArrayList<>();
                JSONObject object = array.getJSONObject(j);
                int movieId = object.getInt("id");
                if (!listOfRecMovies.contains(movieId)) {
                    listOfRecMovies.add(movieId);
                    titles.add(object.getString("original_title"));
                    try {
                        images.add("http://image.tmdb.org/t/p/w500" + object.getString("backdrop_path"));
                    }catch (JSONException e) {
                        images.add("-1");
                    }
                }

            }
        }
        ArrayList<ArrayList<Object>> list = new ArrayList<>();
        if (images.size() > 30) {
            ArrayList<Object> newIds = new ArrayList<>();
            ArrayList<Object> newTitles = new ArrayList<>();
            ArrayList<Object> newImages = new ArrayList<>();
            for (int i = 0; i < 30; i++) {
                int randomIndex = (int)(Math.random() * listOfRecMovies.size());
                newIds.add(listOfRecMovies.get(randomIndex));
                newTitles.add(titles.get(randomIndex));
                newImages.add(images.get(randomIndex));
                listOfRecMovies.remove(randomIndex);
                titles.remove(randomIndex);
                images.remove(randomIndex);
            }
            list.add(newIds);
            list.add(newTitles);
            list.add(newImages);
            return list;
        }
        list.add(listOfRecMovies);
        list.add(titles);
        list.add(images);
        return list;
    }

    @GetMapping("/popularMovies")
    public ArrayList<ArrayList<Object>> getPopularMovies() {
        ArrayList<Object> listOfRecMovies = new ArrayList<>();
        ArrayList<Object> titles = new ArrayList<>();
        ArrayList<Object> images = new ArrayList<>();
        // ArrayList<ArrayList<Object>> RecMovies = new ArrayList<>();



            String url = "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&language=en-US&page=1";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            String string = response.getBody();
            JSONObject root = new JSONObject(string);
            JSONArray array = root.getJSONArray("results");
            // System.out.println(array);
            for (int j = 0; j < array.length(); j++) {
                // ArrayList<Object> movie = new ArrayList<>();
                JSONObject object = array.getJSONObject(j);
                int movieId = object.getInt("id");
                if (!listOfRecMovies.contains(movieId)) {
                    listOfRecMovies.add(movieId);
                    titles.add(object.getString("original_title"));
                    try {
                        images.add("http://image.tmdb.org/t/p/w500" + object.getString("backdrop_path"));
                    }catch (JSONException e) {
                        images.add("-1");
                    }
                }

            }
        ArrayList<ArrayList<Object>> list = new ArrayList<>();
        list.add(listOfRecMovies);
        list.add(titles);
        list.add(images);
        return list;
    }

    @GetMapping("/getImage/{id}")
    public Image getImage(@PathVariable int id) {
        String url = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + apiKey + "&language=en-US";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        String string = response.getBody();
        JSONObject root = new JSONObject(string);
        Object object = "";
        try {
            object = root.getString("backdrop_path");
        }catch (JSONException e) {
            return new Image("-1");
        }


        return new Image("http://image.tmdb.org/t/p/w500" + object);
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
        ArrayList<Integer> ratings = watchedListRepository.findRatingById(id, "yes");
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
        ArrayList<ArrayList<Object>> list2 = watchedListRepository.findCommentsAndRatingById(id, "yes");
        ArrayList<ArrayList<Object>> list = new ArrayList<>();
        for (int i = list2.size() - 1; i >= 0; i--) {
            list.add(list2.get(i));
        }
        System.out.println(list);
        return list;
    }


}

