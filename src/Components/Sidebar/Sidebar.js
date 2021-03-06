import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  logout,
  selectUserData,
  selectUserType,
} from "../../features/userSlice";
import { auth } from "../../utils/firebase";
import "./Sidebar.css";
import "../../responsive.css"
import SidebarComponent from "./SidebarComponent";

function Sidebar({ show_menu }) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const history = useHistory();
  console.log(show_menu);

  return (
    <div className="sidebar">
      <div className="sidebar__container">
        <img
          src={
            userData?.data?.imageUrl
              ? userData?.data?.imageUrl
              : "https://firebasestorage.googleapis.com/v0/b/wellzap-22b06.appspot.com/o/images%2FuserImage.jpeg?alt=media&token=92ce4f61-3c75-421a-888f-df954a58c516"
          }
          alt={userData?.data.name}
          width="100px"
          height="100px"
          onClick={() => history.push("/profile")}
          style={{ cursor: "pointer" }}
        />
        <h1>{userData?.data.name}</h1>
        {userType === "coach" && <h3>Strength and Conditioning Coach</h3>}
        <Link
          className="view-link"
          to="/profile"
          // to={userType === "athlete" ? "/profile" : "/profile"}
          style={{ fontFamily: "Montserrat" }}
        >
          {" "}
          View Profile
        </Link>
        {userType === "coach" ? (
          show_menu && (
            <div id="scrolldiv">
              <SidebarComponent logo="Home" name="Home" path="" />

              <SidebarComponent
                logo="dumbell"
                name="Workouts"
                path="workouts"
              />
              <SidebarComponent
                disabled={true}
                logo="hamburger"
                name="Nutrition"
                path="nutrition"
              />
              <SidebarComponent logo="play" name="VOD" path="vod" />
              <SidebarComponent
                logo="user"
                name="Athletes"
                path="all-athletes"
              />
              {/* <SidebarComponent logo="calendar" name="Calendar" path="calendar" /> */}
              <SidebarComponent logo="message" name="Messaging" path="chat" />
              <SidebarComponent logo="rupee" name="Payments" path="payments" />
              <SidebarComponent logo="settings" name="Support" />
            </div>
          )
        ) : (
          <div>
            <SidebarComponent logo="Home" name="Home" path="" />
            <SidebarComponent logo="dumbell" name="Workout" path="workouts" />
            <SidebarComponent
              logo="hamburger"
              name="Nutrition"
              path="nutrition"
            />
            <SidebarComponent logo="user" name="Coaches" path="coachProfile" />
            <SidebarComponent logo="rupee" name="Payments" path="payments" />
            {/* <SidebarComponent logo="calendar" name="Calendar" path="calendar"/> */}
            <SidebarComponent
              logo="message"
              name="Messaging"
              path="messaging"
            />
            <SidebarComponent logo="settings" name="Support" />
          </div>
        )}
      </div>

      <div
        className="signout__button"
        onClick={() => {
          auth.signOut();
          dispatch(logout());
          history.push("/");
        }}
      >
        <h2>Signout</h2>
      </div>
    </div>
  );
}

export default Sidebar;
