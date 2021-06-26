import React, { Component } from "react";
import "../NavBar.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import logo from "../showbinge.png";

import Fade from "@material-ui/core/Fade";

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    console.log(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  let url = process.env.REACT_APP_URL;

  const handleClose = () => {
    setAnchorEl(null);
  };
  // const state = props.location;
  let data = null;
  if (props.id === undefined) {
    // console.log("undefined");
    data = {
      username: undefined,
    };
  } else {
    data = props.id;
    // console.log("DATA = " + props.id.username);
  }

  let isSigninHidden = false;

  if (
    data.username !== undefined &&
    data.username !== null &&
    sessionStorage.getItem("token") !== null
  ) {
    // console.log("person is signed in");
    isSigninHidden = true;
  } else {
    // console.log("person is not signed in");
  }

  const onKeyUp = (event) => {
    if (event.charCode === 13) {
      setMovieTitle(event.target.value);
      getMovieFunction();
    }
  };

  const handleMovieTitleChange = (event) => {
    setMovieTitle(event.target.value);
  };

  const getMovieFunction = () => {
    console.log("getting movie");
    axios
      .get(url + `/movie/${movieTitle}`)
      .then((res) => {
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
      })
      .then(
        axios.get(url + `/tv/${movieTitle}`).then((res) => {
          localStorage.setItem("tvList", JSON.stringify(res.data[0]));
          localStorage.setItem("tvImages", JSON.stringify(res.data[1]));
          window.location.href = "/movies";
        })
      );
  };

  function refreshPage() {
    localStorage.clear();
    props = "";
    sessionStorage.clear();
    console.log("refresh page");
    window.location.href = "/";
  }

  {
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Link
              to={{
                pathname: "/",
                state: data,
              }}
            >
              <img src={logo} id="logo" />
            </Link>

            <Typography className={classes.title} variant="h6" noWrap>
              {props.username}
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                id="searchTerm"
                placeholder="Search Movie/TV Show"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={handleMovieTitleChange}
                onKeyPress={onKeyUp}
                inputProps={{ "aria-label": "search" }}
              />
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
                    type="button2"
                    className="btn btn-danger"
                    color="secondary"
                  >
                    Sign Out
                  </Button>
                </Link>
              )}

              {isSigninHidden && (
                <div>
                  <Button
                    aria-controls="fade-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    color="secondary"
                    id="button2"
                  >
                    Menu
                  </Button>
                  <Menu
                    id="fade-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                  >
                    <MenuItem>
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
                    </MenuItem>
                    <MenuItem>
                      <Link
                        to={{
                          pathname: "/friends",
                          state: data,
                        }}
                      >
                        <Button id="button1" type="button" color="secondary">
                          Friends
                        </Button>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        to={{
                          pathname: "/watchedList",
                          state: data,
                        }}
                      >
                        <Button id="button1" type="button" color="secondary">
                          WatchedList
                        </Button>
                      </Link>
                    </MenuItem>
                  </Menu>
                </div>
              )}

              {!isSigninHidden && (
                <div>
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
                </div>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
};

export default NavBar;
