package rahul.com.MovieWebApp.controller;

import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import rahul.com.MovieWebApp.dao.UserRepository;
import rahul.com.MovieWebApp.dao.WatchListRepository;
import rahul.com.MovieWebApp.dao.WatchedListRepository;
import rahul.com.MovieWebApp.model.Image;
import rahul.com.MovieWebApp.model.User;
import rahul.com.MovieWebApp.model.WatchList;
import rahul.com.MovieWebApp.model.WatchedList;
import rahul.com.MovieWebApp.service.UserServices;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WatchListRepository watchlistRepository;
    @Autowired
    private WatchedListRepository watchedlistRepository;

    @Autowired
    private UserServices service;


    @GetMapping("/")
    public ArrayList<String> getAllUsers() {
        return userRepository.getAllUsernames();
    }

    @GetMapping("/{username}")
    public User getUser(@PathVariable String username){
        Optional<User> user = userRepository.findByUsername(username);
        User mainUser;
        if (user.isPresent()) {
            mainUser = user.get();
            List<Integer> watchlist = watchlistRepository.findByUsername(username);
            List<WatchedList> watchedlist = watchedlistRepository.findByUsername(username);
            ArrayList<Integer> newList = new ArrayList<>(watchlist);
            ArrayList<WatchedList> newList2 = new ArrayList<>(watchedlist);
            mainUser.setWatchList(newList);
            mainUser.setWatchedList(newList2);
            return mainUser;
        }

        return new User();
    }

    @PostMapping("/create")
    public User createUser(@Valid @RequestBody User user) throws URISyntaxException {
        System.out.println("this function is running");
        // System.out.println(user.getUsername())
        /*System.out.println(user.getEmail());
        System.out.println(user.getFirstName());
        System.out.println(user.getId());*/
        User user2 = new User();
        user2.setFirstName(user.getFirstName());
        user2.setLastName(user.getLastName());
        user2.setEmail(user.getEmail());
        user2.setUsername(user.getUsername());
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String encodedPassword = encoder.encode(user.getPassword());
        user2.setPassword(encodedPassword);
        System.out.println(user2.getPassword());
        return userRepository.save(user2);
    }

    // is a image because string can be parsed as a JSON object. AKA too lazy to google how to do this lol.
    @PostMapping("/login")
    public Image loginUser(@Valid @RequestBody User user1) {
        Optional<User> user = userRepository.findByUsername(user1.getUsername());
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        if (user.isPresent()) {
            System.out.println(user);
            try {
                if (user.get().getVerified().equals("yes")) {
                    System.out.println("yeet");
                    if (encoder.matches(user1.getPassword(), user.get().getPassword())) {
                        return new Image("success");
                    }else {
                        return new Image("invalid password");
                    }
                }else {

                }
            }catch(NullPointerException e) {
                System.out.println(user1.getVerified());
                System.out.println("not verified");
                return new Image("account not verified");
            }
        }else {
            return new Image("invalid username");
        }
        return new Image();
    }

    @PostMapping("/signup")
    public Image signupUser(@Valid @RequestBody User user1, HttpServletRequest request)
            throws UnsupportedEncodingException, MessagingException {
        Optional<User> user = userRepository.findByUsername(user1.getUsername());
        Optional<User> user2 = userRepository.findByEmail(user1.getEmail());
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        if (user.isEmpty() && user2.isEmpty()) {
            String encodedPassword = encoder.encode(user1.getPassword());
            user1.setPassword(encodedPassword);
            user1.setVerified("no");
            String randomCode = RandomString.make(64);
            user1.setVerificationCode(randomCode);
            userRepository.save(user1);
            String siteURL = request.getRequestURL().toString();
            System.out.println(siteURL);
            service.sendVerificationEmail(user1, siteURL);
            return new Image("success");
        }else if (user.isEmpty()){
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
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return new Image("Email is not registered in system");
        }else {
            String randomCode = RandomString.make(64);
            user.get().setVerificationCode(randomCode);
            userRepository.save(user.get());
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
    public void deleteMovie(@Valid @RequestBody WatchList watchList) {
        System.out.println(watchList.getUsername());
        watchlistRepository.deleteByUsernameAndMovieId(watchList.getUsername(), watchList.getMovieId());
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
}