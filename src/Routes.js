import React from "react";
import RightContainer from "./pages/RightContainer/RightContainer";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import "./App.css";
import "./responsive.css"

function Routes({ path, type, AthleteComp, CoachComp }) {
  console.log({ path, type, AthleteComp, CoachComp });
  return (
    <div className="home__container">
      <Sidebar />
      <div className="home__main">
        <Route exact path={path}>
          {type === "athlete" ? <AthleteComp /> : <CoachComp />}
        </Route>
      </div>
      <div className="home__rightContainer">
        <RightContainer />
      </div>
    </div>
  );
}

export default Routes;
