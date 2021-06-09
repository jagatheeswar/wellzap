import React from "react";
import CalendarComponent from "../../Components/Calendar/CalendarComponent";
import Notification from "../../Components/Notifications/Notification";
import AthleteNotifications from "../../Components/Notifications/AthleteNotifications"
import Calendar_ from "./Calendar";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
} from "../../features/userSlice";

function RightContainer() {
  const userType = useSelector(selectUserType);

  return (
    <div className="rightContainer">
      {userType == "coach" ?<Notification /> : <AthleteNotifications />}

      <Calendar_ />
      {/* <CalendarComponent /> */}
    </div>
  );
}

export default RightContainer;
