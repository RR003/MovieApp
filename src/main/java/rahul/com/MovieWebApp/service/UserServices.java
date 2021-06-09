package rahul.com.MovieWebApp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import rahul.com.MovieWebApp.dao.UserRepository;
import rahul.com.MovieWebApp.model.User;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Optional;

@Service
public class UserServices {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(User user, String siteURL) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
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

        content = content.replace("[[name]]", user.getFirstName() + " " +  user.getLastName());
        siteURL = siteURL.substring(0,siteURL.length() - 11);
        siteURL += "verify";
        String verifyURL = siteURL + "?code=" + user.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);
    }

    public boolean verify(String verificationCode) {
        User user = userRepository.findByVerificationCode(verificationCode);
        if (user == null || user.getVerified().equals("yes")) {
            return false;
        } else {
            user.setVerificationCode(null);
            user.setVerified("yes");
            userRepository.save(user);
            return true;
        }
    }

    public boolean verifyPassword(String code) {
        User user = userRepository.findByVerificationCode(code);
        return user != null;
    }

    public void sendNewPasswordEmail(User user, String siteURL) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
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

        content = content.replace("[[name]]", user.getFirstName() + " " +  user.getLastName());

        siteURL = siteURL.substring(0,siteURL.length() - 19);
        siteURL += "createPassword";
        String verifyURL = siteURL + "?code=" + user.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);
        mailSender.send(message);
    }



}
