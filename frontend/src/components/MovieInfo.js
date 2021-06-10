import React, { Component } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import "../MovieInfo.css";
import ParticleBackground from "./ParticleBackground";

class MovieInfo extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    id: this.props.location.state.newState.id,
    movie: this.props.location.state.newState.title,
    overview: this.props.location.state.newState.overview,
    data: this.props.location.state.data,
    dateReleased: this.props.location.state.newState.releaseDate,
    rating: this.props.location.state.newState.rating,
    show: true,
    ourRating: "",
    commentsAndRatings: "",
    message2: "",
    url: "",
  };

  async componentDidMount() {
    let url = "https://movieapp003.herokuapp.com";
    // if (process.env.NODE_ENV === "development") url = "http://localhost:8081";

    this.setState({ url: url });
    let ratings = await fetch(url + `/movie/rating/${this.state.id}`);
    ratings = await ratings.json();
    if (ratings === -1) {
      ratings = "no ratings yet";
    }
    this.setState({ ourRating: ratings });
    let commentsAndRatings = await fetch(
      url + `/movie/comment&rating/${this.state.id}`
    );
    commentsAndRatings = await commentsAndRatings.json();
    console.log(commentsAndRatings);
    this.setState({ commentsAndRatings: commentsAndRatings });
    if (this.state.data !== {} && this.state.data !== undefined) {
      // console.log(this.state.data);
      if (
        this.state.data.username === undefined ||
        this.state.data.username === null
      ) {
        document.getElementById("signedIn").style.visibility = "hidden";
      } else {
        console.log(this.state.data.watchedList);
        let isThere = false;
        for (let i = 0; i < this.state.data.watchedList.length; i++) {
          if (this.state.data.watchedList[i].movieId === this.state.id) {
            document.getElementById("watch").style.visibility = "hidden";
            document.getElementById("watched").style.visibility = "hidden";
            console.log("1");
            isThere = true;
            break;
          }
        }
        if (isThere) {
          document.getElementById("alreadyWatched").style.visibility =
            "visible";
        }

        for (let i = 0; i < this.state.data.watchList.length; i++) {
          if (this.state.data.watchList[i] === this.state.id) {
            document.getElementById("watch").style.visibility = "hidden";
            console.log("2");
            break;
          }
        }
      }
    }
  }

  addToWatchList = () => {
    // console.log(this.state.data.watchist);
    if (this.state.data.username === undefined) {
      console.log("please log in");
    } else {
      let list = this.state.data.watchList;
      let isThere = false;
      for (let i = 0; i < list.length; i++) {
        if (list[i] === this.state.id) {
          isThere = true;
          break;
        }
      }
      if (isThere) {
        this.setState({ show: true });
      } else {
        axios
          .post(this.state.url + "/user/addWatchList", {
            username: this.state.data.username,
            movieId: this.state.id,
          })
          .then(
            this.props.history.push({
              pathname: "/",
              state: this.state.data,
            })
          );
      }
    }
  };

  addToWatchedList = () => {
    console.log(this.state.url);
    let list = this.state.data.watchList;
    for (let i = 0; i < list.length; i++) {
      if (this.state.id === list[i]) {
        axios.delete(this.state.url + "/user/deleteWatchList", {
          data: {
            username: this.state.data.username,
            movieId: this.state.id,
          },
        });
      }
    }
    axios.post(this.state.url + "/user/addWatchedList", {
      username: this.state.data.username,
      movieId: this.state.id,
      dateCreated: new Date(),
      rating: -1,
      comment: "",
    });
    // .then(window.location.reload(false));
    /*.then(
        this.props.history.push({
          pathname: "/watchedList",
          state: this.state.data,
        })
      );*/
  };

  render() {
    return (
      <div>
        <div>
          <NavBar id={this.state.data}></NavBar>
          <div id="everything">
            <h1>Movie Information for {this.state.movie}</h1>
            <h2 id="alreadyWatched">You already watched this</h2>
            <div id="signedIn">
              <div id="watch">
                <button id="addWatchList" onClick={this.addToWatchList}>
                  Add to Watch List
                </button>
              </div>
              <br></br>
              <div>
                <button id="watched" onClick={this.addToWatchedList}>
                  I watched this movie
                </button>
                <h3></h3>
              </div>
            </div>
            <div id="information">
              <h1 id="date">Date Released : {this.state.dateReleased}</h1>

              <h1 id="overview">Overview : {this.state.overview}</h1>
              <h1 id="ratingOfMovie">
                {" "}
                General Rating : {this.state.rating}/10
              </h1>
              {this.state.ourRating === "no ratings yet" ? (
                <h1>this movie has not been user-rated yet</h1>
              ) : (
                <h1>Our Rating : {this.state.ourRating}/5</h1>
              )}
            </div>
            <br></br>
            <div>
              <center>
                <div>
                  {this.state.commentsAndRatings.length === 0 ? (
                    <h2>There have been no ratings</h2>
                  ) : (
                    <table id="movieTable">
                      <thead>
                        <tr id="header">
                          <th>Rating</th>
                          <th>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.commentsAndRatings.map((comment) => (
                          <tr id="movieWatched" key={comment}>
                            <td>{comment[1]} / 5</td>

                            <td>{comment[0]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </center>
              {console.log(this.state.commentsAndRatings)}
            </div>
          </div>
        </div>

        <ParticleBackground />
      </div>
    );
  }
}

export default MovieInfo;
