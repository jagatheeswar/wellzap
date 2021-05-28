import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUserData, selectUserType } from "../../features/userSlice";
import "./Sidebar.css";
import SidebarComponent from "./SidebarComponent";

function Sidebar() {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);

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
        <h3>Strength and Conditioning Coach</h3>
        <Link
          className="view-link"
          to={userType === "athlete" ? "/athlete" : "/coach"}
        >
          {" "}
          View Profile
        </Link>
        {userType === "coach" ? (
          <div>
            <SidebarComponent logo="dumbell" name="Workouts" path="workouts" />
            <SidebarComponent logo="hamburger" name="Nutrition" path="nutrition" />
            <SidebarComponent logo="user" name="Athletes" />
            <SidebarComponent logo="calendar" name="Calendar" />
            <SidebarComponent logo="message" name="Messaging" />
            <SidebarComponent logo="settings" name="Settings" />
          </div>
        ) : (
          <div>
            <SidebarComponent logo="dumbell" name="Workout" path="workouts" />
            <SidebarComponent logo="hamburger" name="Nutrition" path="nutrition" />
            <SidebarComponent logo="user" name="Coaches" />
            <SidebarComponent logo="message" name="Messaging" />
            <SidebarComponent logo="calendar" name="Calendar" />
          </div>
        )}
      </div>

      <div className="signout__button">
        <h2>Signout</h2>
      </div>
    </div>
  );
}

export default Sidebar;
