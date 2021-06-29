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
import SidebarComponent from "./SidebarComponent";

function Sidebar() {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <div className="sidebar">
      <div className="sidebar__container">
        <img
          src={userData?.data?.imageUrl}
          alt={userData?.data.name}
          width="100px"
          height="100px"
        />
        <h1>{userData?.data.name}</h1>
        {userType === "coach" && <h3>Strength and Conditioning Coach</h3>}
        <Link
          className="view-link"
          to={userType === "athlete" ? "/profile" : "/coach"}
          style={{fontFamily: 'Montserrat'}}
        >
          {" "}
          View Profile
        </Link>
        {userType === "coach" ? (
          <div>
            <SidebarComponent logo="Home" name="Home" path="" />
            
            <SidebarComponent logo="dumbell" name="Workouts" path="workouts" />
            <SidebarComponent
              logo="hamburger"
              name="Nutrition"
              path="nutrition"
            />
            <SidebarComponent logo="user" name="Athletes" path="all-athletes" />
            <SidebarComponent logo="calendar" name="Calendar" path="calendar" />
            <SidebarComponent logo="message" name="Messaging" path="chat" />
            <SidebarComponent logo="rupee" name="Payments" path="payments" />
            <SidebarComponent logo="settings" name="Settings" />
          </div>
        ) : (
          <div>
            <SidebarComponent logo="Home" name="Home" path="" />
            <SidebarComponent logo="dumbell" name="Workout" path="workouts" />
            <SidebarComponent
              logo="hamburger"
              name="Nutrition"
              path="nutrition"
            />
            <SidebarComponent logo="user" name="Coaches" />
            <SidebarComponent logo="rupee" name="Payments" path="payments"/>
            <SidebarComponent logo="calendar" name="Calendar" path="calendar"/>
            <SidebarComponent
              logo="message"
              name="Messaging"
              path="messaging"
            />
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
