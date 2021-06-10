package rahul.com.MovieWebApp.controller;

import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import rahul.com.MovieWebApp.dao.UserInfoRepository;
import rahul.com.MovieWebApp.dao.WatchListRepository;
import rahul.com.MovieWebApp.dao.WatchedListRepository;
import rahul.com.MovieWebApp.model.Image;
import rahul.com.MovieWebApp.model.UserInfo;
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
    private UserInfoRepository userInfoRepository;
    @Autowired
    private WatchListRepository watchlistRepository;
    @Autowired
    private WatchedListRepository watchedlistRepository;

    @Autowired
    private UserServices service;


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
            List<Integer> watchlist = watchlistRepository.findByUsername(username);
            List<WatchedList> watchedlist = watchedlistRepository.findByUsername(username);
            ArrayList<Integer> newList = new ArrayList<>(watchlist);
            ArrayList<WatchedList> newList2 = new ArrayList<>(watchedlist);
            mainUserInfo.setWatchList(newList);
            mainUserInfo.setWatchedList(newList2);
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
                        return new Image("success");
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