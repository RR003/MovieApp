import React, { Component } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import "../WatchedList.css";
import Ratings from "./Ratings";
import ParticleBackground from "./ParticleBackground";

class WatchedList extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    movieTitles: [],
    dateInfo: [],
    ratings: [],
    ids: [],
    showRating: false,
    movieId: null,
    movieTitle: null,
  };

  clickedGiveRating = (event) => {
    let index = event.target.value;
    let movieId = this.state.ids[index];
    console.log(this.state.ratings[index]);
    this.setState({ showRating: true });
    this.setState({ movieId: movieId });
    this.setState({ movieTitle: this.state.movieTitles[index] });
  };

  async componentDidMount() {
    console.log(this.props.location.state);
    try {
      if (
        this.props.location.state.username === undefined ||
        this.props.location.state.username === null
      ) {
        console.log("there is nothing here");
        document.getElementById("signedIn").style.visibility = "hidden";
      } else {
        let dates = [];
        let movieTitles = [];
        let rating = [];
        let ids = [];
        let rest = await fetch(`user/${this.props.location.state.username}`);
        let response = await rest.json();
        console.log(response);
        let movies = response.watchedList;
        console.log("MOVIES = " + movies);
        for (let i = 0; i < movies.length; i++) {
          let movie = movies[i];
          let res = await fetch(`/movie/get/${movie.movieId}`);
          let body = await res.json();
          movieTitles.push(body.title);
          ids.push(body.id);
          dates.push(movie.dateCreated);
          if (movie.rating === -1) {
            rating.push(
              <button
                id="giveRating"
                value={i}
                onClick={this.clickedGiveRating}
              >
                Give Rating
              </button>
            );
          } else {
            rating.push(movie.rating);
          }
        }
        this.setState({ movieTitles: movieTitles });
        this.setState({ dateInfo: dates });
        this.setState({ ids: ids });
        console.log(rating);
        this.setState({ ratings: rating });
        document.getElementById("signedOut").style.visibility = "hidden";
      }
    } catch (err) {
      console.log("there is an error");
      document.getElementById("signedIn").style.visibility = "hidden";
    }
  }

  render() {
    let i = 0;

    return (
      <div>
        <div id="all">
          <NavBar id={this.props.location.state}></NavBar>
          <div id="signedOut">
            <h1>You are not signed in to view your watched list</h1>
          </div>
          <div id="signedIn">
            <center id="center">
              <div id="left">
                <h1>Watched List</h1>
                <div id="Total">
                  <table id="movieTable">
                    <thead>
                      <tr id="header">
                        <th>Movie Title</th>
                        <th>Date Watched</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.dateInfo.map((date) => (
                        <tr id="movieWatched" key={date}>
                          <td>{this.state.movieTitles[i]}</td>

                          <td>{date.substring(0, 10)}</td>
                          {Number.isInteger(this.state.ratings[i]) ? (
                            <td>{this.state.ratings[i++]} / 5</td>
                          ) : (
                            <td>{this.state.ratings[i++]}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div>
                    {this.state.showRating && (
                      <Ratings
                        pass={this.state}
                        state={this.props.location.state}
                        id="RatingsComp"
                      ></Ratings>
                    )}
                  </div>
                </div>
              </div>
            </center>
          </div>
        </div>
        <ParticleBackground />
      </div>
    );
  }
}

export default WatchedList;
