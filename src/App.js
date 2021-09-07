import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  selectUser,
  selectUserType,
  setUserData,
  setUserType,
  setUserVerified,
  logout,
  selectUserVerified,

} from "./features/userSlice";
import { auth } from "./utils/firebase"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
} from "@material-ui/core";
import { isMobile } from "react-device-detect";
import SidebarComponent from "../src/Components/Sidebar/SidebarComponent"
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
import CoachAddWorkout from "./pages/Workouts/CoachAddWorkout";
import CreateLongTermTrainingPlan from "./pages/Workouts/CreateLongTermTrainingPlan";
import "./fonts/Open_Sans/OpenSans-Regular.ttf";
import "./fonts/Montserrat/Montserrat-Regular.ttf";
import { Grid } from "@material-ui/core";
import CoachProfile from "./pages/Profile/CoachProfile";
import AthleteMealHistory from "./pages/Nutrition/AthleteMealHistory";
import ViewAllPastWorkouts from "./pages/Workouts/ViewAllPastWorkouts";
import AthleteHistory from "./pages/AllAthletes/AthleteHistory";
import PrintPreview from "./pages/Reports/PrintPreview";
import CreateOwnWorkout from "./pages/Workouts/CreateOwnWorkout";
import ViewAllSavedLongTermWorkouts from "./pages/Workouts/ViewAllSavedLongTermWorkouts";
import ViewAllAssignedLongTermWorkouts from "./pages/Workouts/ViewAllAssignedLongTermWorkouts";
import LongTermNutrition from "./pages/Nutrition/ViewAllLongTerm";
import VideoUpload from "./pages/VOD/VideoUpload";
import VODHome from "./pages/VOD/VODHome";
import ViewAllUploadedVideos from "./pages/VOD/ViewAllUploadedvideos";
import ViewAllAssignedVideos from "./pages/VOD/ViewAllAssignedvideos";
import AssignVideo from "./pages/VOD/AssignVideo";
import AthleteAssignedVideos from "./pages/Workouts/athleteassignedvideos";
import SavedLongTermNutrition from "./pages/Nutrition/ViewAllSavedLongTerm";
import AthleteCreateWorkout from "./pages/Workouts/AthleteCreateWorkout";
import AthleteWorkoutsList from "./pages/Workouts/AthleteWorkoutsList";
import DisabledHome from "./pages/Home/DisabledHome";
import InvitesList from "./pages/Profile/InviteList";
import InviteScreen from "./pages/Profile/InviteScreen";
import ViewAllVideoWorkouts from "./pages/VOD/ViewAllVideoWorkouts";
import EditPayments from "./pages/Payments/EditPayments";
import AthleteOnBoarding from "./pages/Profile/AnthleteOnBoard";

