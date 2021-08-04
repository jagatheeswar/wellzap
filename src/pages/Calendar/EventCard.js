import React, { useEffect } from "react";
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

function EventCard(props) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);

  var events = props.data;
  let eventslength = events.length;

  if (events.length > props.count) {
    var events = events.slice(0, props.count);
  }

  return (
    <div style={{ width: "100%" }}>
      {events.map((item) => {
        return (
          <div style={{}}>
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
                cursor: "pointer",
              }}
              onClick={() => {
                props.setEventInfoData(item);
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
                    }}
                  >
                    <i
                      class="fa fa-circle"
                      style={{ fontSize: 10, marginRight: 8 }}
                    ></i>
                    {item.eventName && item.eventName}
                  </div>
                  <div
                    className="upcoming_event_time"
                    style={{ fontSize: 13, marginLeft: 20 }}
                  >
                    {item.eventDate && moment(item.eventDate).format("LL")}
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
                  {item.eventDate && moment(item.eventDate).format("LT")}
                </button>
                {moment(new Date()).valueOf() > item.eventDate - 60000 * 20 ? (
                  <a
                    style={{ cursor: "pointer" }}
                    href={item.showVideoLink && item.videolink}
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
                            .doc(item.id)
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
              {moment(new Date()).valueOf() > item.eventDate - 60000 * 20 ? (
                <a
                  style={{ textDecoration: "none" }}
                  onClick={() => {
                    if (userType == "athlete") {
                      db.collection("events")
                        .doc(item.id)
                        .update({
                          attendance: firebase.firestore.FieldValue.arrayUnion(
                            userData.id
                          ),
                        });
                    }
                  }}
                  href={item.showVideoLink && item.videolink}
                >
                  {item.showVideoLink && item.videolink}
                </a>
              ) : (
                item.showVideoLink && item.videolink
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default EventCard;
