import React, { Component } from "react";
import Button from "@material-ui/core/Button";

class Tv extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    tv: this.props.info.tv,
    tvImages: this.props.info.tvImages,
  };
  render() {
    let j = -1;
    return (
      <div>
        {this.state.tv.map((t) => (
          <div id="theWatchedMovie">
            {console.log(j)}
            {this.state.tvImages[j + 1] !== "-1" ? (
              <input
                type="image"
                src={this.state.tvImages[j + 1]}
                id="image"
                onClick={this.clickImage}
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
                onClick={this.getMovie}
              >
                {t.title.length <= 35 && t.title}
                {t.title.length > 35 && t.title.substring(0, 35) + "..."}
              </Button>

              <Button
                id="delete"
                value={t.id}
                onClick={this.deleteMovie}
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
    );
  }
}

export default Tv;
