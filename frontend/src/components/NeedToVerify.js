import React, { Component } from "react";
import NavBar from "./NavBar";
import ParticleBackground from "./ParticleBackground";

class NeedToVerify extends Component {
  state = {};
  render() {
    return (
      <div>
        <div>
          <NavBar></NavBar>

          <h2>An email has been sent, please verify your account</h2>
        </div>
        <ParticleBackground />
      </div>
    );
  }
}

export default NeedToVerify;
