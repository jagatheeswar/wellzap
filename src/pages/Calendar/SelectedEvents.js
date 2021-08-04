import React from "react";
import moment from "moment";
import { db } from "../../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
} from "../../features/userSlice";
import firebase from "firebase";

function SelectedEvents(props) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  var events = props.data;
  var dates = props.dates;
  let eventslength = events.length;

  if (events.length > props.count) {
    var events = events.slice(0, props.count);
  }
  console.log("sss,", events, dates);
  return (
    <div style={{ width: "100%" }}>
      {dates.map((item) => {
        return (
          <div style={{}}>
            <div
              className=""
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => {
                props.setEventInfoData(events[item]);
                props.setsidebarfunc("goals");
                setTimeout(function () {
                  props.setsidebarfunc("eventInfo");
                }, 500);
              }}
            >
              <div
                style={{
                  display: "flex",

                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className="upcoming_event_title"
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      marginBottom: 3,
                      borderWidth: 1,
                      borderColor: "red",
                    }}
                  >
                    <i
                      class="fa fa-circle"
                      style={{ fontSize: 10, marginRight: 8 }}
                    ></i>
                    {events[item].eventName && events[item].eventName}
                  </div>
                  <div
                    className="upcoming_event_time"
                    style={{ fontSize: 13, marginLeft: 20 }}
                  >
                    {events[item].eventDate &&
                      moment(events[item].eventDate).format("LL")}
                  </div>
                </div>
              </div>
              <div className="upcoming_event_right">
                <button
                  style={{
                    height: 25,
                    backgroundColor: "#ffe486",
                    color: "black",
                  }}
                >
                  {events[item].eventDate &&
                    moment(events[item].eventDate).format("LT")}
                </button>
                {moment(new Date()).valueOf() >
                  events[item].eventDate - 60000 * 20 &&
                moment(new Date()).format("DD-MM-YYYY") ==
                  moment(events[item].eventDate).format("DD-MM-YYYY") ? (
                  <a
                    style={{ cursor: "pointer" }}
                    href={events[item].showVideoLink && events[item].videolink}
                  >
                    <button
                      style={{
                        height: 25,
                        backgroundColor: "#ffe486",
                        color: "black",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (userType == "athlete") {
                          db.collection("events")
                            .doc(events[item].id)
                            .update({
                              attendance:
                                firebase.firestore.FieldValue.arrayUnion(
                                  userData.id
                                ),
                            });
                        }
                      }}
                    >
                      Join now
                    </button>{" "}
                  </a>
                ) : null}
              </div>
            </div>
            <div style={{ marginLeft: 20 }}>
              {moment(new Date()).valueOf() >
                events[item].eventDate - 60000 * 20 &&
              moment(new Date()).format("DD-MM-YYYY") ==
                moment(events[item].eventDate).format("DD-MM-YYYY") ? (
                <a
                  style={{ textDecoration: "none" }}
                  onClick={() => {
                    if (userType == "athlete") {
                      db.collection("events")
                        .doc(events[item].id)
                        .update({
                          attendance: firebase.firestore.FieldValue.arrayUnion(
                            userData.id
                          ),
                        });
                    }
                  }}
                  href={events[item].showVideoLink && events[item].videolink}
                >
                  {events[item].showVideoLink && events[item].videolink}
                </a>
              ) : (
                events[item].showVideoLink && events[item].videolink
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SelectedEvents;
