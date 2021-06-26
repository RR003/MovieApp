import React, { Component } from "react";
import NavBar from "../NavBar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";

class Contact extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    email: "",
    problem: "",
    url: "",
    message: "",
  };

  async componentDidMount() {
    let url = process.env.REACT_APP_URL;
  }

  changeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  changeProblem = (e) => {
    this.setState({ problem: e.target.value });
  };

  submit = () => {
    axios
      .post(this.state.url + "/user/submit", {
        email: this.state.email,
        password: this.state.problem,
      })
      .then((res) => {
        this.setState({ message: "message is sent" });
      });
  };

  render() {
    return (
      <div>
        <NavBar id={this.props.location.state.props.data} />
        <h1>Contact Us!</h1>
        <p>
          We welcome you for looking at our website. If you have any suggestions
          and/or you are facing any problems, please fill out the form below and
          we will notify you back ASAP
        </p>

        <TextField
          variant="outlined"
          required
          id="username"
          label="Enter Email"
          onChange={this.changeEmail}
        />
        <br></br>
        <TextField
          variant="outlined"
          required
          id="field"
          label="Enter Suggestion/Problem"
          onChange={this.changeProblem}
        />
        <br></br>
        <Button onClick={this.submit} color="primary">
          Submit
        </Button>

        <br></br>
        {this.state.message}
      </div>
    );
  }
}

export default Contact;
