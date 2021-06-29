import React, { useEffect, useState } from "react";
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
import AssignWorkout from "./pages/Workouts/AssignWorkout";
import AllAthletes from "./pages/AllAthletes/AllAthletes";
import InviteAthlete from "./pages/AllAthletes/InviteAthlete";
import AssignedNutrition from "./pages/Nutrition/AssignedNutrition";
import Routes from "./Routes";
import ViewAllWorkouts from "./pages/Workouts/ViewAllWorkouts";
import ViewAllSavedWorkouts from "./pages/Workouts/ViewAllSavedWorkouts";
import ViewAllNutrition from "./pages/Nutrition/ViewAllNutrition";
import ViewAllSavedNutrition from "./pages/Nutrition/ViewAllSavedNutrition";
import AthletePayments from "./pages/Payments/AthletePayments";
import CoachPayments from "./pages/Payments/CoachPayments";
import Reports from "./pages/Reports/Reports";
import Graph3_ from "./pages/Reports/Graph3";
import AthleteCalendar from "./pages/Calendar/AthleteCalendar";
import CoachCalendar from "./pages/Calendar/CoachCalendar";
import AthleteTrainingAssessment from "./pages/Profile/AthleteTrainingAssessment";
import AthleteFoodAndLifestyleAssessment from "./pages/Profile/AthleteFoodAndLifestyleAssessment";
import Report_coach from "./pages/Reports/Report_coach";
import Test from "./pages/Reports/Test";
import Messaging from "./pages/Messaging/Messaging";
import ChatCard from "./pages/Messaging/ChatCard";
import ChatHomeScreen from "./pages/Messaging/ChatHomeScreen";
import AthleteStats from "./pages/AllAthletes/AthleteStats";
import AthleteProfile_coach from "./pages/AllAthletes/AthleteProfile_Coach";
import AthleteMedicalAssessment_coach from "./pages/AllAthletes/AthleteMedicalAssessment";
import AthleteFoodAndLifestyleAssessment_coach from "./pages/AllAthletes/AthleteFoodAndLifestyleAssessment";
import LogWeight from "./pages/LogWeight/LogWeight";
import AthleteMeasurements_coach from "./pages/AllAthletes/AthleteMeasurements";
import AthleteTrainingAssessment_coach from "./pages/AllAthletes/AthleteTrainingAssessment";
import ViewNutrition from "./pages/Nutrition/ViewNutrition";
import PostWorkoutDetails from "./pages/Workouts/PostWorkout";
import CreateLongTermNutritionPlan from "./pages/Nutrition/CreateLongTermNutritionPlan";

import dateContext from "../src/features/context";
import CreateLongTermTrainingPlan from "./pages/Workouts/CreateLongTermTrainingPlan";
import "./fonts/Open_Sans/OpenSans-Regular.ttf";
import "./fonts/Montserrat/Montserrat-Regular.ttf";
import {Grid} from '@material-ui/core'

