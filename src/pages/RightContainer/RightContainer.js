import React from "react";
import CalendarComponent from "../../Components/Calendar/CalendarComponent";
import Notification from "../../Components/Notifications/Notification";

function RightContainer() {
  return (
    <div className="rightContainer">
      <Notification />
      <h1>Calendar</h1>
    </div>
  );
}

export default RightContainer;
