import React, { Component } from "react";
import axios from "axios";
import Carousel from "react-elastic-carousel";
import Button from "@material-ui/core/Button";

class Recomendation extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    generalRecommendations: this.props.recommendations.generalRecommendations,
    geImages: this.props.recommendations.geImages,
    geTitles: this.props.recommendations.geTitles,
    popularIds: this.props.recommendations.popularIds,
    popularImages: this.props.recommendations.popularImages,
    popularTitles: this.props.recommendations.popularTitles,
    tvIds: this.props.recommendations.tvIds,
    tvImages: this.props.recommendations.tvImages,
    tvTitles: this.props.recommendations.tvTitles,
  };

  breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 650, itemsToShow: 2, itemsToScroll: 2 },
    { width: 1000, itemsToShow: 3, itemsToScroll: 3 },
    { width: 1300, itemsToShow: 4, itemsToScroll: 4 },
  ];

  clickImage = (e) => {
    let index = e.currentTarget.value;
    let id = this.state.generalRecommendations[index];
    console.log(id);
    axios.get(this.props.url + `/movie/get/${id}`).then((res) => {
      console.log(res.data);
      console.log(this.props.history);
      this.props.history.push({
        pathname: "/movieInfo",
        state: {
          newState: res.data,
          data: this.props.userData,
        },
      });
    });
  };

  getMovie = (e) => {
    // console.log(e);
    let index = e.currentTarget.value;
    // console.log(index);
    let id = this.state.generalRecommendations[index];
    // localStorage.setItem("dataForMovieInfo", this.state.data);
    axios.get(this.props.url + `/movie/get/${id}`).then((res) => {
      console.log(res.data);

      this.props.history.push({
        pathname: "/movieInfo",
        state: {
          newState: res.data,
          data: this.props.userData,
        },
      });
    });
  };

  clickPopImage = (e) => {
    let index = e.currentTarget.value;
    let id = this.state.popularIds[index];
    axios.get(this.props.url + `/movie/get/${id}`).then((res) => {
      console.log(res.data);
      console.log(this.props.history);
      this.props.history.push({
        pathname: "/movieInfo",
        state: {
          newState: res.data,
          data: this.props.userData,
        },
      });
    });
  };

  getPopMovie = (e) => {
    // console.log(e);
    let index = e.currentTarget.value;
    // console.log(index);
    let id = this.state.popularIds[index];
    // localStorage.setItem("dataForMovieInfo", this.state.data);
    axios.get(this.props.url + `/movie/get/${id}`).then((res) => {
      console.log(res.data);

      this.props.history.push({
        pathname: "/movieInfo",
        state: {
          newState: res.data,
          data: this.props.userData,
        },
      });
    });
  };

  clickTvImage = (e) => {
    let index = e.currentTarget.value;
    // console.log(index);
    let id = this.state.tvIds[index];
    // localStorage.setItem("dataForMovieInfo", this.state.data);
    axios.get(this.props.url + `/tv/get/${id}`).then((res) => {
      this.props.history.push({
        pathname: "/TvInfo",
        state: {
          newState: res.data,
          data: this.props.userData,
        },
      });
    });
  };

  getTvTitle = (e) => {
    // console.log(e);
    let index = e.currentTarget.value;
    // console.log(index);
    let id = this.state.tvIds[index];
    // localStorage.setItem("dataForMovieInfo", this.state.data);
    axios.get(this.props.url + `/movie/get/${id}`).then((res) => {
      this.props.history.push({
        pathname: "/TvInfo",
        state: {
          newState: res.data,
          data: this.props.userData,
        },
      });
    });
  };

  render() {
    let i = 0;
    let j = 0;
    let k = 0;
    console.log(this.props.recommendations);
    return (
      <div>
        {this.state.geImages.length > 0 && (
          <div>
            <h3>Movie Recomendations Customed For You</h3>
            <div id="carousel">
              <Carousel breakPoints={this.breakPoints} id="carousel">
                {this.state.geImages.map((image) => (
                  <div>
                    <div>
                      {image !== "-1" ? (
                        <input
                          type="image"
                          src={image}
                          id="image"
                          onClick={this.clickImage}
                          value={i}
                        ></input>
                      ) : (
                        <img
                          id="image"
                          src="https://www.radiationreport.com/wp-content/uploads/2013/08/no-preview.jpg"
                          value={i}
                        ></img>
                      )}
                    </div>
                    <Button
                      id="movieButton"
                      color="primary"
                      variant="contained"
                      value={i}
                      onClick={this.getMovie}
                    >
                      {this.state.geTitles[i].length <= 35 &&
                        this.state.geTitles[i]}
                      {this.state.geTitles[i].length > 35 &&
                        this.state.geTitles[i].substring(0, 35) + "..."}
                    </Button>
                    {console.log(i++)}
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        )}
        {/*{this.state.tvImages.length > 0 && (
          <div>
            <h3>TV Show Recomendations Customed For You</h3>
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
                    onClick={this.getTvTitle}
                  >
                    {this.state.tvTitles[k].length <= 35 &&
                      this.state.tvTitles[k]}
                    {this.state.tvTitles[k].length > 35 &&
                      this.state.tvTitles[k].substring(0, 35) + "..."}
                  </Button>
                  {console.log(k++)}
                </div>
              ))}
            </Carousel>
          </div>
                    )}*/}
        <div id="popMovies">
          <h3>Popular Movies Today</h3>
          <div id="carousel">
            <Carousel breakPoints={this.breakPoints}>
              {this.state.popularImages.map((image) => (
                <div>
                  <div>
                    {image !== "-1" ? (
                      <input
                        type="image"
                        src={image}
                        id="image"
                        onClick={this.clickPopImage}
                        value={j}
                      ></input>
                    ) : (
                      <img
                        id="image"
                        src="https://www.radiationreport.com/wp-content/uploads/2013/08/no-preview.jpg"
                        value={j}
                      ></img>
                    )}
                  </div>
                  <Button
                    id="movieButton"
                    color="primary"
                    variant="contained"
                    value={j}
                    onClick={this.getPopMovie}
                  >
                    {this.state.popularTitles[j].length <= 35 &&
                      this.state.popularTitles[j]}
                    {this.state.popularTitles[j].length > 35 &&
                      this.state.popularTitles[j].substring(0, 35) + "..."}
                  </Button>
                  {console.log(j++)}
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    );
  }
}

export default Recomendation;
