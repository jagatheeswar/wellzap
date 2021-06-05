import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  selectUser,
  selectUserType,
  setUserData,
  setUserType,
  setUserVerified,
} from "./features/userSlice";
import { db } from "./utils/firebase";
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
import CoachAddMeal from "./pages/Nutrition/CoachAddMeal";
import AthleteMedicalAssessment from "./pages/Profile/AthleteMedicalAssessment";
import RightContainer from "./pages/RightContainer/RightContainer";
import AthleteAddMeal from "./pages/Nutrition/AthleteAddMeal";
import AthleteNutrition from "./pages/Nutrition/AthleteNutrition";
import CreateNutrition from "./pages/Nutrition/CreateNutrition";
import CoachNutritionHome from "./pages/Nutrition/CoachNutritionHome";
import CoachCreateWorkout from "./pages/Workouts/CoachCreateWorkout";
import AllAthletes from "./pages/AllAthletes/AllAthletes";
import InviteAthlete from "./pages/AllAthletes/InviteAthlete";
import Messaging from "./pages/Messaging/Messaging";
import AssignedNutrition from "./pages/Nutrition/AssignedNutrition";
import Routes from "./Routes";
import ViewAllWorkouts from "./pages/Workouts/ViewAllWorkouts";
import ViewAllSavedWorkouts from "./pages/Workouts/ViewAllSavedWorkouts";
import AthletePayments from "./pages/Payments/AthletePayments";
import CoachPayments from "./pages/Payments/CoachPayments";

function App() {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      db.collection("athletes")
        .where("email", "==", user)
        .get()
        .then((snap) => {
          if (snap.empty) {
            dispatch(setUserType("coach"));
          } else {
            dispatch(setUserType("athlete"));
          }
        });
    }

    if (userType === "athlete") {
      db.collection("athletes")
        .where("email", "==", user)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            dispatch(
              setUserData({
                id: doc.id,
                data: doc.data(),
              })
            );
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } else {
      db.collection("coaches")
        .where("email", "==", user)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            dispatch(
              setUserData({
                id: doc.id,
                data: doc.data(),
              })
            );
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      try {
        const user = await localStorage.getItem("user");
        const userType = await localStorage.getItem("userType");
        const userVerified = await localStorage.getItem("userVerified");

        if (user != null) {
          dispatch(login(user));
        }
        if (userType != null) {
          dispatch(setUserType(userType));
        }
        if (userVerified != null) {
          dispatch(setUserVerified(userVerified == "true" ? true : false));
        }
      } catch (e) {
        console.log("error" + e);
      }
    };
    getData();
  }, []);

  const NotFound = () => {
    return <h4>404 Not Found</h4>;
  };

  function RoutesComp({ AthleteComp, CoachComp }) {
    if (userType) {
      console.log({ userType });
      return (
        <div className="home__container">
          <Sidebar />
          <div className="home__main">
            {userType === "coach" ? CoachComp : AthleteComp}
          </div>
          <div className="home__rightContainer">
            <RightContainer />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    }
  }

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
            <Route component={NotFound} />
          </Switch>
        </Router>
      ) : (
        <Router>
          <Switch>
            <Route exact path="/">
              <RoutesComp
                AthleteComp={<AthleteHome />}
                CoachComp={<CoachHome />}
              />
            </Route>

            <Route path="/profile">
              <RoutesComp AthleteComp={<Profile />} CoachComp={<Profile />} />
            </Route>

            <Route path="/profile/measurements">
              <RoutesComp
                AthleteComp={<AthleteMeasurements />}
                CoachComp={<AthleteMeasurements />}
              />
            </Route>
            <Route path="/nutrition/coach-add-meal">
              <RoutesComp
                AthleteComp={<CoachAddMeal />}
                CoachComp={<CoachAddMeal />}
              />
            </Route>
            <Route path="/profile/measurements/medical-assessment">
              <RoutesComp
                AthleteComp={<AthleteMedicalAssessment />}
                CoachComp={<AthleteMedicalAssessment />}
              />
            </Route>
            <Route path="/workouts">
              <RoutesComp
                AthleteComp={<AthleteWorkouts />}
                CoachComp={<CoachWorkouts />}
              />
            </Route>
            <Route path="/view-all-workouts">
              <RoutesComp
                AthleteComp={<ViewAllWorkouts />}
                CoachComp={<ViewAllWorkouts />}
              />
            </Route>
            <Route path="/view-all-saved-workouts">
              <RoutesComp
                AthleteComp={<ViewAllSavedWorkouts />}
                CoachComp={<ViewAllSavedWorkouts />}
              />
            </Route>
            <Route path="/create-workout">
              <RoutesComp
                AthleteComp={<CoachCreateWorkout />}
                CoachComp={<CoachCreateWorkout />}
              />
            </Route>
            <Route path="/assign-workout">
              <RoutesComp
                AthleteComp={<CoachCreateWorkout />}
                CoachComp={<CoachCreateWorkout />}
              />
            </Route>
            <Route path="/nutrition">
              <RoutesComp
                AthleteComp={<AthleteNutrition />}
                CoachComp={<CoachNutritionHome />}
              />
            </Route>
            <Route path="/add-meal">
              <RoutesComp
                AthleteComp={<AthleteAddMeal />}
                CoachComp={<CoachAddMeal />}
              />
            </Route>
            <Route path="/coach-nutrition-home">
              <RoutesComp
                AthleteComp={<CoachNutritionHome />}
                CoachComp={<CoachNutritionHome />}
              />
            </Route>
            <Route path="/create-nutrition">
              <RoutesComp
                AthleteComp={<CreateNutrition />}
                CoachComp={<CreateNutrition />}
              />
            </Route>
            <Route path="/payments">
              <RoutesComp
                AthleteComp={<AthletePayments />}
                CoachComp={<CoachPayments />}
              />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </Router>
      )}
    </div>
  );
}

export default App;
