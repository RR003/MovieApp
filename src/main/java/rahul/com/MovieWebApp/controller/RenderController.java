package rahul.com.MovieWebApp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import rahul.com.MovieWebApp.dao.UserRepository;
import rahul.com.MovieWebApp.model.User;
import rahul.com.MovieWebApp.service.UserServices;

@Controller
public class RenderController {

    @Autowired
    private UserServices service;

    @Autowired
    private UserRepository userRepository;

    @RequestMapping("/verify")
    @ResponseBody
    public ModelAndView welcome(@Param("code") String code) {
        if (service.verify(code)) {
            System.out.println("account is verified!");
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("AccountCreated");
            return modelAndView;
        } else {
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("VerUnsuc");
            return modelAndView;
        }
    }

    @RequestMapping("/createPassword")
    @ResponseBody
    public ModelAndView forgotPassword(@Param("code") String code) {
        if (service.verifyPassword(code)) {
            System.out.println("account is verified!");
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("CreateNewPassword");
            return modelAndView;
        } else {
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("VerUnsuc");
            return modelAndView;
        }
    }

    @RequestMapping(value="/createPasswordVerified")
    @ResponseBody
    public String createNewPassword(@RequestBody User user1) {
        System.out.println("creating new password ....");
        User user = userRepository.findByVerificationCode(user1.getVerificationCode());
        user.setVerificationCode(null);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String encodedPassword = encoder.encode(user1.getPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);
        return "";
    }

    @RequestMapping("/newPassword")
    @ResponseBody
    public ModelAndView newPassword() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("NewPasswordSuccess");
        return modelAndView;
    }




}
