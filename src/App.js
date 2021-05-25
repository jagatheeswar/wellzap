import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser, selectUserType } from "./features/userSlice";
import { auth } from "./utils/firebase";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import CoachWorkouts from "./pages/Workouts/CoachWorkouts";
import AthleteWorkouts from "./pages/Workouts/AthleteWorkouts";
import Sidebar from "./Components/Sidebar/Sidebar";
import Notification from "./Components/Notifications/Notification";
import AthleteHome from "./pages/Home/AthleteHome";
import CoachHome from "./pages/Home/CoachHome";
import AthleteMeasurements from "./pages/Profile/AthleteMeasurements";
import CoachAddMeal from "./pages/Nutrition/CoachNutrition/CoachAddMeal";
import AthleteMedicalAssessment from "./pages/Profile/AthleteMedicalAssessment";

function App() {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) console.log(user);
      // dispatch(login({
      //   displayName: user.displayName,
      //   email: user.email,
      //   photoURL: user.photoURL
      // }))
    });
  }, []);

  return (
    <div>
      {!user ? (
        <Router>
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>

            <Route exact path="/signup">
              <Signup />
            </Route>
          </Switch>
        </Router>
      ) : (
        <Router>
          <div className="home__container">
            <Sidebar />
            <div className="home__main">
              <Switch>
                <Route exact path="/">
                  {userType === "athlete" ? <AthleteHome /> : <CoachHome />}
                </Route>
                <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/profile/measurements">
          <AthleteMeasurements />
        </Route>
          <Route exact path="/nutrition/coach-add-meal">
            <CoachAddMeal />
          </Route>
          <Route exact path="/profile/measurements/medical-assessment">
          <AthleteMedicalAssessment />
        </Route>
                <Route exact path="/workouts">
                  {userType === "athlete" ? (
                    <AthleteWorkouts />
                  ) : (
                    <CoachWorkouts />
                  )}
                </Route>
              </Switch>
            </div>
            <div className="home__rightContainer">
              <Notification />
            </div>
          </div>
        </Router>
      )}
    </div>
  );
}

export default App;
