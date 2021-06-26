import React, { Component } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import "../Movies.css";
import ParticleBackground from "./ParticleBackground";
import Button from "@material-ui/core/Button";

class Movies extends Component {
  state = {
    movies: [],
    movie: "",
    data: "",
    images: [],
    tvImages: [],
    tvList: [],
    url: "",
    showMov: true,
    showTV: false,
  };

  componentWillMount() {
    let url = process.env.REACT_APP_URL;
    this.setState({ url: url });
    let list = JSON.parse(localStorage.getItem("list"));
    // console.log(this.state);
    this.setState({ movies: list });
    // console.log(this.state);
    this.setState({ movie: localStorage.getItem("title") });
    // console.log(this.state);
    this.setState({ data: JSON.parse(localStorage.getItem("data")) });
    this.setState({ images: JSON.parse(localStorage.getItem("images")) });
    this.setState({ tvList: JSON.parse(localStorage.getItem("tvList")) });
    this.setState({ tvImages: JSON.parse(localStorage.getItem("tvImages")) });
  }

  componentDidMount() {
    if (this.state.tvList.length > this.state.movies.length) {
      this.setState({ showMov: false });
      this.setState({ showTV: true });
      document.getElementById("tvButton").style.background = "#346566";
    } else {
      document.getElementById("themovieButton").style.background = "#346566";
    }
  }

  getMovie = (e) => {
    let index = e.currentTarget.value;

    localStorage.setItem("dataForMovieInfo", this.state.data);
    axios
      .get(this.state.url + `/movie/${this.state.movie}/${index}`)
      .then((res) => {
        console.log(res.data);
        // console.log(this.state.username)
        this.props.history.push({
          pathname: "/movieInfo",
          state: {
            newState: res.data,
            data: this.state.data,
          },
        });
      });
  };

  clickImage = (event) => {
    let index = event.target.value;
    localStorage.setItem("dataForMovieInfo", this.state.data);
    axios
      .get(this.state.url + `/movie/${this.state.movie}/${index}`)
      .then((res) => {
        console.log(res.data);
        // console.log(this.state.username)
        this.props.history.push({
          pathname: "/movieInfo",
          state: {
            newState: res.data,
            data: this.state.data,
          },
        });
      });
  };

  clickTvImage = (event) => {
    let index = event.target.value;
    localStorage.setItem("dataForMovieInfo", this.state.data);
    axios
      .get(this.state.url + `/tv/${this.state.movie}/${index}`)
      .then((res) => {
        console.log(res.data);
        // console.log(this.state.username)
        this.props.history.push({
          pathname: "/TvInfo",
          state: {
            newState: res.data,
            data: this.state.data,
          },
        });
      });
  };

  getTv = (e) => {
    let index = e.currentTarget.value;

    localStorage.setItem("dataForMovieInfo", this.state.data);
    axios
      .get(this.state.url + `/movie/${this.state.movie}/${index}`)
      .then((res) => {
        console.log(res.data);
        // console.log(this.state.username)
        this.props.history.push({
          pathname: "/TvInfo",
          state: {
            newState: res.data,
            data: this.state.data,
          },
        });
      });
  };

  changeToTV = () => {
    this.setState({ showMov: false });
    this.setState({ showTV: true });
    document.getElementById("tvButton").style.background = "#346566";
    document.getElementById("themovieButton").style.background = "";
  };
  changeToMovies = () => {
    this.setState({ showTV: false });
    this.setState({ showMov: true });
    document.getElementById("themovieButton").style.background = "#346566";
    document.getElementById("tvButton").style.background = "";
  };

  render() {
    let i = -1;
    let j = -1;
    let showMovies = true;
    if (this.state.movies.length === 0 && this.state.tvList.length === 0) {
      showMovies = false;
    }

    return (
      <div>
        <div id="all">
          {console.log(this.state)}
          <NavBar id={this.state.data}></NavBar>
          {!showMovies && (
            <div>
              <h1>No search results...</h1>
              <h3>Make sure your spelling is accurate</h3>
            </div>
          )}
          <br></br>
          <center>
            <Button id="themovieButton" onClick={this.changeToMovies}>
              Movies
            </Button>
            <Button id="tvButton" onClick={this.changeToTV}>
              TV Shows
            </Button>
          </center>

          {showMovies && this.state.showMov && (
            <div>
              <h3>
                {this.state.movies.length} Movie Search Results for "
                {this.state.movie}"
              </h3>
              {this.state.movies.map((movie) => (
                <div id="theMovies">
                  <div>
                    <center>
                      {this.state.images[i + 1] !== "-1" ? (
                        <input
                          type="image"
                          src={this.state.images[i + 1]}
                          onClick={this.clickImage}
                          value={i + 1}
                          id="image"
                        />
                      ) : (
                        <input
                          type="image"
                          id="image"
                          src={this.state.images[i + 1]}
                          onClick={this.clickImage}
                          value={i + 1}
                          src="https://www.radiationreport.com/wp-content/uploads/2013/08/no-preview.jpg"
                        ></input>
                      )}
                    </center>

                    <br></br>
                    <center>
                      <Button
                        id="movieTitle"
                        value={++i}
                        onClick={this.getMovie}
                        color="primary"
                        variant="contained"
                      >
                        {movie.length <= 50 && movie}
                        {movie.length > 50 && movie.substring(0, 50) + "..."}
                      </Button>
                    </center>
                    <br></br>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showMovies && this.state.showTV && (
            <div>
              <h3>{this.state.tvList.length} TV Show Search Results</h3>
              {this.state.tvList.map((tv) => (
                <div id="theMovies">
                  <div>
                    <center>
                      {this.state.tvImages[j + 1] !== "-1" ? (
                        <input
                          type="image"
                          src={this.state.tvImages[j + 1]}
                          onClick={this.clickTvImage}
                          value={j + 1}
                          id="image"
                        />
                      ) : (
                        <input
                          type="image"
                          id="image"
                          onClick={this.clickTvImage}
                          value={j + 1}
                          src="https://www.radiationreport.com/wp-content/uploads/2013/08/no-preview.jpg"
                        ></input>
                      )}
                    </center>

                    <br></br>
                    <center>
                      <Button
                        id="movieTitle"
                        value={++j}
                        onClick={this.getTv}
                        color="primary"
                        variant="contained"
                      >
                        {tv.length <= 50 && tv}
                        {tv.length > 50 && tv.substring(0, 50) + "..."}
                      </Button>
                    </center>
                    <br></br>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <ParticleBackground />
      </div>
    );
  }
}

export default Movies;

// <NavBar id={this.state.data}></NavBar>
