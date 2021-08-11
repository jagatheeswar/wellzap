import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Calendar, utils } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import "date-fns";
import Axios from "axios";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import SearchableDropdown from "./SearchableDropdown";

import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
} from "../../features/userSlice";
import { db } from "../../utils/firebase";
import firebase from "firebase";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
var win = null;
moment.locale("en-in");

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
      zIndex: 1,
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
    "& .MuiOutlinedInput-input": {
      color: "black",
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "black",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "black",
    },
    "& .MuiInputLabel-outlined": {
      color: "black",
    },
    "&:hover .MuiInputLabel-outlined": {
      color: "black",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "black",
    },
    width: "100%",
  },
});

export default function CreateEvent(props) {
  const classes = useStyles();
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const defaultValue = {
    year: 2021,
    month: 4,
    day: 5,
  };
  const [selectedDay, setSelectedDay] = useState(defaultValue);
  const history = useHistory();
  const [athletes, setAthletes] = useState([]);
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState("17:00");
  const [showVideoLink, setShowVideoLink] = useState(false);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const location = useLocation();
  const [meetURL, setmeetURL] = useState("");
  const [t, sett] = useState(true);
  const [MeetType, setMeetType] = useState("gmeet");
  // useEffect(async () => {
  //   console.log(location);
  //   const queryURL = new URLSearchParams(location.search);
  //   console.log(queryURL.get("code"));
  //   if (queryURL.get("code")) {
  //     console.log(2);
  //     let axiosConfig = {
  //       headers: {
  //         "Content-Type": "application/json;charset=UTF-8",
  //         "Access-Control-Allow-Origin": "*",
  //       },
  //     };

  //     let code = queryURL.get("code");
  //     win?.close();
  //     await Axios.post(
  //       "https://nameless-savannah-17836.herokuapp.com/api/getToken",
  //       {
  //         code: code,
  //       },

  //       axiosConfig
  //     ).then((res) => {
  //       console.log(res);
  //       if (res.data.success) {
  //         db.collection("secrets")
  //           .doc("userData?.id")
  //           .set({ tokens: res.data.tokens });
  //       }
  //     });
  //   }
  // }, []);

  useState(() => {
    if (userData?.id) {
      const data = [];
      var temp = [];
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((athlete) => {
            if (userData?.data.listOfAthletes.includes(athlete.id)) {
              let currentID = athlete.id;
              let appObj = { ...athlete.data(), ["id"]: currentID };
              data.push(appObj);
            }
            if (
              props.athletes &&
              props.athletes.length > 0 &&
              props.athletes.includes(athlete.id)
            ) {
              temp.push({ ...athlete.data(), ["id"]: athlete.id });
            }
          });
          if (temp.length > 0) {
            setSelectedAthletes(temp);
            console.log(temp);
          }
          setAthletes(data);
        });
    }
  }, [userData?.id]);

  useEffect(() => {
    if (props.id && athletes.length > 0) {
      setDescription(props.data.description);
      setEventName(props.data.eventName);
      let now = moment(new Date(props.data.eventDate));
      let today_date = {
        year: now.get("year"),
        month: now.get("month") + 1,
        day: now.get("date"),
      };
      setSelectedDay(today_date);
      setEventTime(moment(new Date(props.data.eventDate)).format("HH:mm"));
      setShowVideoLink(props.data.showVideoLink);
    } else {
      setDescription("");
      setEventName("");
      setEventTime("17:30");
      setShowVideoLink(false);
    }
  }, [props?.id, athletes]);

  const handler = async () => {
    if (eventName && selectedAthletes != []) {
      var local_athletes = [];
      var local_token = [];
      selectedAthletes.forEach((id) => {
        local_athletes.push(id.id);
        if (id?.token && id.token != "") {
          local_token.push(id?.token);
        }
      });

      if (props?.id) {
        alert(eventName);

        db.collection("events")
          .doc(props.id)
          .update({
            eventName,
            date: firebase.firestore.Timestamp.fromDate(
              new Date(
                selectedDay.year,
                selectedDay.month - 1,
                selectedDay.day,
                eventTime.substring(0, 2),
                eventTime.substring(3, 5),
                0,
                0
              )
            ),
            description,
            athletes: local_athletes,
            coachID: userData.id,
            showVideoLink,
            videolink: userData?.data?.videolink,
          })
          .then(() => {
            props.setAddedEventFunc();
            alert("Event Updated");
          });
      } else {
        db.collection("secrets")
          .doc(userData?.id)
          .get()
          .then(async (snap) => {
            if (!snap.exists) {
              console.log(11222);
              const data = Axios.get(
                "https://nameless-savannah-17836.herokuapp.com/api/gmeet"
              ).then((res) => {
                console.log(res.data.url);
                if (res?.data?.url) {
                  let url = res?.data?.url;

                  // window.location.href = url;
                  // win?.close();
                  win = window.open(url, "win1", "width = 500, height = 300");
                  var pollTimer = window.setInterval(async function () {
                    try {
                      console.log(win.document.URL);

                      const queryURL = new URL(win.document.URL);

                      var url = queryURL.searchParams.get("code");
                      if (queryURL.searchParams.get("code")) {
                        window.clearInterval(pollTimer);
                        let axiosConfig = {
                          headers: {
                            "Content-Type": "application/json;charset=UTF-8",
                            "Access-Control-Allow-Origin": "*",
                          },
                        };

                        let code = url;
                        console.log(code);
                        win?.close();
                        await Axios.post(
                          "https://nameless-savannah-17836.herokuapp.com/api/getToken",
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
                                if (eventName && selectedAthletes != []) {
                                  let data = res.data.tokens;

                                  let axiosConfig = {
                                    headers: {
                                      "Content-Type":
                                        "application/json;charset=UTF-8",
                                      "Access-Control-Allow-Origin": "*",
                                    },
                                  };

                                  console.log(data);
                                  await Axios.post(
                                    "https://nameless-savannah-17836.herokuapp.com/api/gmeet/getLink",
                                    {
                                      tokens: data,
                                      eventdata: {
                                        eventname: eventName,
                                        description: description,
                                        videoConference: MeetType === "gmeet",
                                        date: firebase.firestore.Timestamp.fromDate(
                                          new Date(
                                            selectedDay.year,
                                            selectedDay.month - 1,
                                            selectedDay.day,
                                            eventTime.substring(0, 2),
                                            eventTime.substring(3, 5),
                                            0,
                                            0
                                          )
                                        ),
                                        start:
                                          firebase.firestore.Timestamp.fromDate(
                                            new Date(
                                              selectedDay.year,
                                              selectedDay.month - 1,
                                              selectedDay.day,
                                              eventTime.substring(0, 2) + 1,
                                              eventTime.substring(3, 5),
                                              0,
                                              0
                                            )
                                          ),
                                      },
                                    },

                                    axiosConfig
                                  ).then(async (out) => {
                                    console.log(out);
                                    if (out.data.success) {
                                      setmeetURL(
                                        out.data.event.data.hangoutLink
                                      );
                                      //setShowVideoLink(!showVideoLink);
                                      const newCityRef = db
                                        .collection("events")
                                        .doc();
                                      const res = await newCityRef
                                        .set({
                                          name: eventName,
                                          date: firebase.firestore.Timestamp.fromDate(
                                            new Date(
                                              selectedDay.year,
                                              selectedDay.month - 1,
                                              selectedDay.day,
                                              eventTime.substring(0, 2),
                                              eventTime.substring(3, 5),
                                              0,
                                              0
                                            )
                                          ),
                                          description: description,
                                          athletes: local_athletes,
                                          coachID: userData.id,
                                          showVideoLink: showVideoLink,

                                          videolink: showVideoLink
                                            ? MeetType == "gmeet"
                                              ? out.data?.event?.data
                                                  ?.hangoutLink
                                              : "https://meet.jit.si/wellzap-" +
                                                `${userData.data.pin}`
                                            : "",
                                        })
                                        .then(() => {
                                          props.setAddedEventFunc();
                                          alert("Event Added");
                                          setEventName("");
                                          setEventTime("17:30");
                                          setAthletes([]);
                                          setDescription("");
                                        });
                                    } else {
                                      alert("pleas try again later");
                                    }
                                  });
                                }
                              });
                          }
                        });
                        win.close();
                      }
                    } catch (err) {
                      console.log(err);
                    }
                  }, 1000);

                  //history.push();
                }
              });
            } else {
              let data = snap.data().tokens;
              if (eventName && selectedAthletes != []) {
                let axiosConfig = {
                  headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin": "*",
                  },
                };

                console.log(data);
                await Axios.post(
                  "https://nameless-savannah-17836.herokuapp.com/api/gmeet/getLink",
                  {
                    tokens: data,
                    eventdata: {
                      eventname: eventName,
                      description: description,
                      videoConference: MeetType === "gmeet",

                      date: firebase.firestore.Timestamp.fromDate(
                        new Date(
                          selectedDay.year,
                          selectedDay.month - 1,
                          selectedDay.day,
                          eventTime.substring(0, 2),
                          eventTime.substring(3, 5),
                          0,
                          0
                        )
                      ),
                      start: firebase.firestore.Timestamp.fromDate(
                        new Date(
                          selectedDay.year,
                          selectedDay.month - 1,
                          selectedDay.day,
                          eventTime.substring(0, 2) + 1,
                          eventTime.substring(3, 5),
                          0,
                          0
                        )
                      ),
                    },
                  },

                  axiosConfig
                ).then(async (out) => {
                  if (out.data?.success) {
                    console.log(out);
                    setmeetURL(out.data?.event?.data?.hangoutLink);
                    //setShowVideoLink(!showVideoLink);
                    const newCityRef = db.collection("events").doc();
                    const res1 = await newCityRef
                      .set({
                        name: eventName,
                        date: firebase.firestore.Timestamp.fromDate(
                          new Date(
                            selectedDay.year,
                            selectedDay.month - 1,
                            selectedDay.day,
                            eventTime.substring(0, 2),
                            eventTime.substring(3, 5),
                            0,
                            0
                          )
                        ),
                        description: description,
                        athletes: local_athletes,
                        coachID: userData.id,
                        showVideoLink: showVideoLink,

                        videolink: showVideoLink
                          ? MeetType == "gmeet"
                            ? out.data?.event?.data?.hangoutLink
                            : "https://meet.jit.si/wellzap-" +
                              `${userData.data.pin}`
                          : "",
                      })
                      .then(() => {
                        props.setAddedEventFunc();
                        alert("Event Added");
                        setEventName("");
                        setEventTime("17:30");
                        setAthletes([]);
                        setDescription("");
                      });
                  } else {
                    const data = Axios.get(
                      "https://nameless-savannah-17836.herokuapp.com/api/gmeet"
                    ).then((res) => {
                      console.log(res.data);
                      if (res?.data?.url) {
                        let url = res?.data?.url;
                        win = window.open(
                          url,
                          "win1",
                          "width = 500, height = 300"
                        );
                        var pollTimer = window.setInterval(async function () {
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
                                "https://nameless-savannah-17836.herokuapp.com/api/getToken",
                                {
                                  code: code.toString(),
                                },

                                axiosConfig
                              ).then((res) => {
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
                                          "Access-Control-Allow-Origin": "*",
                                        },
                                      };

                                      console.log(data);
                                      await Axios.post(
                                        "https://nameless-savannah-17836.herokuapp.com/api/gmeet/getLink",
                                        {
                                          tokens: data,
                                          eventdata: {
                                            eventname: eventName,
                                            description: description,
                                            videoConference:
                                              MeetType === "gmeet",

                                            date: firebase.firestore.Timestamp.fromDate(
                                              new Date(
                                                selectedDay.year,
                                                selectedDay.month - 1,
                                                selectedDay.day,
                                                eventTime.substring(0, 2),
                                                eventTime.substring(3, 5),
                                                0,
                                                0
                                              )
                                            ),
                                            start:
                                              firebase.firestore.Timestamp.fromDate(
                                                new Date(
                                                  selectedDay.year,
                                                  selectedDay.month - 1,
                                                  selectedDay.day,
                                                  eventTime.substring(0, 2) + 1,
                                                  eventTime.substring(3, 5),
                                                  0,
                                                  0
                                                )
                                              ),
                                          },
                                        },

                                        axiosConfig
                                      ).then(async (out) => {
                                        console.log(out);
                                        if (out.data.success) {
                                          setmeetURL(
                                            out.data.event.data.hangoutLink
                                          );
                                          //setShowVideoLink(!showVideoLink);
                                          const newCityRef = db
                                            .collection("events")
                                            .doc();
                                          const res = await newCityRef
                                            .set({
                                              name: eventName,
                                              date: firebase.firestore.Timestamp.fromDate(
                                                new Date(
                                                  selectedDay.year,
                                                  selectedDay.month - 1,
                                                  selectedDay.day,
                                                  eventTime.substring(0, 2),
                                                  eventTime.substring(3, 5),
                                                  0,
                                                  0
                                                )
                                              ),
                                              description: description,
                                              athletes: local_athletes,
                                              coachID: userData.id,
                                              showVideoLink: showVideoLink,

                                              videolink: showVideoLink
                                                ? MeetType == "gmeet"
                                                  ? out.data?.event?.data
                                                      ?.hangoutLink
                                                  : "https://meet.jit.si/wellzap-" +
                                                    `${userData.data.pin}`
                                                : "",
                                            })
                                            .then(() => {
                                              props.setAddedEventFunc();
                                              alert("Event Added");
                                              setEventName("");
                                              setEventTime("17:30");
                                              setAthletes([]);
                                              setDescription("");
                                            });
                                        } else {
                                          alert("pleas try again later");
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
                        }, 1000);
                        //history.push();
                      }
                    });
                  }
                });
              }
            }
          });
      }
    } else {
      alert("Pls enter all fields");
    }
  };

  useEffect(() => {
    let now = moment();
    let today_date = {
      year: now.get("year"),
      month: now.get("month") + 1,
      day: now.get("date"),
    };
    setSelectedDay(today_date);
  }, [props?.id]);

  return (
    <div style={{ flex: 1, width: "90%" }}>
      <p>{props?.id ? "Edit Event" : "Create Event"}</p>
      <TextField
        label="Event Name"
        variant="outlined"
        className={classes.root}
        color="black"
        value={eventName}
        required
        onChange={(event) => {
          const { value } = event.target;
          setEventName(value);
        }}
      />

      <p style={{ fontSize: 18, marginTop: 20 }}>Event Date *</p>
      <Calendar
        value={selectedDay}
        onChange={setSelectedDay}
        colorPrimary="#ffe486" // added this
        colorPrimaryLight="blue"
        calendarClassName="customcalendarAddGoal" // and this
        minimumDate={utils().getToday()}
      />
      <TextField
        id="time"
        label="Select Time"
        type="time"
        defaultValue="07:30"
        style={{ width: "100%" }}
        inputProps={{
          step: 300, // 5 min
        }}
        value={eventTime}
        onChange={(event) => {
          const { value } = event.target;
          setEventTime(value);
        }}
      />

      <div
        style={{
          marginTop: 20,
          width: "100%",
          zIndex: "2",
          position: "relative",
        }}
      >
        <SearchableDropdown
          name="Select Athletes"
          list={athletes}
          state={selectedAthletes}
          setState={setSelectedAthletes}
        />
      </div>

      <TextField
        label="Event Description"
        variant="outlined"
        color="black"
        value={description}
        required
        multiline
        rows={4}
        style={{ marginTop: 20 }}
        className={classes.root}
        onChange={(event) => {
          const { value } = event.target;
          setDescription(value);
        }}
      />
      <button
        onClick={() => {
          // setShowVideoLink(!showVideoLink)
          // db.collection("secrets")
          //   .doc("userData.id")
          //   .get()
          //   .then(async (snap) => {
          //     if (!snap.exists) {
          //       console.log(11222);
          //       const data = Axios.get("https://nameless-savannah-17836.herokuapp.com/api/gmeet").then(
          //         (res) => {
          //           console.log(res.data.url);
          //           if (res?.data?.url) {
          //             let url = res?.data?.url;
          //             // window.location.href = url;
          //             // win?.close();
          //             win = window.open(
          //               url,
          //               "win1",
          //               "width = 500, height = 300"
          //             );
          //             var pollTimer = window.setInterval(async function () {
          //               try {
          //                 console.log(win.document.URL);
          //                 const queryURL = new URL(win.document.URL);
          //                 var url = queryURL.searchParams.get("code");
          //                 if (queryURL.searchParams.get("code")) {
          //                   window.clearInterval(pollTimer);
          //                   let axiosConfig = {
          //                     headers: {
          //                       "Content-Type":
          //                         "application/json;charset=UTF-8",
          //                       "Access-Control-Allow-Origin": "*",
          //                     },
          //                   };
          //                   let code = url;
          //                   console.log(code);
          //                   win?.close();
          //                   await Axios.post(
          //                     "https://nameless-savannah-17836.herokuapp.com/api/getToken",
          //                     {
          //                       code: code.toString(),
          //                     },
          //                     axiosConfig
          //                   ).then((res) => {
          //                     console.log(res);
          //                     if (res.data.success) {
          //                       db.collection("secrets")
          //                         .doc("userData.id")
          //                         .set({ tokens: res.data.tokens });
          //                     }
          //                   });
          //                   win.close();
          //                 }
          //               } catch (err) {
          //                 console.log(err);
          //               }
          //             }, 1000);
          //             //history.push();
          //           }
          //         }
          //       );
          //     } else {
          //       let data = snap.data().tokens;
          //       let axiosConfig = {
          //         headers: {
          //           "Content-Type": "application/json;charset=UTF-8",
          //           "Access-Control-Allow-Origin": "*",
          //         },
          //       };
          //       console.log(data);
          //       await Axios.post(
          //         "https://nameless-savannah-17836.herokuapp.com/api/gmeet/getLink",
          //         {
          //           tokens: data,
          //         },
          //         axiosConfig
          //       ).then((res) => {
          //         console.log(res);
          //         if (res.data.success) {
          //           console.log(res);
          //           setmeetURL(res.data.event.data.hangoutLink);
          //           setShowVideoLink(!showVideoLink);
          //         } else {
          //           const data = Axios.get(
          //             "https://nameless-savannah-17836.herokuapp.com/api/gmeet"
          //           ).then((res) => {
          //             console.log(res.data);
          //             if (res?.data?.url) {
          //               let url = res?.data?.url;
          //               window.location.href = url;
          //               //history.push();
          //             }
          //           });
          //         }
          //       });
          //     }
          //   });
        }}
        style={{
          borderRadius: 5,
          marginTop: 20,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "black",
          padding: 10,
          width: "100%",
          backgroundColor: showVideoLink && "#ffde46",

          cursor: "pointer",
        }}
      >
        <p
          style={{
            fontSize: 14,
            color: "black",
            textAlign: "center",
            margin: 0,
            padding: 0,
          }}
          onClick={() => {
            setShowVideoLink(!showVideoLink);
          }}
        >
          {!showVideoLink
            ? "Add Video Conferencing"
            : "Remove Video Conferencing"}
        </p>
      </button>
      {showVideoLink ? (
        <div onClick={() => {}} style={{ marginTop: 0 }}>
          <p
            style={{
              fontSize: 16,
              color: "#006D77",
              margin: 0,
              padding: 0,
            }}
          >
            {/* https://meet.jit.si/wellzap-{userData.data.pin} */}
            {meetURL}
          </p>
        </div>
      ) : null}
      {showVideoLink && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",

            marginTop: 20,
          }}
        >
          <div>Meet Type</div>
          <div>
            <input
              onChange={(e) => {
                setMeetType(e.target.value);
                console.log(e.target.value);
              }}
              type="radio"
              name="meet_type"
              value="gmeet"
              checked={MeetType == "gmeet"}
            />
            <label>GoogleMeet</label>

            <br />
            <input
              type="radio"
              onChange={(e) => {
                setMeetType(e.target.value);
                console.log(e.target.value);
              }}
              name="meet_type"
              value="jitsy"
              checked={MeetType == "jitsy"}
            />
            <label>Jitsy</label>
          </div>
        </div>
      )}

      <div
        onClick={async () => {
          handler();
          // if (showVideoLink) {
          //   handler();
          // } else {
          //   if (eventName && selectedAthletes != []) {
          //     var local_athletes = [];
          //     var local_token = [];
          //     selectedAthletes.forEach((id) => {
          //       local_athletes.push(id.id);
          //       if (id?.token && id.token != "") {
          //         local_token.push(id?.token);
          //       }
          //     });

          //     if (props?.id) {
          //       alert(eventName);

          //       db.collection("events")
          //         .doc(props.id)
          //         .update({
          //           eventName,
          //           date: firebase.firestore.Timestamp.fromDate(
          //             new Date(
          //               selectedDay.year,
          //               selectedDay.month - 1,
          //               selectedDay.day,
          //               eventTime.substring(0, 2),
          //               eventTime.substring(3, 5),
          //               0,
          //               0
          //             )
          //           ),
          //           description,
          //           athletes: local_athletes,
          //           coachID: userData.id,
          //           showVideoLink,
          //           videolink: userData?.data?.videolink,
          //         })
          //         .then(() => {
          //           props.setAddedEventFunc();
          //           alert("Event Updated");
          //         });
          //     } else {
          //       const newCityRef = db.collection("events").doc();
          //       const res = await newCityRef
          //         .set({
          //           name: eventName,
          //           date: firebase.firestore.Timestamp.fromDate(
          //             new Date(
          //               selectedDay.year,
          //               selectedDay.month - 1,
          //               selectedDay.day,
          //               eventTime.substring(0, 2),
          //               eventTime.substring(3, 5),
          //               0,
          //               0
          //             )
          //           ),
          //           description: description,
          //           athletes: local_athletes,
          //           coachID: userData.id,
          //           showVideoLink: showVideoLink,
          //           videolink: userData?.data?.videolink,
          //         })
          //         .then(() => {
          //           props.setAddedEventFunc();
          //           alert("Event Added");
          //           setEventName("");
          //           setEventTime("17:30");
          //           setAthletes([]);
          //           setDescription("");
          //         });
          //     }
          //   } else {
          //     alert("please enter all fields");
          //   }
          // }
        }}
        style={{
          backgroundColor: "#ffe486",
          borderRadius: 10,
          padding: 10,
          marginTop: 20,
        }}
      >
        <p
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "black",
            alignSelf: "center",
            margin: 0,
            padding: 0,
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          {props?.id ? "Edit Event" : "Add Event"}
        </p>
      </div>
    </div>
  );
}
