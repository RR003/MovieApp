import React, { Component, useEffect } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import "../Home.css";
import ParticleBackground from "./ParticleBackground";
import Button from "@material-ui/core/Button";
import Recomendation from "./Recomendation";
import Footer from "./Footer";

class Home extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    username: "",
    data: {},
    movies: [],
    images: [],
    tv: [],
    tvImages: [],
    url: "",
    watchlist: true,
    recommend: false,
    onMovies: true,
    onTV: false,
  };

  recommendations = {
    generalRecommendations: {},
    geImages: {},
    geTitles: {},
    popularIds: {},
    popularTitles: {},
    popularImages: {},
    tvIds: {},
    tvImages: {},
    tvTitles: {},
  };

  changeToMovie = () => {
    this.setState({ onMovies: true });
    this.setState({ onTV: false });
    document.getElementById("showingMovies").style.background = "coral";
    document.getElementById("showingTv").style.background = "";
  };

  changeToTv = () => {
    this.setState({ onMovies: false });
    this.setState({ onTV: true });
    document.getElementById("showingTv").style.background = "coral";
    document.getElementById("showingMovies").style.background = "";
  };

  async componentWillMount() {
    let url = process.env.REACT_APP_URL;
    this.setState({ url: url });
    console.log(this.props.location.state);
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
    if (show) {
      try {
        if (this.props.location.state.username === undefined) {
          this.props.location.state = undefined;
        }
      } catch (e) {
        console.log("whoops");
      }
      if (this.props.location.state !== undefined) {
        console.log(this.props.location.state.username);
        this.setState({ username: this.props.location.state.username });
        let res = await fetch(
          url + `/user/${this.props.location.state.username}`
        );
        let body = await res.json();
        console.log(body);
        this.setState({ data: body });
        if (this.state.data.firstName !== undefined) {
          let moviesTemp = [];
          let imagesTemp = [];
          let tvTemp = [];
          let tvImages = [];
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
          // console.log("no problems");
          for (let j = 0; j < this.state.data.tvWatchList.length; j++) {
            let id = this.state.data.tvWatchList[j];
            console.log(id);
            let response = await fetch(url + `/tv/get/${id}`);
            let response2 = await fetch(url + `/tv/getImage/${id}`);
            let data = await response.json();
            let data2 = await response2.json();
            tvTemp.push(data);
            tvImages.push(data2.url);
          }
          // console.log(moviesTemp);
          console.log(imagesTemp);
          this.setState({ movies: moviesTemp });
          this.setState({ images: imagesTemp });
          this.setState({ tv: tvTemp });
          this.setState({ tvImages: tvImages });
          console.log("MOVIES = " + this.state.movies);
        }
      } else {
        console.log("no log in");
        console.log("oh yea");
      }
    }
  }

  getMovie = (e) => {
    // console.log(e);
    let index = e.currentTarget.value;
    // console.log(index);
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

  getTv = (e) => {
    let index = e.currentTarget.value;
    // console.log(index);
    let id = this.state.tv[index].id;
    // localStorage.setItem("dataForMovieInfo", this.state.data);
    axios.get(this.state.url + `/tv/get/${id}`).then((res) => {
      console.log(res.data);

      this.props.history.push({
        pathname: "/TvInfo",
        state: {
          newState: res.data,
          data: this.state.data,
        },
      });
    });
  };

  clickImage = (e) => {
    let index = e.currentTarget.value;
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

  clickTvImage = (e) => {
    let index = e.currentTarget.value;
    let id = this.state.tv[index].id;
    axios.get(this.state.url + `/tv/get/${id}`).then((res) => {
      console.log(res.data);

      this.props.history.push({
        pathname: "/TvInfo",
        state: {
          newState: res.data,
          data: this.state.data,
        },
      });
    });
  };

  deleteMovie = (e) => {
    let movieId = e.currentTarget.value;
    console.log("movieidp = " + movieId);
    axios
      .delete(this.state.url + "/user/deleteWatchList", {
        data: {
          username: this.state.username,
          movieId: movieId,
          isMovie: "yes",
        },
      })
      .then(this.refreshPage);
  };

  deleteTv = (e) => {
    let movieId = e.currentTarget.value;
    // console.log("movieidp = " + movieId);
    axios
      .delete(this.state.url + "/user/deleteWatchList", {
        data: {
          username: this.state.username,
          movieId: movieId,
          isMovie: "no",
        },
      })
      .then(this.refreshPage);
  };

  refreshPage = () => {
    window.location.reload();
  };

  changeToRecommend = () => {
    this.setState({ watchlist: false });
    this.setState({ recommend: true });
    document.getElementById("recommendButton").style.background = "#346566";
    document.getElementById("watchlistButton").style.background = "";
  };

  changeToWatchlist = () => {
    this.setState({ recommend: false });
    this.setState({ watchlist: true });
    document.getElementById("watchlistButton").style.background = "#346566";
    document.getElementById("recommendButton").style.background = "";
  };

  async componentDidMount() {
    let res3 = await fetch(
      this.state.url + `/tv/recommendations/${this.state.username}`
    );
    let data3 = await res3.json();
    console.log("data 3 = " + data3);
    this.recommendations.tvIds = data3[0];
    this.recommendations.tvTitles = data3[1];
    this.recommendations.tvImages = data3[2];

    let res = await fetch(
      this.state.url + `/movie/recommendations/${this.state.username}`
    );
    let data = await res.json();
    console.log(data);
    this.recommendations.generalRecommendations = data[0];
    this.recommendations.geTitles = data[1];
    this.recommendations.geImages = data[2];

    let res2 = await fetch(this.state.url + "/movie/popularMovies");
    let data2 = await res2.json();
    console.log(data2);
    this.recommendations.popularIds = data2[0];
    this.recommendations.popularTitles = data2[1];
    this.recommendations.popularImages = data2[2];

    try {
      document.getElementById("watchlistButton").style.background = "#346566";
      document.getElementById("showingMovies").style.background = "coral";
    } catch (e) {
      console.log(e);
    }
  }

  signUp = () => {
    this.props.history.push({
      pathname: "/signUp",
    });
  };

  render() {
    let i = -1;
    let j = -1;
    let signedIn = true;
    if (
      this.state.username === undefined ||
      this.state.username === null ||
      this.state.username === ""
    ) {
      signedIn = false;
    }

    return (
      <div id="ALLITEMS">
        <div>
          {this.setColor}
          <div id="all">
            <div>
              <NavBar id={this.state.data}></NavBar>
            </div>

            <div>
              {!signedIn && (
                <center>
                  <h1 id="info">Welcome to SHOWBINGE</h1>
                  <div id="blurb">
                    <h3>Never know what to binge?</h3>
                    <p>
                      Keep track of movies and shows you want to watch with the
                      help of Showbinge. Not only that, but also get customed
                      recomendations and connect with your friends. Just one
                      click away to create your Showbinge account and get
                      started to binge away!
                    </p>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={this.signUp}
                    >
                      Create An Account
                    </Button>
                  </div>
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
                      <Button
                        id="watchlistButton"
                        onClick={this.changeToWatchlist}
                      >
                        Watch List
                      </Button>

                      <Button
                        id="recommendButton"
                        onClick={this.changeToRecommend}
                      >
                        See Recomendations
                      </Button>
                    </center>

                    {this.state.watchlist && (
                      <div>
                        <div id="watchlist">
                          <Button
                            id="showingMovies"
                            onClick={this.changeToMovie}
                          >
                            Movies
                          </Button>
                          <Button id="showingTv" onClick={this.changeToTv}>
                            TV Shows
                          </Button>
                          <br></br>
                          <br></br>
                          {this.state.onMovies &&
                            this.state.movies.map((movie) => (
                              <div id="theWatchedMovie">
                                {this.state.onMovies &&
                                this.state.images[i + 1] !== "-1" ? (
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

                                <center>
                                  <Button
                                    id="movieButton"
                                    color="primary"
                                    variant="contained"
                                    value={++i}
                                    onClick={this.getMovie}
                                  >
                                    {movie.title.length <= 35 && movie.title}
                                    {movie.title.length > 35 &&
                                      movie.title.substring(0, 35) + "..."}
                                  </Button>

                                  <Button
                                    id="delete"
                                    value={movie.id}
                                    onClick={this.deleteMovie}
                                    color="primary"
                                    variant="contained"
                                  >
                                    Remove
                                  </Button>
                                </center>

                                <br></br>
                              </div>
                            ))}

                          {this.state.onTV &&
                            this.state.tv.map((t) => (
                              <div id="theWatchedMovie">
                                {console.log(j)}
                                {this.state.tvImages[j + 1] !== "-1" ? (
                                  <input
                                    type="image"
                                    src={this.state.tvImages[j + 1]}
                                    id="image"
                                    onClick={this.clickTvImage}
                                    value={j + 1}
                                  />
                                ) : (
                                  <img
                                    id="image"
                                    src="https://www.radiationreport.com/wp-content/uploads/2013/08/no-preview.jpg"
                                  ></img>
                                )}

                                <center>
                                  <Button
                                    id="movieButton"
                                    color="primary"
                                    variant="contained"
                                    value={++j}
                                    onClick={this.getTv}
                                  >
                                    {t.title.length <= 35 && t.title}
                                    {t.title.length > 35 &&
                                      t.title.substring(0, 35) + "..."}
                                  </Button>

                                  <Button
                                    id="delete"
                                    value={t.id}
                                    onClick={this.deleteTv}
                                    color="primary"
                                    variant="contained"
                                  >
                                    Delete
                                  </Button>
                                </center>

                                <br></br>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {this.state.recommend && (
                      <div>
                        <Recomendation
                          recommendations={this.recommendations}
                          url={this.state.url}
                          userData={this.state.data}
                          history={this.props.history}
                        />
                      </div>
                    )}
                  </div>
                </center>
              )}
            </div>
            <Footer id="footer2" data={this.state.data} />
          </div>

          <ParticleBackground id="particles" />
        </div>
      </div>
    );
  }
}

export default Home;