function App() {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  //(new Date().setHours(0, 0, 0, 0));
  const [selectedDate, setselectedDate] = useState(
    new Date().setHours(0, 0, 0, 0)
  );

  const toggle_date = (date) => {
    setselectedDate(date);
    console.log("ch", date);
  };

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
          <Grid container>
          <Grid item xs={2}>
          <Sidebar />
          </Grid>
          <Grid item xs={7} style={{marginLeft: 13}} className="home__main">
            {userType === "coach" ? CoachComp : AthleteComp}
          </Grid>
          <Grid item xs={3} className="home__rightContainer">
            <RightContainer
              toggle_date={toggle_date}
              selectedDate={selectedDate}
            />
          </Grid>
          </Grid>
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
                AthleteComp={<AthleteHome selectedDate={selectedDate} />}
                CoachComp={<CoachHome selectedDate={selectedDate} />}
              />
            </Route>

            <Route path="/profile">
              <RoutesComp AthleteComp={<Profile />} CoachComp={<Profile />} />
            </Route>

            <Route path="/reports">
              <RoutesComp
                AthleteComp={<Reports />}
                CoachComp={<Report_coach />}
              />
            </Route>
            <Route path="/profile/measurements">
              <RoutesComp
                AthleteComp={<AthleteMeasurements />}
                CoachComp={<AthleteMeasurements />}
              />
            </Route>
            <Route path="/invite-athlete">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<InviteAthlete />}
              />
            </Route>
            <Route path="/nutrition/coach-add-meal">
              <RoutesComp
                AthleteComp={<CoachAddMeal />}
                CoachComp={<CoachAddMeal />}
              />
            </Route>
            <Route path="/Athlete/training-assessment/:AthleteId">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteTrainingAssessment_coach />}
              ></RoutesComp>
            </Route>
            <Route path="/Athlete/food-and-lifestyle-assessment/:AthleteId">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteFoodAndLifestyleAssessment_coach />}
              ></RoutesComp>
            </Route>
            <Route path="/Athlete/anthropometric-measurements/:AthleteId">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteMeasurements_coach />}
              ></RoutesComp>
            </Route>
            <Route path="/log-weight">
              <RoutesComp
                AthleteComp={<LogWeight />}
                CoachComp={<NotFound />}
              ></RoutesComp>
            </Route>
            <Route path="/Athlete/medical-assessment/:AthleteId">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteMedicalAssessment_coach />}
              ></RoutesComp>
            </Route>
            <Route path="/Athlete/reports/:AthleteId">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteStats />}
              />
            </Route>

            <Route path="/Athlete/:AthleteId">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteProfile_coach />}
              />
            </Route>
            <Route path="/Athlete/medical-assessment/:AthleteId">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteMedicalAssessment_coach />}
              ></RoutesComp>
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
            <Route path="/post-workout">
              <RoutesComp
                AthleteComp={<PostWorkoutDetails />}
                CoachComp={<AssignWorkout />}
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
                AthleteComp={<AssignWorkout />}
                CoachComp={<AssignWorkout />}
              />
            </Route>
            <Route path="/nutrition">
              <RoutesComp
                AthleteComp={<AthleteNutrition />}
                CoachComp={<CoachNutritionHome />}
              />
            </Route>
            <Route path="/view-nutrition">
              <RoutesComp
                AthleteComp={<AthleteNutrition />}
                CoachComp={<ViewNutrition />}
              />
            </Route>
            <Route path="/view-all-nutrition">
              <RoutesComp
                AthleteComp={<ViewAllNutrition />}
                CoachComp={<ViewAllNutrition />}
              />
            </Route>
            <Route path="/view-all-saved-nutrition">
              <RoutesComp
                AthleteComp={<ViewAllSavedNutrition />}
                CoachComp={<ViewAllSavedNutrition />}
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
            <Route path="/assign-nutrition">
              <RoutesComp
                AthleteComp={<CreateNutrition />}
                CoachComp={<CreateNutrition />}
              />
            </Route>
            <Route path="/long-term-nutrition">
              <RoutesComp 
                AthleteComp={<NotFound />}
                CoachComp={<CreateLongTermNutritionPlan />}
              />
            </Route>
            <Route path="/long-term-training">
              <RoutesComp 
                AthleteComp={<NotFound />}
                CoachComp={<CreateLongTermTrainingPlan />}
              />
            </Route>
            <Route path="/payments">
              <RoutesComp
                AthleteComp={<AthletePayments />}
                CoachComp={<CoachPayments />}
              />
            </Route>
            <Route path="/calendar">
              <RoutesComp
                AthleteComp={<AthleteCalendar />}
                CoachComp={<CoachCalendar />}
              />
            </Route>
            <Route path="/anthropometric-measurements">
              <RoutesComp
                AthleteComp={<AthleteMeasurements />}
                CoachComp={<AthleteMeasurements />}
              />
            </Route>
            <Route path="/medical-assessment">
              <RoutesComp
                AthleteComp={<AthleteMedicalAssessment />}
                CoachComp={<AthleteMedicalAssessment />}
              />
            </Route>
            <Route path="/training-assessment">
              <RoutesComp
                AthleteComp={<AthleteTrainingAssessment />}
                CoachComp={<AthleteTrainingAssessment />}
              />
            </Route>
            <Route path="/food-and-lifestyle-assessment">
              <RoutesComp
                AthleteComp={<AthleteFoodAndLifestyleAssessment />}
                CoachComp={<AthleteFoodAndLifestyleAssessment />}
              />
            </Route>
            <Route path="/messaging">
              <RoutesComp
                AthleteComp={<Messaging />}
                CoachComp={<Messaging />}
              />
            </Route>
            <Route path="/chat">
              <RoutesComp
                AthleteComp={<ChatHomeScreen />}
                CoachComp={<ChatHomeScreen />}
              />
            </Route>
            <Route path="/all-athletes">
              <RoutesComp
                AthleteComp={<AllAthletes />}
                CoachComp={<AllAthletes />}
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
