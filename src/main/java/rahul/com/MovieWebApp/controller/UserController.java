package rahul.com.MovieWebApp.controller;

import com.auth0.jwt.interfaces.Claim;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import net.bytebuddy.utility.RandomString;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import rahul.com.MovieWebApp.dao.FriendRepository;
import rahul.com.MovieWebApp.dao.UserInfoRepository;
import rahul.com.MovieWebApp.dao.WatchListRepository;
import rahul.com.MovieWebApp.dao.WatchedListRepository;
import rahul.com.MovieWebApp.model.*;
import rahul.com.MovieWebApp.service.UserServices;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

import javax.crypto.spec.SecretKeySpec;
import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.xml.bind.DatatypeConverter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.security.GeneralSecurityException;
import java.security.Key;
import java.util.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Value("${api.key}")
    private String apiKey;

    @Value("{secret.key}")
    private String secretKey;

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private WatchListRepository watchlistRepository;
    @Autowired
    private WatchedListRepository watchedlistRepository;
    @Autowired
    private UserServices service;
    @Autowired
    private FriendRepository friendRepository;




    @GetMapping("/")
    public ArrayList<String> getAllUsers() {
        return userInfoRepository.getAllUsernames();
    }

    @GetMapping("/{username}")
    public UserInfo getUser(@PathVariable String username){
        Optional<UserInfo> user = userInfoRepository.findByUsername(username);
        UserInfo mainUserInfo;
        if (user.isPresent()) {
            mainUserInfo = user.get();
            List<Integer> watchlist = watchlistRepository.findByUsername(username, "yes");
            List<Integer> tvWatchList = watchlistRepository.findByUsername(username, "no");
            List<WatchedList> watchedlist = watchedlistRepository.findByUsername(username);
            ArrayList<Integer> newList = new ArrayList<>(watchlist);
            ArrayList<WatchedList> newList2 = new ArrayList<>(watchedlist);
            ArrayList<Integer> newList3 = new ArrayList<>(tvWatchList);
            mainUserInfo.setWatchList(newList);
            mainUserInfo.setWatchedList(newList2);
            mainUserInfo.setTvWatchList(newList3);
            System.out.println(mainUserInfo);
            return mainUserInfo;
        }

        return new UserInfo();
    }

    @PostMapping("/create")
    public UserInfo createUser(@Valid @RequestBody UserInfo userInfo) throws URISyntaxException {
        System.out.println("this function is running");
        // System.out.println(user.getUsername())
        /*System.out.println(user.getEmail());
        System.out.println(user.getFirstName());
        System.out.println(user.getId());*/
        UserInfo userInfo2 = new UserInfo();
        userInfo2.setFirstName(userInfo.getFirstName());
        userInfo2.setLastName(userInfo.getLastName());
        userInfo2.setEmail(userInfo.getEmail());
        userInfo2.setUsername(userInfo.getUsername());
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String encodedPassword = encoder.encode(userInfo.getPassword());
        userInfo2.setPassword(encodedPassword);
        System.out.println(userInfo2.getPassword());
        return userInfoRepository.save(userInfo2);
    }

    @GetMapping("/test")
    public Image authenticate(@RequestHeader("token") String token) {
        System.out.println("um hello");
        Claims claim = decodeJWT(token);
        if (claim == null) {
            return new Image("invalid");
        }
        return new Image("valid");
    }

    @GetMapping("/logout")
    public void logout(@RequestBody UserInfo userInfo) {
        String jwt = createJWT(userInfo.getUsername(), 10000);
        System.out.println("logout");
    }

    // is a image because string can be parsed as a JSON object. AKA too lazy to google how to do this lol.
    @PostMapping("/login")
    public Image loginUser(@Valid @RequestBody UserInfo userInfo1) {
        Optional<UserInfo> user = userInfoRepository.findByUsername(userInfo1.getUsername());
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        if (user.isPresent()) {
            System.out.println(user);
            try {
                if (user.get().getVerified().equals("yes")) {
                    System.out.println("yeet");
                    if (encoder.matches(userInfo1.getPassword(), user.get().getPassword())) {
                        String jwt = createJWT(user.get().getUsername(), 1200000);
                        Claims claim = decodeJWT(jwt);
                        System.out.println(claim);
                        return new Image(jwt);
                    }else {
                        return new Image("invalid password");
                    }
                }else {

                }
            }catch(NullPointerException e) {
                System.out.println(userInfo1.getVerified());
                System.out.println("not verified");
                return new Image("account not verified");
            }
        }else {
            return new Image("invalid username");
        }
        return new Image();
    }


    public String createJWT(String username,  long ttlMillis) {

        //The JWT signature algorithm we will be using to sign the token
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);


        //We will sign our JWT with our ApiKey secret
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(secretKey);
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

        //Let's set the JWT Claims
        JwtBuilder builder = Jwts.builder().setId(username)
                .setIssuedAt(now)
                .signWith(signatureAlgorithm, signingKey);

        //if it has been specified, let's add the expiration
        if (ttlMillis > 0) {
            long expMillis = nowMillis + ttlMillis;
            Date exp = new Date(expMillis);
            builder.setExpiration(exp);
        }

        //Builds the JWT and serializes it to a compact, URL-safe string
        return builder.compact();
    }

    public Claims decodeJWT(String jwt) {
        //This line will throw an exception if it is not a signed JWS (as expected)
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(DatatypeConverter.parseBase64Binary(secretKey))
                    .parseClaimsJws(jwt).getBody();
            System.out.println("valid!");
            return claims;
        }catch(Exception e) {
            System.out.println("invalid");
            return null;
        }


    }



    @PostMapping("/signup")
    public Image signupUser(@Valid @RequestBody UserInfo userInfo1, HttpServletRequest request)
            throws UnsupportedEncodingException, MessagingException {
        Optional<UserInfo> user = userInfoRepository.findByUsername(userInfo1.getUsername());
        Optional<UserInfo> user2 = userInfoRepository.findByEmail(userInfo1.getEmail());
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        if (!user.isPresent() && !user2.isPresent()) {
            String encodedPassword = encoder.encode(userInfo1.getPassword());
            userInfo1.setPassword(encodedPassword);
            userInfo1.setVerified("no");
            String randomCode = RandomString.make(64);
            userInfo1.setVerificationCode(randomCode);
            userInfoRepository.save(userInfo1);
            String siteURL = request.getRequestURL().toString();
            System.out.println(siteURL);
            service.sendVerificationEmail(userInfo1, siteURL);
            return new Image("success");
        }else if (!user.isPresent()){
            return new Image("that email is already registered!");
        }else {
            return new Image("that username is already registered!");
        }
    }

    @GetMapping("/signup/verify")
    @ResponseBody
    public String verifyUser(@Param("code") String code) {
        if (service.verify(code)) {
            System.out.println("account is verified!");
            return "AccountCreated";
        } else {
            return "verify_fail";
        }
    }

    @PostMapping("/forgotPassword")
    public Image createNewPassword(@RequestBody Image image, HttpServletRequest request) throws UnsupportedEncodingException, MessagingException {
        String email = image.getUrl();
        System.out.println("forgot password email = " + email);
        Optional<UserInfo> user = userInfoRepository.findByEmail(email);
        if (!user.isPresent()) {
            return new Image("Email is not registered in system");
        }else {
            String randomCode = RandomString.make(64);
            user.get().setVerificationCode(randomCode);
            userInfoRepository.save(user.get());
            String siteURL = request.getRequestURL().toString();
            System.out.println(siteURL);
            service.sendNewPasswordEmail(user.get(), siteURL);
            return new Image("success");
        }
    }



    @PostMapping("/addWatchList")
    public WatchList addMovieToWatchList(@Valid @RequestBody WatchList watchList) {
        return watchlistRepository.save(watchList);
    }

    @DeleteMapping("/deleteWatchList")
    public WatchList deleteMovie(@Valid @RequestBody WatchList watchList) {
        System.out.println(watchList.getUsername());
        watchlistRepository.deleteByUsernameAndMovieId(watchList.getUsername(), watchList.getMovieId(), watchList.getIsMovie());
        return watchList;
    }

    @PostMapping("/addWatchedList")
    public WatchedList addMovieToWatchedList(@Valid @RequestBody WatchedList watchedList) {
        return watchedlistRepository.save(watchedList);
    }

    @PutMapping("/updateWatchedList")
    public WatchedList updateMovieWatchedList(@Valid @RequestBody WatchedList watchedList) {
        System.out.println("this method is running");
        WatchedList wl = watchedlistRepository.
                findWatchlistByUsernameAndRating(watchedList.getUsername(), watchedList.getMovieId());
        wl.setRating(watchedList.getRating());
        wl.setComment(watchedList.getComment());
        return watchedlistRepository.save(wl);
    }

    @PostMapping("/friendRequest")
    public Image createFriendRequest(@Valid @RequestBody Friend friend) {
        UserInfo userInfo = userInfoRepository.findTheUsernamefromUserInfo(friend.getReceiverId());
        Friend friend2 = friendRepository.getFriendFromParams(friend.getSenderId(), friend.getReceiverId());
        if (userInfo == null) return new Image("username not registered");
        else if (friend2 != null) return new Image("already sent friend request to " + friend.getReceiverId());
        else if (userInfo.getUsername().equals(friend.getSenderId())) return new Image("cannot send request to yourself");
        else  {
            friendRepository.save(friend);
            return new Image("sent request to " + friend.getReceiverId());
        }
    }

    @PostMapping("/acceptFriendRequest")
    public Friend createFriends(@Valid @RequestBody Friend friend) {
        System.out.println("Friend = " + friend);
        Friend newFriend = friendRepository.getFriendFromParams(friend.getSenderId(), friend.getReceiverId());
        newFriend.setIsVerified("yes");
        Friend otherFriend = new Friend(newFriend.getReceiverId(), newFriend.getSenderId(), "yes");
        friendRepository.save(newFriend);
        friendRepository.save(otherFriend);
        return otherFriend;
    }

    @DeleteMapping("/deleteFriendRequest")
    public Friend deleteFriendRequest(@Valid @RequestBody Friend friend) {
        System.out.println("Friend = " + friend);
        friendRepository.deleteFriendFromParams(friend.getReceiverId(), friend.getSenderId());
        return friend;
    }

    @GetMapping("/getFriends/{senderId}")
    public ArrayList<String> getFriends(@PathVariable String senderId) {
        return friendRepository.getFriendsFromUser(senderId, "yes");
    }

    @GetMapping("/getFriendRequests/{username}")
    public ArrayList<String> getFriendRequests(@PathVariable String username) {
        return friendRepository.getFriendRequestsFromUser(username, "no");
    }

    @GetMapping("/getFriendMovies/{username}")
    public ArrayList<ArrayList<Object>> getFriendsMovies(@PathVariable String username) {
        ArrayList<String> listOfFriends = friendRepository.getFriendsFromUser(username, "yes");
        Set<Object> listOfMovies = new HashSet<>();
        // Set<Object> titles = new HashSet<>();
        // Set<Object> images = new HashSet<>();
        Set<Object> listOfTvs = new HashSet<>();
        // Set<Object> tvTitles = new HashSet<>();
        // Set<Object> tvImages = new HashSet<>();
        for (String listOfFriend : listOfFriends) {
            List<WatchedList> watchedLists = watchedlistRepository.findByUsername(listOfFriend);
            for (WatchedList watchedList : watchedLists) {
                if (watchedList.getIsMovie().equals("yes")) {
                    listOfMovies.add(watchedList.getMovieId());

                }else {
                    listOfTvs.add(watchedList.getMovieId());

                }


            }
        }
        ArrayList<Object> movieList = new ArrayList<>(listOfMovies);
        ArrayList<Object> tvList = new ArrayList<>(listOfTvs);
        if (movieList.size() > 30) {
            ArrayList<Object> temp = new ArrayList<>();
            for (int i = 0; i < 30; i++) {
                int random = (int)(Math.random() * movieList.size());
                temp.add(movieList.get(random));
                listOfMovies.remove(random);
            }
            movieList = temp;
        }
        if (tvList.size() > 30) {
            ArrayList<Object> temp2 = new ArrayList<>();
            for (int i = 0; i < 30; i++) {
                int random = (int)(Math.random() * tvList.size());
                temp2.add(tvList.get(random));
                tvList.remove(random);
            }
            tvList = temp2;
        }

        ArrayList<Object> movieTitles = new ArrayList<>();
        ArrayList<Object> movieImages = new ArrayList<>();
        ArrayList<Object> tvTitles = new ArrayList<>();
        ArrayList<Object> tvImages = new ArrayList<>();

        for (int i = 0; i < movieList.size(); i++) {
            int movieId = (int)movieList.get(i);
            String url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + apiKey + "&language=en-US";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            String string = response.getBody();
            // System.out.println(string);
            JSONObject root = new JSONObject(string);
            movieTitles.add(root.getString("original_title"));
            try {
                movieImages.add("http://image.tmdb.org/t/p/w500" + root.getString("backdrop_path"));
                // System.out.println("yo");
            }catch (JSONException e) {
                movieImages.add("-1");
            }
        }
        for (int i = 0; i < tvList.size(); i++) {
            int movieId = (int)tvList.get(i);
            String url = "https://api.themoviedb.org/3/tv/" + movieId + "?api_key=" + apiKey + "&language=en-US";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            String string = response.getBody();
            // System.out.println(string);
            JSONObject root = new JSONObject(string);
            tvTitles.add(root.getString("original_name"));
            try {
                tvImages.add("http://image.tmdb.org/t/p/w500" + root.getString("backdrop_path"));
            }catch (JSONException e) {
                tvImages.add("-1");
            }
        }

        ArrayList<ArrayList<Object>> list = new ArrayList<ArrayList<Object>>();
        list.add(movieList);
        list.add(movieTitles);
        list.add(movieImages);
        list.add(tvList);
        list.add(tvTitles);
        list.add(tvImages);
        return list;
    }

    @PostMapping("/googleSignIn")
    public UserInfo signInWithGoogle(@RequestBody Image image) throws GeneralSecurityException, IOException, MessagingException {

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier(new NetHttpTransport(), new JacksonFactory());
        GoogleIdToken token = verifier.verify(image.getUrl());
        if (token != null) {
            GoogleIdToken.Payload payload = token.getPayload();

            String userId = payload.getSubject();
            String email = payload.getEmail();
            boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");
            String locale = (String) payload.get("locale");
            String familyName = (String) payload.get("family_name");
            String givenName = (String) payload.get("given_name");


            Optional<UserInfo> isUser = userInfoRepository.findByEmail(email);
            if (isUser.isPresent()) {
                System.out.println("this user does exist! = ");
                UserInfo user = isUser.get();
                String jwt = createJWT(user.getUsername(), 150000);
                user.setVerificationCode(jwt);
                Claims claim = decodeJWT(jwt);
                System.out.println(claim);
                return user;
            }else {
                System.out.println("user does not exist");
                String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
                StringBuilder salt = new StringBuilder();
                Random rnd = new Random();
                while (salt.length() < 10) { // length of the random string.
                    int index = (int) (rnd.nextFloat() * SALTCHARS.length());
                    salt.append(SALTCHARS.charAt(index));
                }
                String username = salt.toString();
                UserInfo userInfo1 = new UserInfo();
                userInfo1.setEmail(email);
                userInfo1.setUsername(username);
                userInfo1.setFirstName(name);
                userInfo1.setLastName("");
                userInfo1.setPassword("google sign in");
                userInfo1.setVerified("yes");
                userInfoRepository.save(userInfo1);
                service.sendConfirmationEmail(userInfo1);

                String jwt = createJWT(userInfo1.getUsername(), 900000);
                userInfo1.setVerificationCode(jwt);
                Claims claim = decodeJWT(jwt);
                System.out.println(claim);



                return userInfo1;
            }
        }else {
            System.out.println("invalid token");
        }
        return new UserInfo();
    }

    @PostMapping("/submit")
    public String sendRequest(@RequestBody UserInfo userInfo) throws UnsupportedEncodingException, MessagingException {
        String email = userInfo.getEmail();
        String info = userInfo.getPassword();
        try {
            service.sendProblem(email,info);
            return "success";
        }catch (Exception e) {
            return "fail";
        }

    }
}