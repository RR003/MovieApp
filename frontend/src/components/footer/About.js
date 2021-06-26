import React, { Component } from "react";
import NavBar from "../NavBar";
import "./About.css";

class About extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    console.log(this.props.location.state.props.data);
  }
  state = {};
  render() {
    return (
      <div>
        <NavBar id={this.props.location.state.props.data} />
        <center>
          <div id="about2">
            <div id="about1">
              <h1>ABOUT</h1>
              <p>
                This webapp was first started develoed in May 2021, with
                anticipated deployment around late June 2021. All movie
                information and part recomendations were brought by using the
                moviedb api services.{" "}
              </p>
            </div>
            <div>
              <h2>All Deployments</h2>
              <div>
                <h4>Version 1.1 - 06/25/21</h4>
                <p>
                  Users can now search TV shows, get customed recommendations
                  based on their watchlist for both movies and shows. Users can
                  also connect with their friends and see what they may be
                  watching by creating friend requests through the app.
                </p>
              </div>
              <div>
                <h4>Version 1.0 - 06/10/21</h4>
                <p>
                  Users had access to searching movies, adding to watch/watched
                  lists, could rate and give comments for watched movies.{" "}
                </p>
              </div>
            </div>
          </div>
        </center>
      </div>
    );
  }
}

export default About;
