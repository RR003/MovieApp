import "./App.css";
import {
  Route,
  BrowserRouter as Router,
  BrowserRouter,
  Switch,
} from "react-router-dom";
import Home from "./components/Home";
import Movies from "./components/Movies";
import MovieInfo from "./components/MovieInfo";
import SignIn from "./components/SignIn";
import NavBar from "./components/NavBar";
import WatchedList from "./components/WatchedList";
import SignUp from "./components/SignUp";
import Ratings from "./components/Ratings";
import NeedToVerify from "./components/NeedToVerify";
import EnterEmail from "./components/EnterEmail";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Home} exact={true} />;
          <Route exact path="/movies" component={Movies} exact={true} />
          <Route exact path="/movieInfo" component={MovieInfo} exact={true} />
          <Route exact path="/navbar" component={NavBar} exact={true} />
          <Route exact path="/signIn" component={SignIn} exact={true} />
          <Route exact path="/signUp" component={SignUp} exact={true} />
          <Route
            exact
            path="/watchedList"
            component={WatchedList}
            exact={true}
          />
          <Route exact path="/giveRating" component={Ratings} exact={true} />
          <Route exact path="/verify" component={NeedToVerify} exact={true} />
          <Route exact path="/forgotPassword" component={EnterEmail} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
