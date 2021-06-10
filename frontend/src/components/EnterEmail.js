import React, { Component } from "react";
import NavBar from "./NavBar";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ParticleBackground from "./ParticleBackground";
import "../EnterEmail.css";
import axios from "axios";

const EnterEmail = (props) => {
  const [email, setEmail] = React.useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  let urls = "";
  if (process.env.NODE_ENV === "development") urls = "http://localhost:8081";
  else urls = "https://movieapp003.herokuapp.com";

  const onSubmit = () => {
    axios.post(urls + "/user/forgotPassword", { url: email }).then((res) => {
      console.log(res.data);
      window.location.href = "/verify";
    });
  };
  return (
    <div>
      <NavBar></NavBar>
      <center id="emailForm">
        <Grid>
          <TextField
            label="Enter Email"
            onChange={handleEmailChange}
            variant="outlined"
          ></TextField>
        </Grid>

        <Button
          edge="end"
          color="primary"
          id="emailButton"
          type="button"
          className="btn btn-danger"
          variant="contained"
          onClick={onSubmit}
        >
          Create New Password
        </Button>
      </center>
      <ParticleBackground />
    </div>
  );
};

export default EnterEmail;
