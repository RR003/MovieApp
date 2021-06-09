import React, { useState } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import "../SignIn.css";
import ParticleBackground from "./ParticleBackground";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import GroupIcon from "@material-ui/icons/Group";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

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

  const handleOnSubmit = () => {
    axios
      .post(`/user/login/`, {
        username: username,
        password: password,
      })
      .then((res) => {
        console.log(res);
        let body = res.data;
        console.log(body);
        if (body.url === "success") {
          axios.get(`user/${username}`).then((res) => {
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
                  <br></br>
                  <Button color="primary" onClick={forgotPassword}>
                    Forgot Password
                  </Button>
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

/*<div class="container">
            <center>
              <form id="signinform">
                <h3>Sign In</h3>
                <div>
                  <b></b>
                  <input
                    id="username"
                    type="username"
                    placeholder="Enter Username"
                    onChange={handleUsernameChange}
                  ></input>
                </div>
                <div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    onChange={handlePasswordChange}
                  ></input>
                </div>
                <div>
                  <h3>{message}</h3>
                </div>
              </form>
              <div id="buttons">
                <button id="button2" onClick={handleOnSubmit}>
                  Log In
                </button>
                <Button id="button3" onClick={handleSignUp}>
                  Sign Up
                </Button>
              </div>
            </center>
          </div>*/
/*<Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <GroupIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Employee Directory
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="firstName"
                value={firstName}
                label="First Name"
                name="firstName"
                onChange={handleFirstNameChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastNamee"
                value={lastName}
                label="Last Name"
                name="lastName"
                onChange={handleLastNameChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="empNo"
                value={empNo}
                label="Employee ID"
                name="empNo"
                onChange={handleEmpNoChange}
              />
            </Grid>
            <label>
              Gender :
              <select onChange={handleGenderChange}>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </label>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="date"
                type="date"
                value={date}
                label="Employee Start Date"
                name="date"
                onChange={handleDateChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                variant="outlined"
                required
                fullWidth
                value={password}
                id="password"
                label="Password"
                type="password"
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                variant="outlined"
                required
                fullWidth
                value={confirmPassword}
                id="Confirm Password"
                label="confirmPassword"
                type="password"
                onChange={handleConfirmPasswordChange}
              />
            </Grid>
          </Grid>
          <Button
            // type="submit"
            fullWidth
            variant="contained"
            color="primary"
            preventDefault
            className={classes.submit}
            onClick={handleSubmit}
          >
            Log In
          </Button>
        </form>
        <Typography style={{ margin: 7 }} variant="body1">
          {message}
        </Typography>
      </div>
    </Container>*/
