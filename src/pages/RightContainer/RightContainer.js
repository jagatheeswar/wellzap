import React, { createContext } from "react";
import CalendarComponent from "../../Components/Calendar/CalendarComponent";
import Notification from "../../Components/Notifications/Notification";
import AthleteNotifications from "../../Components/Notifications/AthleteNotifications";
import Calendar_ from "./Calendar";
import Calendar_coach from "./Calendar_coach";
import { useDispatch, useSelector } from "react-redux";
import "./RightContainer.css";
import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
} from "../../features/userSlice";

import { date } from "yup/lib/locale";
import moment from "moment";
function areEqual(prevProps, nextProps) {
  // only update if a card was added or removed
  //console.log("ass", prevProps, nextProps);
  alert(1);
  return (
    moment(prevProps.selectedDate).format("yyyy-MM-dd").toString() ===
    moment(nextProps.selectedDate).format("yyyy-MM-dd").toString()
  );
}

function RightContainer(props) {
  const userType = useSelector(selectUserType);
  //props.toggle_date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="rightContainer">
      {userType == "coach" ? <Notification /> : <AthleteNotifications />}

      {userType == "coach" ? (
        <Calendar_coach
          toggle_date={props.toggle_date}
          selectedDate={props.selectedDate ? props.selectedDate : new Date()}
        />
      ) : (
        // <Calendar_
        //   toggle_date={props.toggle_date}
        //   selectedDate={props.selectedDate ? props.selectedDate : new Date()}
        // />
        <></>
      )}

      {/* <CalendarComponent /> */}
    </div>
  );
}

export default React.memo(
  RightContainer,
  (prevProps, nextProps) =>
    prevProps.selectedDate.date === nextProps.selectedDate.date
);
