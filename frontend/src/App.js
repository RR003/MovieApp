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
import SignIn from "./components/login/SignIn";
import NavBar from "./components/NavBar";
import WatchedList from "./components/WatchedList";
import SignUp from "./components/login/SignUp";
import Ratings from "./components/Ratings";
import NeedToVerify from "./components/email/NeedToVerify";
import EnterEmail from "./components/email/EnterEmail";
import Friends from "./components/Friends";
import Recomendation from "./components/Recomendation";
import TVInfo from "./components/TVInfo";
import About from "./components/footer/About";
import Contact from "./components/footer/Contact";

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
          <Route exact path="/friends" component={Friends} />
          <Route exact path="/" component={Recomendation} exact={true} />
          <Route exact path="/TvInfo" component={TVInfo} />
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
