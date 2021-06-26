import React, { Component } from "react";
import NavBar from "./NavBar";
import "../Rating.css";
import axios from "axios";
class Ratings extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    rating: null,
    comment: "",
  };
  handleSubmit = () => {
    console.log("Rating = " + this.state.rating);
    let url = process.env.REACT_APP_URL;
    setTimeout(
      axios.put(url + "/user/updateWatchedList", {
        username: this.props.state.username,
        movieId: this.props.pass.movieId,
        rating: this.state.rating,
        comment: this.state.comment,
      }),
      1000
    );
    window.location.reload(false);
  };

  setRating = (event) => {
    this.setState({ rating: event.target.value });
  };

  setComment = (event) => {
    this.setState({ comment: event.target.value });
  };

  render() {
    return (
      <div id="totalForm">
        <form>
          <h2>{this.props.pass.movieTitle}</h2>
          <label>Rating (0-5) : </label>
          <select id="selector" onChange={this.setRating}>
            <option value="none" selected disabled hidden>
              Select
            </option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <input
            id="comment"
            placeholder="Comments?"
            onChange={this.setComment}
          ></input>
        </form>
        <button id="ratingButton" onClick={this.handleSubmit}>
          Submit Rating
        </button>
      </div>
    );
  }
}

export default Ratings;
