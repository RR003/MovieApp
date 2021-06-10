import React, { Component } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import "../Movies.css";
import ParticleBackground from "./ParticleBackground";

class Movies extends Component {
  state = {
    movies: [],
    movie: "",
    data: "",
    images: [],
    url: "",
  };

  componentDidMount() {
    let url = "";
    if (process.env.NODE_ENV === "development") url = "http://localhost:8081";
    else url = "https://movieapp003.herokuapp.com";
    this.setState({ url: url });
    let list = JSON.parse(localStorage.getItem("list"));
    // console.log(this.state);
    this.setState({ movies: list });
    // console.log(this.state);
    this.setState({ movie: localStorage.getItem("title") });
    // console.log(this.state);
    this.setState({ data: JSON.parse(localStorage.getItem("data")) });
    this.setState({ images: JSON.parse(localStorage.getItem("images")) });
    console.log(this.state);
  }

  getMovie = (event) => {
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

  render() {
    let i = -1;
    let showMovies = true;
    if (this.state.movies.length === 0) {
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
          {showMovies && (
            <div>
              <h2>
                {this.state.movies.length} Search Results for "
                {this.state.movie}""
              </h2>
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
                      <button
                        id="movieTitle"
                        value={++i}
                        onClick={this.getMovie}
                      >
                        {movie}
                      </button>
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