function App() {
  const history = useHistory();
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

  const [openDialogs, setOpenDialogs] = React.useState(false);

  const handleClickOpenDialogs = () => {
    setOpenDialogs(true);
  };

  const handleCloseDialogs = () => {
    setOpenDialogs(false);
  };

  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();

  const [checkactive, setCheckactive] = useState(true);
  const [selectedDate, setselectedDate] = useState(
    new Date().setHours(0, 0, 0, 0)
  );
  const [deviceMobile, setdeviceMobile] = useState(isMobile);
  const [active, setActive] = useState(true);
  const userVerified = useSelector(selectUserVerified);

  const toggle_date = (date) => {
    setselectedDate(date);
    console.log("ch", date);
  };
  console.log(12111, isMobile);

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
      console.log(user);
      db.collection("athletes")
        .where("email", "==", user)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            console.log("db", doc.data().verified);
            dispatch(setUserVerified(doc.data().verified));
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

            console.log("active", doc.data().active);
            setActive(
              doc.data().active !== undefined
                ? doc.data().active === true
                  ? true
                  : false
                : true
            );
          });
        });
    }
  }, [user, checkactive, userVerified]);

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
          dispatch(setUserVerified(userVerified));
        }
      } catch (e) {
        console.log("error" + e);
      }
    };
    getData();
  }, [checkactive]);

  const NotFound = () => {
    return <h4>404 Not Found</h4>;
  };

  function RoutesComp({ AthleteComp, CoachComp }) {
    if (userType) {
      console.log({ userType });
      return (
        <div className="home__container">
          {deviceMobile ? (
            <div
              style={{
                minHeight: "99.99vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h4>Please use our mobile app for better experience</h4>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 30,
                  }}
                >
                  <div className="devicebutton">
                    <button
                      style={{
                        border: "none",
                        padding: 20,
                        backgroundColor: "#ffe486",
                        borderRadius: 10,
                      }}
                    >
                      Android
                    </button>
                  </div>

                  <div className="devicebutton" style={{ marginLeft: 50 }}>
                    <button
                      style={{
                        border: "none",
                        padding: 20,
                        backgroundColor: "#ffe486",
                        borderRadius: 10,
                      }}
                    >
                      Android
                    </button>
                  </div>
                </div>

                {/* <div
                  onClick={() => {
                    setdeviceMobile(!deviceMobile);
                  }}
                  className="devicebutton"
                >
                  <p style={{ textDecoration: "underline" }}>
                    Continue to Website
                  </p>
                </div> */}
              </div>
            </div>
          ) : (
            <Grid container>
              <div className="sidebarclass">
                <Sidebar show_menu={active} />
              </div>
              <i className="fa fa-bars" id="menutoggle" onClick={handleClickOpenDialogs}></i>
              
      <Dialog
        open={openDialogs}
        TransitionComponent={Transition}
        keepMounted
        minWidth="lg"
        
        fullWidth
        onClose={handleCloseDialogs}
      >
        <DialogTitle>Support</DialogTitle>
        <DialogContent className="paper">
        <div className="dialogflex">
          <div className="dialogflexone">
          <SidebarComponent logo="Home" name="Home" path="" />
          <SidebarComponent disabled={true} logo="hamburger" name="Nutrition" path="nutrition"/>
          <SidebarComponent logo="user" name="Athletes" path="all-athletes"/>
          <SidebarComponent logo="rupee" name="Payments" path="payments" />
            </div>
            
          <div className="dialogflextwo">
          <SidebarComponent logo="dumbell" name="Workouts" path="workouts"/>
          <SidebarComponent logo="play" name="VOD" path="vod" />
          <SidebarComponent logo="message" name="Messaging" path="chat" />
          <SidebarComponent logo="settings" name="Support" />
            </div>
            <div
        className="signout__button dialogsignout"
        onClick={() => {
          auth.signOut();
          dispatch(logout());
          history.push("/");
        }}
      >
        <h2>Signout</h2>
      </div>
        </div>
        </DialogContent>
        <DialogActions>
          <button
          className="sidebarbutton"
            style={{
              position:"absolute",
              top:'10px',
              outline: "none",
              border: "none",
              backgroundColor: "transparent",
              padding: "8px 30px",
              marginRight: 30,
              borderRadius: 10,
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={() => handleCloseDialogs()}
          >
            <i className="fa fa-close fa-2x"></i>
          </button>
        </DialogActions>
      </Dialog>
              <div className="home__main" style={{}} >
                {userType === "coach" ? CoachComp : AthleteComp}
              </div>
              
              <div style={{background:'red'}} className="home__rightContainer">
                {active && (
                  <RightContainer
                    toggle_date={toggle_date}
                    selectedDate={selectedDate}
                  />
                )}
              </div>
            </Grid>
          )}
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
      ) : !userVerified && userType == "athlete" ? (
        <Router>
          <Switch>
            <Route>
              <AthleteOnBoarding />
            </Route>
          </Switch>
        </Router>
      ) : active ? (
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
            <Route path="/coachProfile">
              <RoutesComp
                AthleteComp={<CoachProfile />}
                CoachComp={<NotFound />}
              />
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
            <Route path="/athlete-history">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteHistory selectedDate={selectedDate} />}
              />
            </Route>
            <Route path="/Athlete/reports">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteStats />}
              />
            </Route>
            <Route path="/Athlete">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteProfile_coach selectedDate={selectedDate} />}
              />
            </Route>
            <Route path="/Athlete/training-assessment">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteTrainingAssessment_coach />}
              ></RoutesComp>
            </Route>
            <Route path="/Athlete/food-and-lifestyle-assessment">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteFoodAndLifestyleAssessment_coach />}
              ></RoutesComp>
            </Route>
            <Route path="/Athlete/anthropometric-measurements">
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
            <Route path="/Athlete/medical-assessment">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AthleteMedicalAssessment_coach />}
              ></RoutesComp>
            </Route>

            <Route path="/uploadvideo">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<VideoUpload />}
              />
            </Route>
            <Route path="/vod">
              <RoutesComp AthleteComp={<NotFound />} CoachComp={<VODHome />} />
            </Route>
            <Route path="/uploaded-videos">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<ViewAllUploadedVideos />}
              />
            </Route>

            <Route path="/assigned-videos">
              <RoutesComp
                AthleteComp={<AthleteAssignedVideos />}
                CoachComp={<ViewAllAssignedVideos />}
              />
            </Route>
            <Route path="/assignvideo">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<AssignVideo />}
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
            <Route path="/view-all-video-workouts">
              <RoutesComp
                AthleteComp={<ViewAllVideoWorkouts />}
                CoachComp={<ViewAllUploadedVideos />}
              />
            </Route>
            <Route path="/my-workouts">
              <RoutesComp
                AthleteComp={<AthleteWorkoutsList />}
                CoachComp={<AthleteWorkoutsList />}
              />
            </Route>
            <Route path="/view-all-saved-workouts">
              <RoutesComp
                AthleteComp={<ViewAllSavedWorkouts />}
                CoachComp={<ViewAllSavedWorkouts />}
              />
            </Route>
            <Route path="/all-saved-LongTerm-workouts">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<ViewAllSavedLongTermWorkouts />}
              />
            </Route>

            <Route path="/all-LongTerm-workouts">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<ViewAllAssignedLongTermWorkouts />}
              />
            </Route>
            <Route path="/all-LongTerm-Nutrition">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<LongTermNutrition />}
              />
            </Route>
            <Route path="/all-saved-LongTerm-Nutrition">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<SavedLongTermNutrition />}
              />
            </Route>
            <Route path="/view-all-past-workouts">
              <RoutesComp
                AthleteComp={<ViewAllPastWorkouts />}
                CoachComp={<NotFound />}
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
                AthleteComp={<AthleteCreateWorkout />}
                CoachComp={<CoachAddWorkout />}
              />
            </Route>
            <Route path="/add-own-workout">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<CreateOwnWorkout />}
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
                AthleteComp={<ViewNutrition />}
                CoachComp={<ViewNutrition />}
              />
            </Route>
            <Route path="/view-all-meal-history">
              <RoutesComp
                AthleteComp={<AthleteMealHistory />}
                CoachComp={<AthleteMealHistory />}
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
            <Route path="/editpayments">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<EditPayments />}
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

            <Route path="/pending-invites">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<InvitesList />}
              />
            </Route>
            <Route path="/invite">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<InviteScreen />}
              />
            </Route>
            <Route path="/print">
              <RoutesComp
                AthleteComp={<NotFound />}
                CoachComp={<PrintPreview />}
              />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </Router>
      ) : (
        <Router>
          <Switch>
            <Route>
              <RoutesComp
                // AthleteComp={<AthleteHome selectedDate={selectedDate} />}
                CoachComp={
                  <DisabledHome
                    selectedDate={selectedDate && selectedDate}
                    reload={setCheckactive}
                    active={checkactive}
                  />
                }
              />
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  );
}

export default App;
