package rahul.com.MovieWebApp.controller;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import rahul.com.MovieWebApp.dao.WatchListRepository;
import rahul.com.MovieWebApp.dao.WatchedListRepository;
import rahul.com.MovieWebApp.model.Image;
import rahul.com.MovieWebApp.model.Movie;
import rahul.com.MovieWebApp.model.TV;

import java.util.ArrayList;

@RestController
@RequestMapping("/tv")
public class TVController {

    @Value("${api.key}")
    private String apiKey;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private WatchedListRepository watchedListRepository;

    @GetMapping("/{title}/{pageNumber}")
    public Object[][] getTVInfo(@PathVariable String title, @PathVariable int pageNumber) {
        String url = "https://api.themoviedb.org/3/search/tv?api_key=" + apiKey + "&language=en-US&page=" + pageNumber + "&query=" + title;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        String string = response.getBody();
        JSONObject root = new JSONObject(string);
        JSONArray array = root.getJSONArray("results");
        int totalPages = root.getInt("total_pages");
        String[] movieTitles = new String[array.length()];
        String[] movieImages = new String[array.length()];
        for (int i = 0; i < array.length(); i++) {
            JSONObject movie = array.getJSONObject(i);
            movieTitles[i] = movie.getString("name");
            int movieId = movie.getInt("id");
            String url2 = getImage(movieId).getUrl();
            movieImages[i] = url2;
        }
        Object[][] result = new Object[3][];
        result[0] = movieTitles;
        result[1] = movieImages;
        Object[] index = {totalPages};
        result[2] = index;
        return result;
    }

    @GetMapping("/get/{id}")
    public TV getTheTVShow(@PathVariable int id) {
        String url = "https://api.themoviedb.org/3/tv/" + id + "?api_key=" + apiKey + "&language=en-US";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        String string = response.getBody();
        JSONObject root = new JSONObject(string);
        return new TV(root.getInt("id"), root.getString("original_name"), root.getString("overview"),
                root.getString("first_air_date"), root.getString("last_air_date"),root.getDouble("vote_average"),
                root.getInt("number_of_seasons"));
    }

    @GetMapping("/{title}/{pageNumber}/{index}")
    public TV getMovieInfo(@PathVariable("title") String title, @PathVariable("pageNumber") int pageNumber, @PathVariable("index") int index) {
        String url = "https://api.themoviedb.org/3/search/tv?api_key=" + apiKey + "&language=en-US&page="+ pageNumber +"&query=" + title;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        String string = response.getBody();
        // System.out.println(string);
        JSONObject root1 = new JSONObject(string);
        JSONArray movies = root1.getJSONArray("results");
        // System.out.println(movies);
        JSONObject root = movies.getJSONObject(index);
        int id = root.getInt("id");
        return getTheTVShow(id);
    }

    @GetMapping("/getImage/{id}")
    public Image getImage(@PathVariable int id) {
        String url = "https://api.themoviedb.org/3/tv/" + id + "?api_key=" + apiKey + "&language=en-US";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        String string = response.getBody();
        JSONObject root = new JSONObject(string);
        Object object = "";
        try {
            object = root.getString("backdrop_path");
            if (object == null) return new Image("-1");
        }catch (JSONException e) {
            return new Image("-1");
        }


        return new Image("http://image.tmdb.org/t/p/w500" + object);
    }

    @GetMapping("/rating/{id}")
    public double getMovieRating(@PathVariable("id") int id) {
        ArrayList<Integer> ratings = watchedListRepository.findRatingById(id, "no");
        double totalCount = 0;
        int total = 0;
        for (int rating : ratings) {
            if (rating != -1) {
                totalCount++;
                total += rating;
            }
        }
        System.out.println("total count = " + totalCount);
        if (totalCount == 0) return -1;
        return total / totalCount;
    }

    @GetMapping("/comment&rating/{id}")
    public ArrayList<ArrayList<Object>> getCommentAndRating(@PathVariable("id") int id) {
        ArrayList<ArrayList<Object>> list2 = watchedListRepository.findCommentsAndRatingById(id, "no");
        ArrayList<ArrayList<Object>> list = new ArrayList<>();
        for (int i = list2.size() - 1; i >= 0; i--) {
            list.add(list2.get(i));
        }
        System.out.println(list);
        return list;
    }

    @GetMapping("/recommendations/{username}")
    public ArrayList<ArrayList<Object>> getMovieRecommendations(@PathVariable("username") String username) {
        ArrayList<Integer> listOfWatchedMovies = watchedListRepository.findWatchlistByUsername(username, "no");
        // List<Integer> listOfToWatchMovies = watchListRepository.findByUsername(username, "yes");
        ArrayList<Object> listOfRecMovies = new ArrayList<>();
        ArrayList<Object> titles = new ArrayList<>();
        ArrayList<Object> images = new ArrayList<>();
        // ArrayList<ArrayList<Object>> RecMovies = new ArrayList<>();

        for (int i = 0; i < listOfWatchedMovies.size(); i++) {

            String url = "https://api.themoviedb.org/3/tv/" + listOfWatchedMovies.get(i) + "/recommendations?api_key=" + apiKey
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
                    titles.add(object.getString("original_name"));
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

    @GetMapping("/popular")
    public ArrayList<ArrayList<Object>> getPopularMovies() {
        ArrayList<Object> listOfRecMovies = new ArrayList<>();
        ArrayList<Object> titles = new ArrayList<>();
        ArrayList<Object> images = new ArrayList<>();

        String url = "https://api.themoviedb.org/3/tv/popular?api_key=" + apiKey + "&language=en-US&page=1";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        String string = response.getBody();
        JSONObject root = new JSONObject(string);
        JSONArray array = root.getJSONArray("results");

        for (int j = 0; j < array.length(); j++) {
            // ArrayList<Object> movie = new ArrayList<>();
            JSONObject object = array.getJSONObject(j);
            int movieId = object.getInt("id");
            if (!listOfRecMovies.contains(movieId)) {
                listOfRecMovies.add(movieId);
                titles.add(object.getString("original_name"));
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
}
