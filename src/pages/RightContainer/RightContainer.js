import React from "react";
import CalendarComponent from "../../Components/Calendar/CalendarComponent";
import Notification from "../../Components/Notifications/Notification";
import Calendar_ from "./Calendar";
import Calendar_coach from "./Calendar_coach";
import { useSelector } from "react-redux";
import { selectUserType } from "../../features/userSlice";
function RightContainer() {
  const userType = useSelector(selectUserType);
  console.log(userType);
  return (
    <div className="rightContainer">
      <Notification />
      <h1>Calendar</h1>
      {userType == "coach" ? <Calendar_coach /> : <Calendar_ />}

      {/* <CalendarComponent /> */}
    </div>
  );
}

export default RightContainer;
