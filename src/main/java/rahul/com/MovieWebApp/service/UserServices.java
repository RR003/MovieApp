package rahul.com.MovieWebApp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import rahul.com.MovieWebApp.dao.UserInfoRepository;
import rahul.com.MovieWebApp.model.UserInfo;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Service
public class UserServices {

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(UserInfo userInfo, String siteURL) throws MessagingException, UnsupportedEncodingException {
        System.out.println("URL = " + siteURL);
        if (!siteURL.equals("http://localhost:8081/user/signup")) {
            siteURL = "https://movieapp003.herokuapp.com/user/signup";
        }else {
            System.out.println("is running from localhost");
        }
        String toAddress = userInfo.getEmail();
        String fromAddress = "mail2rahulraja@gmail.com";
        String senderName = "The Movie App";
        String subject = "Please verify your registration";
        String content = "Dear [[name]],<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + "The movie app.";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", userInfo.getFirstName() + " " +  userInfo.getLastName());
        siteURL = siteURL.substring(0,siteURL.length() - 11);
        siteURL += "verify";
        String verifyURL = siteURL + "?code=" + userInfo.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);
    }

    public boolean verify(String verificationCode) {
        UserInfo userInfo = userInfoRepository.findByVerificationCode(verificationCode);
        System.out.println(userInfo);
        if (userInfo == null || userInfo.getVerified().equals("yes")) {
            return false;
        } else {
            userInfo.setVerificationCode(null);
            userInfo.setVerified("yes");
            userInfoRepository.save(userInfo);
            return true;
        }
    }

    public boolean verifyPassword(String code) {
        UserInfo userInfo = userInfoRepository.findByVerificationCode(code);
        return userInfo != null;
    }

    public void sendNewPasswordEmail(UserInfo userInfo, String siteURL) throws MessagingException, UnsupportedEncodingException {
        String toAddress = userInfo.getEmail();
        String fromAddress = "mail2rahulraja@gmail.com";
        String senderName = "The Movie App";
        String subject = "Forgot Password";
        String content = "Dear [[name]],<br>"
                + "Please click the link below to create your new password:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">Create New Password</a></h3>"
                + "Thank you,<br>"
                + "The movie app.";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", userInfo.getFirstName() + " " +  userInfo.getLastName());

        siteURL = siteURL.substring(0,siteURL.length() - 19);
        siteURL += "createPassword";
        String verifyURL = siteURL + "?code=" + userInfo.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);
        mailSender.send(message);
    }



}
