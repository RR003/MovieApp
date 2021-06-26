package rahul.com.MovieWebApp.model;

import javax.persistence.*;

@Entity
@Table(name = "friend")
public class Friend {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;

    private String senderId;
    private String receiverId;
    public String isVerified;

    public Friend(){}
    public Friend(String senderId, String receiverId, String isVerified) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.isVerified = isVerified;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(String isVerified) {
        this.isVerified = isVerified;
    }

    @Override
    public String toString() {
        return "Friend{" +
                "id=" + id +
                ", senderId='" + senderId + '\'' +
                ", receiverId='" + receiverId + '\'' +
                ", isVerified='" + isVerified + '\'' +
                '}';
    }
}
