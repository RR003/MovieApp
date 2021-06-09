import React, { Component } from "react";
import "../NavBar.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";
import Movies from "./Movies";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const NavBar = (props) => {
  const [movieTitle, setMovieTitle] = React.useState("");
  const classes = useStyles();
  // const state = props.location;
  let data = null;
  if (props.id === undefined) {
    console.log("undefined");
    data = {
      username: undefined,
    };
  } else {
    data = props.id;
    console.log("DATA = " + props.id.username);
  }

  let isSigninHidden = false;
  if (data.username !== undefined && data.username !== null) {
    console.log("person is signed in");
    isSigninHidden = true;
  } else {
    console.log("person is not signed in");
  }

  // console.log(data);
  // console.log(data);

  const handleMovieTitleChange = (event) => {
    setMovieTitle(event.target.value);
  };

  const getMovieFunction = () => {
    console.log("getting movie");
    axios.get(`/movie/${movieTitle}`).then((res) => {
      console.log(data);
      console.log(JSON.stringify(res.data[0]));
      console.log(JSON.stringify(res.data[1]));
      localStorage.setItem("list", JSON.stringify(res.data[0]));
      localStorage.setItem("images", JSON.stringify(res.data[1]));
      localStorage.setItem("title", movieTitle);
      localStorage.setItem("data", JSON.stringify(data));
      console.log(localStorage.getItem("list"));
      console.log(localStorage.getItem("title"));
      console.log(JSON.parse(localStorage.getItem("data")).username);
      window.location.href = "/movies";
    });
  };

  function refreshPage() {
    console.log("refresh page");
    window.location.href = "/";
  }

  {
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h6" noWrap>
              {props.username}
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search Movie…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={handleMovieTitleChange}
                onSubmit={getMovieFunction}
                inputProps={{ "aria-label": "search" }}
              />
            </div>

            <div>
              <Button
                id="searchmovie"
                color="secondary"
                className={classes.enter}
                onClick={getMovieFunction}
                variant="outlined"
              >
                Enter
              </Button>
            </div>
            <div id="menuoptions">
              {isSigninHidden && (
                <Link
                  to={{
                    pathname: "/",
                    state: {},
                  }}
                >
                  <Button
                    id="button"
                    onClick={refreshPage}
                    type="button"
                    className="btn btn-danger"
                    color="secondary"
                  >
                    Sign Out
                  </Button>
                </Link>
              )}

              {isSigninHidden && (
                <Link
                  to={{
                    pathname: "/watchedList",
                    state: data,
                  }}
                >
                  <Button id="button" type="button" color="secondary">
                    WatchedList
                  </Button>
                </Link>
              )}

              <Link
                to={{
                  pathname: "/",
                  state: data,
                }}
              >
                <Button
                  color="secondary"
                  id="button"
                  type="button"
                  className="btn btn-danger"
                >
                  Home
                </Button>
              </Link>

              {!isSigninHidden && (
                <Link
                  to={{
                    pathname: "/signIn",
                  }}
                >
                  <Button
                    edge="end"
                    color="secondary"
                    id="button"
                    type="button"
                    className="btn btn-danger"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
};

export default NavBar;

/*<div>
        {console.log(isSigninHidden)}
        <ul id="nav">
          <li id="searchbar">
            <input
              id="search"
              placeHolder="search movie..."
              onChange={handleMovieTitleChange}
            ></input>
            <button id="searchButton" onClick={getMovieFunction}>
              Search
            </button>
          </li>

          {isSigninHidden && (
            <li id="signout">
              <Link
                to={{
                  pathname: "/",
                  state: {},
                }}
              >
                <button
                  id="button"
                  onClick={refreshPage}
                  type="button"
                  className="btn btn-danger"
                >
                  Sign Out
                </button>
              </Link>
            </li>
          )}

          {isSigninHidden && (
            <li id="watchedlist">
              <Link
                to={{
                  pathname: "/watchedList",
                  state: data,
                }}
              >
                <button id="button" type="button" className="btn btn-danger">
                  WatchedList
                </button>
              </Link>
            </li>
          )}

          <li id="home">
            <Link
              to={{
                pathname: "/",
                state: data,
              }}
            >
              <button id="button" type="button" className="btn btn-danger">
                Home
              </button>
            </Link>
          </li>

          {!isSigninHidden && (
            <li id="signin">
              <Link
                to={{
                  pathname: "/signIn",
                }}
              >
                <button id="button" type="button" className="btn btn-danger">
                  Sign In
                </button>
              </Link>
            </li>
          )}
        </ul>
      </div>*/
