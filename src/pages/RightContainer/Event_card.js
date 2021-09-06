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
import Axios from "axios";
import "./Calendar.css";
import "../../responsive.css"
import InsertInvitationIcon from "@material-ui/icons/InsertInvitation";
var win = "";

function Event_card(props) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  var events = props.data;
  let eventslength = events.length;

  if (events.length > props.count) {
    var events = events.slice(0, props.count);
  }

  return (
    <div >
      {events.map((item) => {
        return (
          <div  className="eachevent" key={item.id}>
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
                width: 300,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <i
                  class="fa fa-circle"
                  style={{ fontSize: 10, marginRight: 8 }}
                ></i>
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
                    {item.eventName && item.eventName}
                  </div>
                  <div className="upcoming_event_time" style={{ fontSize: 13 }}>
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
              </div>{" "}
              {userType == "athlete" && (
                <div
                  className="tooltip"
                  onClick={() => {
                    db.collection("secrets")
                      .doc(userData?.id)
                      .get()
                      .then(async (snap) => {
                        console.log(snap.exists);
                        if (!snap.exists) {
                          console.log(11222);
                          const data = Axios.get(
                            "http://localhost:3000/api/gmeet"
                          ).then((res) => {
                            console.log(res.data.url);
                            if (res?.data?.url) {
                              let url = res?.data?.url;

                              // window.location.href = url;
                              // win?.close();
                              win = window.open(
                                url,
                                "win1",
                                "width = 500, height = 300"
                              );
                              var pollTimer = window.setInterval(
                                async function () {
                                  try {
                                    console.log(win.document.URL);

                                    const queryURL = new URL(win.document.URL);

                                    var url = queryURL.searchParams.get("code");
                                    if (queryURL.searchParams.get("code")) {
                                      window.clearInterval(pollTimer);
                                      let axiosConfig = {
                                        headers: {
                                          "Content-Type":
                                            "application/json;charset=UTF-8",
                                          "Access-Control-Allow-Origin": "*",
                                        },
                                      };

                                      let code = url;
                                      console.log(code);
                                      win?.close();
                                      await Axios.post(
                                        "http://localhost:3000/api/getToken",
                                        {
                                          code: code.toString(),
                                        },

                                        axiosConfig
                                      ).then(async (res) => {
                                        console.log(res);
                                        if (res.data.success) {
                                          db.collection("secrets")
                                            .doc(userData?.id)
                                            .set({ tokens: res.data.tokens })
                                            .then(async () => {
                                              let data = res.data.tokens;

                                              let axiosConfig = {
                                                headers: {
                                                  "Content-Type":
                                                    "application/json;charset=UTF-8",
                                                  "Access-Control-Allow-Origin":
                                                    "*",
                                                },
                                              };

                                              console.log(data);
                                              await Axios.post(
                                                "http://localhost:3000/api/addToCalendar",
                                                {
                                                  tokens: data,
                                                  eventdata: {
                                                    eventname: item.eventName,
                                                    description:
                                                      item.showVideoLink
                                                        ? item.videolink
                                                        : "",
                                                    date: item.eventDate,
                                                  },
                                                },

                                                axiosConfig
                                              ).then(async (out) => {
                                                console.log(out);
                                                if (out.data.success) {
                                                } else {
                                                  alert(
                                                    "pleas try again later"
                                                  );
                                                }
                                              });
                                            });
                                        }
                                      });
                                      win.close();
                                    }
                                  } catch (err) {
                                    console.log(err);
                                  }
                                },
                                1000
                              );

                              //history.push();
                            }
                          });
                        } else {
                          let data = snap.data().tokens;

                          let axiosConfig = {
                            headers: {
                              "Content-Type": "application/json;charset=UTF-8",
                              "Access-Control-Allow-Origin": "*",
                            },
                          };

                          console.log(item);
                          await Axios.post(
                            "http://localhost:3000/api/addToCalendar",
                            {
                              tokens: data,
                              eventdata: {
                                eventname: item.eventName,
                                description: item.showVideoLink
                                  ? item.videolink
                                  : "",
                                date: item.eventDate,
                              },
                            },

                            axiosConfig
                          ).then(async (res) => {
                            console.log(res);
                            if (res.data.success) {
                              alert("added to calendar");
                            } else {
                              const data = Axios.get(
                                "http://localhost:3000/api/gmeet"
                              ).then((res) => {
                                console.log(res.data);
                                if (res?.data?.url) {
                                  let url = res?.data?.url;
                                  win = window.open(
                                    url,
                                    "win1",
                                    "width = 500, height = 300"
                                  );
                                  var pollTimer = window.setInterval(
                                    async function () {
                                      try {
                                        console.log(win.document.URL);

                                        const queryURL = new URL(
                                          win.document.URL
                                        );

                                        var url =
                                          queryURL.searchParams.get("code");
                                        if (queryURL.searchParams.get("code")) {
                                          window.clearInterval(pollTimer);
                                          let axiosConfig = {
                                            headers: {
                                              "Content-Type":
                                                "application/json;charset=UTF-8",
                                              "Access-Control-Allow-Origin":
                                                "*",
                                            },
                                          };

                                          let code = url;
                                          console.log(code);
                                          win?.close();
                                          await Axios.post(
                                            "http://localhost:3000/api/getToken",
                                            {
                                              code: code.toString(),
                                            },

                                            axiosConfig
                                          ).then((res) => {
                                            console.log(res);
                                            if (res.data.success) {
                                              db.collection("secrets")
                                                .doc(userData?.id)
                                                .set({
                                                  tokens: res.data.tokens,
                                                })
                                                .then(async () => {
                                                  let data = res.data.tokens;

                                                  let axiosConfig = {
                                                    headers: {
                                                      "Content-Type":
                                                        "application/json;charset=UTF-8",
                                                      "Access-Control-Allow-Origin":
                                                        "*",
                                                    },
                                                  };

                                                  console.log(data);
                                                  await Axios.post(
                                                    "http://localhost:3000/api/addToCalendar",
                                                    {
                                                      tokens: data,
                                                      eventdata: {
                                                        eventname:
                                                          item.eventName,
                                                        description:
                                                          item.showVideoLink
                                                            ? item.videolink
                                                            : "",
                                                        date: item.eventDate,
                                                      },
                                                    },

                                                    axiosConfig
                                                  ).then(async (out) => {
                                                    console.log(out);
                                                    if (out.data.success) {
                                                      alert(
                                                        "added to calendar"
                                                      );
                                                    } else {
                                                      alert(
                                                        "pleas try again later"
                                                      );
                                                    }
                                                  });
                                                });
                                            }
                                          });
                                          win.close();
                                        }
                                      } catch (err) {
                                        console.log(err);
                                        // alert("please try again later");
                                      }
                                    },
                                    1000
                                  );
                                }
                              });
                            }
                          });
                        }
                        // let data = res.data().tokens;
                        // console.log(data);
                        // let axiosConfig = {
                        //   headers: {
                        //     "Content-Type": "application/json;charset=UTF-8",
                        //     "Access-Control-Allow-Origin": "*",
                        //   },
                        // };
                        // Axios.post(
                        //   "http://localhost:3000/api/addToCalendar",
                        //   {
                        //     tokens: data,
                        //   },
                        //   axiosConfig
                        // ).then((dat) => {
                        //   console.log(dat);
                        // });
                      });
                  }}
                >
                  <InsertInvitationIcon />
                  <span class="tooltiptext">Add to Calendar</span>
                </div>
              )}
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
                <span
                id="timespan"
                  style={{ cursor: "pointer", textDecoration: "underline",marginBottom:'40px' }}
                  onClick={() =>
                    window.open(item.showVideoLink && item.videolink)
                  }
                >
                  {item.showVideoLink && item.videolink}
                
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Event_card;
