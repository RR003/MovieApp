import React, { useState } from "react";
import NavBar from "../NavBar";
import axios from "axios";
import "./SignIn.css";
import ParticleBackground from "../ParticleBackground";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import GroupIcon from "@material-ui/icons/Group";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import GoogleLogin from "react-google-login";
require("dotenv").config();

const clientId = process.env.REACT_APP_GOOGLE_API;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(7),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "100%",
  },
}));

let url = process.env.REACT_APP_URL;

const SignIn = (props) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onSuccess = (googleUser) => {
    var id_token = googleUser.getAuthResponse().id_token;
    axios
      .post(url + "/user/googleSignIn", {
        url: id_token,
      })
      .then((res) => {
        sessionStorage.setItem("token", res.data.verificationCode);
        // console.log(res.data.verificationCode);
        props.history.push({
          pathname: "/",
          state: res.data,
        });
      });
  };

  const onFailure = (res) => {
    console.log("this sadly didnt work");
  };

  const handleOnSubmit = () => {
    axios
      .post(url + `/user/login/`, {
        username: username,
        password: password,
      })
      .then((res) => {
        console.log(res);
        let body = res.data;
        console.log(body);
        if (body.url.length > 30) {
          let token = body.url;
          sessionStorage.setItem("token", token);
          console.log(token);
          axios.get(url + `/user/${username}`).then((res) => {
            props.history.push({
              pathname: "/",
              state: res.data,
            });
          });
        } else {
          setMessage(body.url);
        }
      });
  };

  const handleSignUp = () => {
    window.location.href = "/signUp";
  };

  const forgotPassword = () => {
    window.location.href = "/forgotPassword";
  };

  {
    return (
      <div>
        <div id="all">
          <NavBar></NavBar>
          <center>
            <Container id="totalsigninform" component="main" maxWidth="xs">
              <CssBaseline />
              <div>
                <Typography id="signintitle" variant="h5">
                  Sign In
                </Typography>
                <br></br>
                <form noValidate id="signinform">
                  <Grid container spacing={2}>
                    <Grid item>
                      <TextField
                        variant="outlined"
                        required
                        id="username"
                        value={username}
                        label="Enter Username"
                        name="username"
                        onChange={handleUsernameChange}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        variant="outlined"
                        required
                        id="password"
                        value={password}
                        label="Enter Password"
                        type="password"
                        onChange={handlePasswordChange}
                      />
                    </Grid>
                  </Grid>
                  <div>
                    <GoogleLogin
                      clientId={clientId}
                      onSuccess={onSuccess}
                      onFailure={onFailure}
                    />
                    <Button color="primary" onClick={forgotPassword}>
                      Forgot Password
                    </Button>
                  </div>
                </form>

                <Button
                  // type="submit"
                  id="signinbutton"
                  variant="contained"
                  color="primary"
                  preventDefault
                  onClick={handleOnSubmit}
                >
                  Log In
                </Button>
                <Button
                  // type="submit"
                  id="signupbutton"
                  variant="contained"
                  color="primary"
                  preventDefault
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
                <Typography style={{ margin: 7 }} variant="body1">
                  {message}
                </Typography>
              </div>
            </Container>
          </center>
        </div>
        <ParticleBackground />
      </div>
    );
  }
};

export default SignIn;
