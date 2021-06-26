import React, { Component } from "react";
import NavBar from "./NavBar";
import ParticleBackground from "./ParticleBackground";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Carousel from "react-elastic-carousel";
import "../Friends.css";
import axios from "axios";
import Footer from "./Footer";

class Friends extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    searchFriend: "",
    url: "",
    message: "",
    username: this.props.location.state.username,
    friends: [],
    friendRequest: [],
    movieIds: [],
    movieTitles: [],
    movieImages: [],
    tvIds: [],
    tvTitles: [],
    tvImages: [],
    showFriends: false,
  };

  breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 650, itemsToShow: 2, itemsToScroll: 2 },
    { width: 1000, itemsToShow: 3, itemsToScroll: 3 },
    { width: 1300, itemsToShow: 4, itemsToScroll: 4 },
  ];

  async componentDidMount() {
    let url = process.env.REACT_APP_URL;
    this.setState({ url: url });
    let show = false;
    let settings = {
      method: "GET",
      headers: {
        token: sessionStorage.getItem("token"),
      },
    };

    let response = await fetch(url + "/user/test", settings);
    let authData = await response.json();
    if (authData.url === "valid") {
      this.setState({ showFriends: true });
      show = true;
    }

    // let auth = await fetch(url + "/user/test");
    // let authBody = await auth.json();
    if (show) {
      let response = await fetch(
        url + `/user/getFriends/${this.state.username}`
      );
      let body = await response.json();
      // console.log(body);
      this.setState({ friends: body });
      let response2 = await fetch(
        url + `/user/getFriendRequests/${this.state.username}`
      );
      let body2 = await response2.json();
      this.setState({ friendRequest: body2 });
      let response3 = await fetch(
        url + `/user/getFriendMovies/${this.state.username}`
      );
      let body3 = await response3.json();
      this.setState({ movieIds: body3[0] });
      this.setState({ movieTitles: body3[1] });
      this.setState({ movieImages: body3[2] });
      this.setState({ tvIds: body3[3] });
      this.setState({ tvTitles: body3[4] });
      this.setState({ tvImages: body3[5] });
    }
  }

  changeFriendName = (event) => {
    this.setState({ searchFriend: event.target.value });
  };

  submitFriendRequest = () => {
    if (this.state.searchFriend !== "") {
      axios
        .post(this.state.url + "/user/friendRequest", {
          senderId: this.state.username,
          receiverId: this.state.searchFriend,
          isVerified: "no",
        })
        .then((res) => {
          console.log(res.data.url);
          this.setState({ message: res.data.url });
        });
    }
  };

  acceptedFriendRequest = (e) => {
    let index = e.currentTarget.value;
    let username = this.state.friendRequest[index];
    axios
      .post(this.state.url + "/user/acceptFriendRequest", {
        senderId: username,
        receiverId: this.state.username,
        isVerified: "yes",
      })
      .then(window.location.reload());
  };

  deleteFriendRequest = (e) => {
    let index = e.currentTarget.value;
    let username = this.state.friendRequest[index];
    console.log(username);
    axios
      .delete(this.state.url + "/user/deleteFriendRequest", {
        data: {
          senderId: username,
          receiverId: this.state.username,
          isVerified: "no",
        },
      })
      .then(window.location.reload());
  };

  clickImage = (e) => {
    let index = e.currentTarget.value;
    console.log(index);
    let id = this.state.movieIds[index];
    console.log(id);
    axios.get(this.state.url + `/movie/get/${id}`).then((res) => {
      this.props.history.push({
        pathname: "/movieInfo",
        state: {
          newState: res.data,
          data: this.props.location.state,
        },
      });
    });
  };

  clickTvImage = (e) => {
    let index = e.currentTarget.value;
    console.log(index);
    let id = this.state.tvIds[index];
    console.log(id);
    axios.get(this.state.url + `/tv/get/${id}`).then((res) => {
      this.props.history.push({
        pathname: "/tvInfo",
        state: {
          newState: res.data,
          data: this.props.location.state,
        },
      });
    });
  };

  getMovie = (e) => {
    let index = e.currentTarget.value;
    console.log(index);
    let id = this.state.movieIds[index];
    console.log(id);
    axios.get(this.state.url + `/movie/get/${id}`).then((res) => {
      this.props.history.push({
        pathname: "/movieInfo",
        state: {
          newState: res.data,
          data: this.props.location.state,
        },
      });
    });
  };

  getTv = (e) => {
    let index = e.currentTarget.value;
    console.log(index);
    let id = this.state.tvIds[index];
    console.log(id);
    axios.get(this.state.url + `/tv/get/${id}`).then((res) => {
      this.props.history.push({
        pathname: "/tvInfo",
        state: {
          newState: res.data,
          data: this.props.location.state,
        },
      });
    });
  };

  render() {
    let i = 0;
    let j = 0;
    let k = 0;
    let l = 0;
    return (
      <div>
        {!this.state.showFriends && (
          <div>
            <h2>Invalid Resource!</h2>
          </div>
        )}
        {this.state.showFriends && (
          <div>
            <div>
              <NavBar id={this.props.location.state} />
              <div id="friendRequest">
                <center>
                  <TextField
                    variant="outlined"
                    required
                    id="searchFriend"
                    label="Enter Friend Username"
                    onChange={this.changeFriendName}
                  />
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={this.submitFriendRequest}
                  >
                    Create Friend Request
                  </Button>
                  <p>{this.state.message}</p>
                </center>
              </div>
              <div id="friendsList">
                {this.state.friends.length > 0 && (
                  <div>
                    <h3>Your Friends</h3>
                    {this.state.friends.map((friend) => (
                      <p>{friend}</p>
                    ))}
                  </div>
                )}
                {this.state.friends.length == 0 && (
                  <div>
                    <p>Consider adding some friends</p>
                  </div>
                )}
              </div>

              <div id="friendsRequest">
                {this.state.friendRequest.length > 0 && (
                  <div>
                    <h3>Friend Requests</h3>

                    <table id="friendreqTable">
                      <thead>
                        <tr id="header">
                          <th>Friend Username</th>
                          <th>Accept</th>
                          <th>Decline</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.friendRequest.map((friendRequest) => (
                          <tr id="movieWatched">
                            <td>{friendRequest}</td>
                            <td>
                              <Button
                                color="primary"
                                value={j}
                                onClick={this.acceptedFriendRequest}
                              >
                                Accept
                              </Button>
                            </td>
                            <td>
                              <Button
                                color="secondary"
                                value={j++}
                                onClick={this.deleteFriendRequest}
                              >
                                Decline
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div id="friend-movie-table">
              <div>
                <h3>What your friends are watching</h3>
                {this.state.movieImages.length > 0 && (
                  <div>
                    <h4>Movies</h4>

                    <Carousel breakPoints={this.breakPoints}>
                      {this.state.movieImages.map((image) => (
                        <div>
                          <div>
                            {image !== "-1" ? (
                              <input
                                type="image"
                                src={image}
                                id="image"
                                onClick={this.clickImage}
                                value={k}
                              ></input>
                            ) : (
                              <img
                                id="image"
                                src="https://www.radiationreport.com/wp-content/uploads/2013/08/no-preview.jpg"
                                value={k}
                              ></img>
                            )}
                          </div>
                          <Button
                            id="movieButton"
                            color="primary"
                            variant="contained"
                            value={k}
                            onClick={this.getMovie}
                          >
                            {this.state.movieTitles[k].length <= 35 &&
                              this.state.movieTitles[k]}
                            {this.state.movieTitles[k].length > 35 &&
                              this.state.movieTitles[k].substring(0, 35) +
                                "..."}
                          </Button>
                          {console.log(k++)}
                        </div>
                      ))}
                    </Carousel>
                  </div>
                )}

                {this.state.tvImages.length > 0 && (
                  <div>
                    <h4>TV Shows</h4>
                    <Carousel breakPoints={this.breakPoints}>
                      {this.state.tvImages.map((image) => (
                        <div>
                          <div>
                            {image !== "-1" ? (
                              <input
                                type="image"
                                src={image}
                                id="image"
                                onClick={this.clickTvImage}
                                value={l}
                              ></input>
                            ) : (
                              <img
                                id="image"
                                src="https://www.radiationreport.com/wp-content/uploads/2013/08/no-preview.jpg"
                                value={l}
                              ></img>
                            )}
                          </div>
                          <Button
                            id="movieButton"
                            color="primary"
                            variant="contained"
                            value={k}
                            onClick={this.getTv}
                          >
                            {this.state.tvTitles[l].length <= 35 &&
                              this.state.tvTitles[l]}
                            {this.state.tvTitles[l].length > 35 &&
                              this.state.tvTitles[l].substring(0, 35) + "..."}
                          </Button>
                          {console.log(l++)}
                        </div>
                      ))}
                    </Carousel>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <ParticleBackground />
        <Footer />
      </div>
    );
  }
}

export default Friends;
