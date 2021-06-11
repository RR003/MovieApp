import React, { Component } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import "../Home.css";
import ParticleBackground from "./ParticleBackground";

class Home extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    username: "",
    data: {},
    movies: [],
    images: [],
    url: "",
  };

  async componentDidMount() {
    let url = "https://movieapp003.herokuapp.com";
    // if (process.env.NODE_ENV === "development") url = "http://localhost:8081";

    this.setState({ url: url });
    console.log(this.props.location.state);
    if (this.props.location.state !== undefined) {
      console.log(this.props.location.state.username);
      this.setState({ username: this.props.location.state.username });
      let res = await fetch(
        url + `/user/${this.props.location.state.username}`
      );
      let body = await res.json();
      this.setState({ data: body });
      if (this.state.data.firstName !== undefined) {
        let moviesTemp = [];
        let imagesTemp = [];
        console.log(this.state.data.watchList);
        for (var i = 0; i < this.state.data.watchList.length; i++) {
          let id = this.state.data.watchList[i];
          let response = await fetch(url + `/movie/get/${id}`);
          let response2 = await fetch(url + `/movie/getImage/${id}`);
          let data = await response.json();
          let data2 = await response2.json();
          moviesTemp.push(data);
          imagesTemp.push(data2.url);
        }
        // console.log(moviesTemp);
        console.log(imagesTemp);
        this.setState({ movies: moviesTemp });
        this.setState({ images: imagesTemp });
        console.log("MOVIES = " + this.state.movies);
      }
    } else {
      console.log("no log in");
    }
  }

  getMovie = (event) => {
    console.log(event);
    let index = event.target.value;
    console.log(index);
    let id = this.state.movies[index].id;
    // localStorage.setItem("dataForMovieInfo", this.state.data);
    axios.get(this.state.url + `/movie/get/${id}`).then((res) => {
      console.log(res.data);

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
    let id = this.state.movies[index].id;
    axios.get(this.state.url + `/movie/get/${id}`).then((res) => {
      console.log(res.data);

      this.props.history.push({
        pathname: "/movieInfo",
        state: {
          newState: res.data,
          data: this.state.data,
        },
      });
    });
  };

  deleteMovie = (event) => {
    let movieId = event.target.value;
    axios
      .delete(this.state.url + "/user/deleteWatchList", {
        data: {
          username: this.state.username,
          movieId: movieId,
        },
      })
      .then(window.location.reload(false));
  };

  render() {
    let i = -1;
    let signedIn = true;
    if (
      this.state.username === undefined ||
      this.state.username === null ||
      this.state.username === ""
    ) {
      signedIn = false;
    }

    return (
      <div>
        <div id="all">
          <div>
            <NavBar id={this.state.data}></NavBar>
          </div>

          <div>
            {!signedIn && (
              <center>
                <h1 id="info">Welcome to the Movie App</h1>
              </center>
            )}

            {signedIn && (
              <center>
                <div>
                  <center>
                    <h1>
                      Welcome {this.state.data.firstName}{" "}
                      {this.state.data.lastName}
                    </h1>
                    <h2>Your watch list</h2>
                  </center>

                  <div id="watchlist">
                    {this.state.movies.map((movie) => (
                      <div id="theWatchedMovie">
                        <center>
                          {this.state.images[i + 1] !== "-1" ? (
                            <input
                              type="image"
                              src={this.state.images[i + 1]}
                              id="image"
                              onClick={this.clickImage}
                              value={i + 1}
                            />
                          ) : (
                            <img
                              id="image"
                              src="https://www.radiationreport.com/wp-content/uploads/2013/08/no-preview.jpg"
                            ></img>
                          )}
                        </center>
                        <center>
                          <button
                            id="movieButton"
                            value={++i}
                            onClick={this.getMovie}
                          >
                            {movie.title}
                          </button>

                          <button
                            id="delete"
                            value={movie.id}
                            onClick={this.deleteMovie}
                          >
                            Delete
                          </button>
                        </center>

                        <br></br>
                      </div>
                    ))}
                  </div>
                </div>
              </center>
            )}
          </div>
        </div>
        <ParticleBackground id="particles" />
      </div>
    );
  }
}

export default Home;

/* <a onClick={this.getMovie} value={i + 1}>
                            <img
                              id="image"
                              src={this.state.images[i + 1]}
                            ></img>
                          </a>*/
