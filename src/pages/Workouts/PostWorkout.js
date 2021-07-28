import React from "react";

import { useState, useEffect } from "react";

import { db } from "../../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import DatePicker from "react-datepicker";
import "./Postworkout.css";
import firebase from "firebase";
import Icon from "@material-ui/core/Icon";
import moment from "moment";
import { useLocation } from "react-router";
import { DriveEtaOutlined } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import WorkoutScreenHeader from "./WorkoutScreenHeader";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";

import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import CloseIcon from "@material-ui/icons/Close";

import MoodBadIcon from "@material-ui/icons/MoodBad";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
} from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PostWorkoutDetails() {
  const userData = useSelector(selectUserData);
  const location = useLocation();
  const history = useHistory();

  const [workoutDurationPlanned, setWorkoutDurationPlanned] = useState("");
  const [calories, setCalories] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState("");
  const [selectedWorkoutEdit, setSelectedWorkoutEdit] = useState("");
  const [group, setGroup] = useState([]);
  const [postWorkout, setPostWorkout] = useState(null);
  const [workoutId, setWorkoutId] = useState("");
  const [completed, setCompleted] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [path, setPath] = useState("");
  const [preWorkout, setPreWorkout] = useState(null);
  const [workoutsCount, setWorkoutsCount] = useState(0);
  const [averageWorkoutTime, setAverageWorkoutTime] = useState(0);
  const [workoutVideoUrl, setWorkoutVideoUrl] = useState("");
  const [workout, setWorkout] = useState([]);

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (userData?.id) {
      db.collection("athletes")
        .doc(userData.id)
        .onSnapshot((doc) => {
          setWorkoutsCount(doc.data()?.completedWorkouts);
          setAverageWorkoutTime(doc.data()?.averageWorkoutTime);
        });
    }
  }, [userData?.id]);

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  useEffect(() => {
    console.log(location?.state?.workout.data);
    if (location.state?.workout) {
      setGroup([
        {
          exercises:
            location.state?.workout?.data?.preWorkout?.selectedExercises,
        },
      ]);
      setPostWorkout(location.state?.workout?.data?.preWorkout);
      if (location?.state?.workout?.data) {
      }
      setPreWorkout(location.state?.workout?.data?.preWorkout);
      setWorkout(location.state?.workout);

      setWorkoutId(location.state?.workout?.id);
      setCalories(
        location.state?.workout?.data?.preWorkout?.caloriesBurnEstimate
      );
      setWorkoutDurationPlanned(
        location.state?.workout?.data?.preWorkout?.workoutDuration
      );
    }
  }, [location.state?.workout]);

  useEffect(() => {
    setCompleted(location.state?.completed);
    console.log(location.state);
    if (location.state?.completed && location.state?.workout) {
      setGroup(location.state?.workout?.data?.postWorkout?.group);
      if (location.state?.workout?.data?.postWorkout) {
        setPostWorkout(location.state?.workout?.data?.postWorkout);
      }
    }
  }, [location.state?.completed, location.state?.workout]);

  useEffect(() => {
    if (group && postWorkout && !location.state.completed) {
      console.log(postWorkout);
      let temp = { ...postWorkout };
      temp.group = group;
      setPostWorkout(temp);
    }
  }, [group]);

  function TimeToMinutes(time) {
    var hms = time; // your input string
    var a = hms.split(":"); // split it at the colons

    // Hours are worth 60 minutes.
    var minutes = +a[0] * 60 + +a[1];

    return minutes;
  }

  useEffect(() => {
    console.log("pt", postWorkout);
  }, [postWorkout]);
  return (
    <div className="Postworkout__container">
      {/* <div>
        <h3>Post Workout details</h3>
      </div> */}
      <WorkoutScreenHeader name="Post Workout details" />
      <div className="Postworkout__body">
        <h4> Title</h4>
        <input
          style={{
            borderWidth: 1,
            borderColor: "#DBE2EA",
            borderwidth: 1,
            height: 25,
            color: "black",
            textAlign: "left",
            backgroundColor: "white",
            padding: "10px 10px",
          }}
          // value={postWorkout?.workoutDuration}
          placeholder="Title"
          disabled={true}
          value={location?.state?.workoutName}
        />
        <h4 style={{ borderTop: 20 }}>Date</h4>

        <div className="Datepicker__container">
          <DatePicker
            placeholder="Set Date"
            // dateFormat="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            selected={
              postWorkout?.date
                ? new Date(moment(postWorkout.date))
                : new Date()
            }
            onChange={(date) => {
              let temp = { ...postWorkout };

              temp.date = date;
              setPostWorkout(temp);
            }}
            disabled={completed ? true : false}
          />
        </div>
        <div className="Planned_data">
          <div style={{ width: 100 }}>Duration</div>
          <div style={{}}>
            <div>Planned</div>
            <input
              style={{
                borderWidth: 1,
                borderColor: "#DBE2EA",
                backgroundColor: "#fcd11c",
                color: "black",

                borderRadius: 8,
                padding: 7,
                height: 25,
                textAlign: "center",
              }}
              disabled={true}
              value={workoutDurationPlanned}
              onChange={setWorkoutDurationPlanned}
              setselectedworkouteditable={false}
              setselectedworkouteditable={completed ? false : true}
            />
          </div>
          <div style={{}}>
            <div>
              Completed <span style={{ fontSize: 14 }}>(HH:MM:SS)</span>
            </div>
            <input
              type="time"
              style={{
                borderWidth: 1,
                borderColor: "#DBE2EA",
                borderwidth: 1,
                height: 25,
                color: "black",
                backgroundColor: "white",
                borderRadius: 8,
                padding: 7,
                width: "100%",
                textAlign: "center",
              }}
              step="1"
              value={postWorkout?.workoutDuration}
              placeholder="HH : MM : SS"
              disabled={completed}
              onChange={(itemValue) => {
                let temp = { ...postWorkout };

                temp.workoutDuration = itemValue.target.value;
                console.log(itemValue.target.value);
                setPostWorkout(temp);
              }}
              setselectedworkouteditable={completed ? false : true}
            />
          </div>
        </div>
        <div className="Planned_data">
          <div style={{ width: 120 }}>Calories</div>
          <input
            style={{
              borderWidth: 1,
              borderColor: "#DBE2EA",
              backgroundColor: "#fcd11c",
              color: "black",

              borderRadius: 8,
              padding: 7,
              height: 25,
              textAlign: "center",
            }}
            value={calories}
            disabled={completed}
            onChange={setCalories}
            setselectedworkouteditable={false}
          />
        </div>
        <h3 style={{ fontSize: 14, marginTop: 20 }}>Exercises</h3>
        <div className="excercise__container" style={{ marginTop: 5 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div className="excercises">
              {group?.map((grp, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: idx == 0 ? 0 : 20,
                    borderBottomWidth: 1,
                    borderColor: "#d3d3d3",
                    marginBottom: 20,
                    width: "100%",
                  }}
                >
                  <div style={{ marginLeft: 10 }}>
                    {grp.exercises?.map((workout, idx1) =>
                      workout.cardio ? (
                        <div
                          key={idx1}
                          style={{
                            border: "1px solid rgb(0,0,0,0.2)",
                          }}
                        >
                          <button
                            style={{
                              marginRight: 30,
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              marginVertical: 10,
                            }}
                            onClick={() => {
                              console.log(1);
                              if (selectedWorkoutEdit === "") {
                                setSelectedWorkoutEdit(idx1);
                              } else {
                                setSelectedWorkoutEdit("");
                              }
                            }}
                          >
                            <div
                              style={{
                                margin: 5,
                              }}
                            >
                              <input
                                type="checkbox"
                                disabled={completed ? true : false}
                                checked={workout?.completed}
                                tintColors={{
                                  true: "#fcd54a",
                                  false: "#fcd54a",
                                }}
                                onValueChange={(newValue) => {
                                  let temp = [...group];
                                  let tmp = group[idx].exercises[idx1];
                                  tmp.completed = newValue.target.value;
                                  if (newValue.target.value === true) {
                                    tmp.sets.map((s) => {
                                      s.actualReps = s.reps;
                                    });
                                    console.log("checked value ", tmp.sets);
                                  } else {
                                    tmp.sets.map((s) => {
                                      s.actualReps = "";
                                    });
                                  }

                                  temp[idx].exercises[idx1] = tmp;

                                  setGroup(temp);
                                }}
                              />
                              <div
                                onClick={() => {
                                  console.log("img click");
                                  setWorkoutVideoUrl(workout.videoUrl);
                                  setOpenDialog(true);
                                }}
                              >
                                <img
                                  style={{
                                    width: 150,
                                    height: 84,
                                    borderRadius: 8,
                                    backgroundColor: "#d3d3d3",
                                  }}
                                  src={
                                    workout.thumbnail_url
                                      ? `${workout.thumbnail_url}`
                                      : "../assets/illustration.jpeg"
                                  }
                                />
                              </div>
                              <div style={{ marginHorizontal: 10 }}>
                                <h3>{workout.name}</h3>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <h3
                                    style={{
                                      width: 100,
                                      fontSize: 12,
                                    }}
                                  >
                                    Coach
                                  </h3>
                                  {workout.sets.map((s, i) => (
                                    <h3 key={i} style={{ fontSize: 12 }}>
                                      {s.reps ? s.reps : 0}
                                      {i < workout.sets.length - 1
                                        ? " - "
                                        : null}
                                    </h3>
                                  ))}
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                                >
                                  <h3
                                    style={{
                                      width: 100,
                                      fontSize: 12,
                                    }}
                                  >
                                    Time
                                  </h3>
                                  {workout.sets.map((s, i) => (
                                    <h3 key={i} style={{ fontSize: 12 }}>
                                      {s.rest ? s.rest : 0}
                                      {i < workout.sets.length - 1
                                        ? " - "
                                        : null}
                                    </h3>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <div style={{ alignItems: "center" }}>
                                  <h3 style={{ fontSize: 11 }}>Edit</h3>
                                  <div>
                                    {selectedWorkoutEdit === idx1 ? (
                                      <img
                                        style={{
                                          width: 20,
                                          height: 20,
                                          marginRight: 5,
                                        }}
                                        src="../assets/up.png"
                                      />
                                    ) : (
                                      <img
                                        style={{
                                          width: 20,
                                          height: 20,
                                          marginRight: 5,
                                        }}
                                        src="../assets/down.png"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                          {selectedWorkoutEdit === idx1 && (
                            <div
                              style={{
                                backgroundColor: "white",
                                padding: 20,
                                boxSizing: "border-box",
                              }}
                            >
                              {workout.sets?.map((set, idx2) => (
                                <div
                                  key={idx2}
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginVertical: 10,
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div
                                    style={{
                                      margin: 5,
                                    }}
                                  >
                                    <h3
                                      style={{
                                        marginTop: 10,

                                        fontSize: 12,
                                      }}
                                    >
                                      Time
                                    </h3>
                                  </div>
                                  <div
                                    style={{
                                      marginHorizontal: 5,
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <h3
                                      style={{
                                        fontSize: 12,
                                        marginBottom: 5,
                                      }}
                                    >
                                      Coach
                                    </h3>
                                    <input
                                      style={{
                                        width: 50,
                                        height: 20,
                                        borderWidth: 1,
                                        borderColor: "#DBE2EA",
                                        backgroundColor: "#fcd54a",
                                        padding: 7,
                                        borderRadius: 8,
                                        textAlign: "center",
                                        color: "black",
                                      }}
                                      disabled={completed}
                                      value={String(set.rest)}
                                      onChange={(newVal) => {
                                        let temp = [...group];
                                        let tmp =
                                          group[idx].exercises[idx1].sets;
                                        tmp[idx2].rest = newVal.target.value;

                                        temp[idx].exercises[idx1].sets = tmp;

                                        setGroup(temp);
                                      }}
                                      keyboardType={"number-pad"}
                                      editable={false}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      marginHorizontal: 5,
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <h3
                                      style={{
                                        fontSize: 12,
                                        marginBottom: 5,
                                      }}
                                    >
                                      Actual
                                    </h3>
                                    <input
                                      style={{
                                        width: 50,
                                        height: 20,
                                        borderWidth: 1,
                                        borderColor: "#DBE2EA",
                                        backgroundColor: "#f3f3f3",
                                        padding: 7,
                                        borderRadius: 8,
                                        textAlign: "center",
                                      }}
                                      disabled={completed}
                                      value={String(
                                        set.actualReps ? set.actualReps : ""
                                      )}
                                      onChange={(newVal) => {
                                        let temp = [...group];
                                        let tmp =
                                          group[idx].exercises[idx1].sets;
                                        tmp[idx2].actualReps =
                                          newVal.target.value;

                                        temp[idx].exercises[idx1].sets = tmp;

                                        setGroup(temp);
                                      }}
                                      keyboardType={"number-pad"}
                                      editable={completed ? false : true}
                                    />
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  console.log(2);
                                  console.log(selectedWorkoutEdit);
                                  setSelectedWorkoutEdit("");
                                }}
                                style={{
                                  borderWidth: 1,
                                  borderRadius: 5,
                                  borderColor: "#DBE2EA",
                                  alignSelf: "flex-end",
                                  padding: 5,
                                  paddingHorizontal: 7,
                                }}
                              >
                                <Icon
                                  name="check"
                                  size={20}
                                  style={{ alignSelf: "flex-end" }}
                                  color="black"
                                  type="font-awesome-5"
                                />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div key={idx1} style={{}}>
                          <button
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "100%",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginVertical: 10,
                              backgroundColor: "white",
                              border: "none",
                              marginTop: 20,
                            }}
                            onClick={() => {
                              console.log(3);
                              if (selectedWorkoutEdit === "") {
                                setSelectedWorkoutEdit(idx1);
                                console.log(selectedWorkoutEdit);
                              } else {
                                setSelectedWorkoutEdit("");
                              }
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <input
                                type="checkbox"
                                disabled={completed}
                                checked={workout?.completed}
                                tintColors={{
                                  true: "#fcd54a",
                                  false: "#fcd54a",
                                }}
                                onChange={(newValue) => {
                                  let temp = [...group];
                                  let tmp = group[idx].exercises[idx1];
                                  tmp.completed = newValue.target.value;
                                  if (newValue.target.value === true) {
                                    tmp.sets.map((s) => {
                                      s.actualReps = s.rest;
                                    });
                                    console.log("checked value ", tmp.sets);
                                  } else {
                                    tmp.sets.map((s) => {
                                      s.actualReps = "";
                                    });
                                  }

                                  temp[idx].exercises[idx1] = tmp;

                                  setGroup(temp);
                                }}
                              />
                              <div>
                                <img
                                  style={{
                                    width: 150,
                                    height: 84,
                                    borderRadius: 8,
                                    backgroundColor: "#d3d3d3",
                                  }}
                                  onClick={() => {
                                    console.log("img click");
                                    setWorkoutVideoUrl(workout.videoUrl);
                                    setOpenDialog(true);
                                  }}
                                  src={
                                    workout.thumbnail_url
                                      ? ` ${workout.thumbnail_url}`
                                      : "../assets/illustration.jpeg"
                                  }
                                />
                              </div>
                              <div
                                style={{
                                  marginHorizontal: 10,
                                  marginLeft: 20,
                                  textAlign: "left",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 17,
                                    fontWeight: 700,
                                    marginBottom: 5,
                                  }}
                                >
                                  {workout.name}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    {workout?.sets?.map((s, i) => (
                                      <div
                                        style={{
                                          display: i == 0 ? "flex" : "none",
                                          flexDirection: "column",
                                        }}
                                      >
                                        {Object.keys(s).map((set_, i) => (
                                          <div
                                            style={{
                                              display:
                                                set_ == "actualReps"
                                                  ? "none"
                                                  : "flex",
                                              marginRight: 10,
                                            }}
                                          >
                                            <div
                                              style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                width: 100,
                                              }}
                                            >
                                              {set_}
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                width: "100%",
                                              }}
                                            >
                                              {workout?.sets?.map((s, i) => (
                                                <div
                                                  key={i}
                                                  style={{
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                  }}
                                                >
                                                  {s[set_] ? s[set_] : 12}
                                                  {i < workout.sets.length - 1
                                                    ? "  -  "
                                                    : null}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                  {/* <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      width: 100,
                                    }}
                                  >
                                    <h3
                                      style={{
                                        marginRight: 10,
                                        fontSize: 12,
                                      }}
                                    >
                                      Coach
                                    </h3>
                                    {workout.sets.map((s, i) => (
                                      <h3 key={i} style={{ fontSize: 12 }}>
                                        {s.reps ? s.reps : 0}
                                        {i < workout.sets.length - 1
                                          ? "-"
                                          : null}
                                      </h3>
                                    ))}
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      width: 100,
                                      marginLeft: 30,
                                    }}
                                  >
                                    <h3
                                      style={{
                                        marginRight: 10,
                                        fontSize: 12,
                                      }}
                                    >
                                      Weights
                                    </h3>
                                    {workout.sets.map((s, i) => (
                                      <h3 style={{ fontSize: 12 }}>
                                        {s.weights ? s.weights : 0}
                                        {i < workout.sets.length - 1
                                          ? "-"
                                          : null}
                                      </h3>
                                    ))}
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",

                                      width: 100,
                                      marginLeft: 30,
                                    }}
                                  >
                                    <h3
                                      style={{
                                        marginRight: 10,
                                        fontSize: 12,
                                      }}
                                    >
                                      Rest
                                    </h3>
                                    {workout.sets.map((s, i) => (
                                      <h3 key={i} style={{ fontSize: 12 }}>
                                        {s.rest ? s.rest : 0}
                                        {i < workout.sets.length - 1
                                          ? "-"
                                          : null}
                                      </h3>
                                    ))}
                                  </div> */}
                                </div>
                              </div>
                              {/* <h3
                              style={{
                                fontSize: 10,
                                marginLeft: -25,
                                width: 70,
                              }}
                            >
                              Tap to di
                              
                              v
                            </h3> */}
                            </div>
                            <div style={{ marginRight: 100 }}>
                              <div style={{ alignItems: "center" }}>
                                <h3 style={{ fontSize: 11 }}>Edit</h3>
                                <div>
                                  {selectedWorkoutEdit === idx1 ? (
                                    <img
                                      style={{
                                        width: 20,
                                        height: 20,
                                        marginRight: 5,
                                      }}
                                      src="../assets/up.png"
                                    />
                                  ) : (
                                    <img
                                      style={{
                                        width: 20,
                                        height: 20,
                                        marginRight: 5,
                                      }}
                                      src="../assets/down.png"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                          {selectedWorkoutEdit === idx1 && (
                            <div
                              style={{
                                backgroundColor: "white",
                                padding: 20,
                                boxSizing: "border-box",
                              }}
                            >
                              <div
                                style={{
                                  width: "50%",
                                  marginLeft: 120,
                                }}
                              >
                                {workout.sets?.map((set, idx2) => (
                                  <div
                                    key={idx2}
                                    style={{
                                      width: "100%",
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      marginVertical: 10,
                                    }}
                                  >
                                    <div>
                                      <h3
                                        style={{
                                          marginTop: 8,

                                          fontSize: 12,
                                          fontWeight: "700",
                                        }}
                                      >
                                        Set {idx2 + 1}
                                      </h3>
                                      <h3
                                        style={{
                                          marginTop: 10,

                                          fontSize: 12,
                                        }}
                                      >
                                        Reps
                                      </h3>
                                    </div>
                                    <div
                                      style={{
                                        marginHorizontal: 5,
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <h3
                                        style={{
                                          fontSize: 12,
                                          marginBottom: 5,
                                        }}
                                      >
                                        Coach
                                      </h3>
                                      <input
                                        style={{
                                          width: 50,
                                          height: 20,
                                          borderWidth: 1,
                                          borderColor: "black",
                                          backgroundColor: "black",
                                          padding: 7,
                                          borderRadius: 8,
                                          textAlign: "center",
                                          color: "white",
                                        }}
                                        value={String(set.reps)}
                                        onChange={(newVal) => {
                                          let temp = [...group];
                                          let tmp =
                                            group[idx].exercises[idx1].sets;
                                          tmp[idx2].reps = newVal.target.value;

                                          temp[idx].exercises[idx1].sets = tmp;

                                          setGroup(temp);
                                        }}
                                        keyboardType={"number-pad"}
                                        selectedworkouteditable={false}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        marginHorizontal: 5,
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <h3
                                        style={{
                                          fontSize: 12,
                                          marginBottom: 5,
                                        }}
                                      >
                                        Actual
                                      </h3>
                                      <input
                                        style={{
                                          width: 50,
                                          height: 20,
                                          borderWidth: 1,

                                          backgroundColor: "white",
                                          padding: 7,
                                          borderRadius: 8,
                                          borderWidth: 1,
                                          borderColor: "rgba(0,0,0,0.8)",
                                          textAlign: "center",
                                        }}
                                        disabled={completed}
                                        value={String(
                                          set.actualReps ? set.actualReps : ""
                                        )}
                                        onChange={(newVal) => {
                                          let temp = [...group];
                                          let tmp =
                                            group[idx].exercises[idx1].sets;
                                          tmp[idx2].actualReps =
                                            newVal.target.value;

                                          temp[idx].exercises[idx1].sets = tmp;

                                          setGroup(temp);
                                        }}
                                        keyboardType={"number-pad"}
                                        selectedworkouteditable={
                                          completed ? false : true
                                        }
                                      />
                                    </div>
                                    <div
                                      style={{
                                        marginHorizontal: 5,
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <h3
                                        style={{
                                          fontSize: 12,
                                          marginBottom: 5,
                                        }}
                                      >
                                        Weights
                                      </h3>
                                      <input
                                        style={{
                                          width: 50,
                                          height: 20,
                                          borderWidth: 1,
                                          borderColor: "black",
                                          backgroundColor: "white",
                                          padding: 7,
                                          borderRadius: 8,
                                          textAlign: "center",
                                        }}
                                        disabled={completed}
                                        value={String(set.weights)}
                                        onChange={(newVal) => {
                                          let temp = [...group];
                                          let tmp =
                                            group[idx].exercises[idx1].sets;
                                          tmp[idx2].weights =
                                            newVal.target.value;

                                          temp[idx].exercises[idx1].sets = tmp;

                                          setGroup(temp);
                                        }}
                                        keyboardType={"number-pad"}
                                        selectedworkouteditable={
                                          completed ? false : true
                                        }
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
          }}
        >
          {console.log("pta", location.state, postWorkout)}
          <h3 style={{ fontSize: 14, marginVertical: 7 }}>Description</h3>
          <input
            style={{
              borderWidth: 1,
              borderColor: "#DBE2EA",
              backgroundColor: "#fff",
              width: "100%",
              borderRadius: 8,
              textAlignVertical: "top",
              padding: 20,
              height: 30,
              marginBottom: 15,
              boxSizing: "border-box",
            }}
            disabled={completed}
            value={
              postWorkout?.description
                ? postWorkout?.description
                : postWorkout?.workoutDescription
            }
            onChange={(newValue) => {
              let temp = { ...postWorkout };
              temp.description = newValue.target.value;
              setPostWorkout(temp);
            }}
            multiline={true}
            underlineColorAndroid="transparent"
            numberOfLines={4}
            placeholder="Enter Description"
            editable={completed ? false : true}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "column",
            alignSelf: "flex-start",
            width: 400,
          }}
        >
          <h3 style={{ fontSize: 15, marginBottom: 7, color: "black" }}>
            Post workout fatigue level
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: 15,
              }}
            >
              <button
                style={{
                  border: "none",
                }}
                onClick={() => {
                  if (!completed) {
                    let temp = { ...postWorkout };
                    temp.fatigue = "very-sore";
                    setPostWorkout(temp);
                  }
                }}
              >
                <SentimentVeryDissatisfiedIcon
                  style={{
                    fill: `${
                      postWorkout?.fatigue === "very-sore" ? "red" : "black"
                    }`,
                    height: 70,
                    width: 70,
                  }}
                />
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginRight: 15,
              }}
            >
              <button
                style={{
                  border: "none",
                }}
                onClick={() => {
                  if (!completed) {
                    let temp = { ...postWorkout };
                    temp.fatigue = "moderately-sore";
                    setPostWorkout(temp);
                  }
                }}
              >
                <SentimentSatisfiedIcon
                  style={{
                    fill: `${
                      postWorkout?.fatigue === "moderately-sore"
                        ? "rgb(252, 213, 74)"
                        : "black"
                    }`,
                    height: 70,
                    width: 70,
                  }}
                />
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: 15,
              }}
            >
              <button
                style={{
                  border: "none",
                }}
                onClick={() => {
                  if (!completed) {
                    let temp = { ...postWorkout };
                    temp.fatigue = "not-sore";
                    setPostWorkout(temp);
                  }
                }}
              >
                <InsertEmoticonIcon
                  style={{
                    fill: `${
                      postWorkout?.fatigue === "not-sore" ? "green" : "black"
                    }`,
                    height: 70,
                    width: 70,
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {!completed && false && (
        <div style={{ width: 300, marginTop: 20 }}>
          <h3 style={{ color: "black", textAlign: "left" }}>
            Upload Post Workout Image
          </h3>
          <div style={{ marginTop: 20, flexDirection: "row" }}>
            <img
              src={imageUrl ? `${imageUrl}` : null}
              style={{
                margin: 10,
                width: 100,
                height: 150,
                borderRadius: 100,
                backgroundColor: "grey",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                marginLeft: 20,
              }}
            >
              <button
                style={{ marginVertical: 15 }}
                //onClick={getImageFromCamera}
              >
                {/* <AntDesign name="camera" size={RFValue(24, 816)} /> */}
              </button>

              <button // onClick={getImageFromGallery}
              >
                {/* <FontAwesome name="photo" size={RFValue(24, 816)} /> */}
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        style={{
          backgroundColor: "#fcd54a",
          padding: 10,
          borderRadius: 15,
          width: 300,
          height: 100,
          marginVertical: 100,
          marginTop: 20,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          border: "none",
        }}
        className="Submit__button"
        onClick={() => {
          if (completed) {
            history.push("/workouts");
          } else {
            let compliance = 0;
            let complianceMessage = "";

            group.map((grp) => {
              grp.exercises.map((ex) => {
                ex.sets.map((s) => {
                  compliance = compliance + s.actualReps * s.weights;
                });
              });
            });
            if (
              compliance <
              0.2 * location.state?.workout?.data?.preWorkout?.compliance
            ) {
              complianceMessage = "Non compliant";
            } else if (
              compliance >
                0.2 * location.state?.workout?.data?.preWorkout?.compliance &&
              compliance <
                0.8 * location.state?.workout?.data?.preWorkout?.compliance
            ) {
              complianceMessage = "Partially compliant";
            } else if (
              compliance >
                0.8 * location.state?.workout?.data?.preWorkout?.compliance &&
              compliance <
                1 * location.state?.workout?.data?.preWorkout?.compliance
            ) {
              complianceMessage = "Fully compliant";
            } else if (
              compliance >
              1.1 * location.state?.workout?.data?.preWorkout?.compliance
            ) {
              complianceMessage = "Exceeded";
            } else {
              complianceMessage = "";
            }
            if (postWorkout?.compliance) {
              postWorkout.compliance = compliance;
              postWorkout.group = group;
            }

            if (!postWorkout?.date) {
              postWorkout.date = formatDate();
            }
            console.log(workoutId, postWorkout);
            db.collection("workouts")
              .doc(workoutId)
              .update({
                postWorkout,
                completed: true,
                compliance: complianceMessage,
              })
              .then(() => {
                db.collection("CoachNotifications")
                  .doc(userData.data.listOfCoaches[0])
                  .collection("notifications")
                  .add({
                    message: `${userData?.data?.name} has completed Workout ${
                      workout?.data?.preWorkout?.workoutName
                    } on ${postWorkout.date || formatDate()} `,
                    seen: false,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    athlete_id: userData.id,
                  });

                db.collection("athletes")
                  .doc(userData.id)
                  .update({
                    completedWorkouts: workoutsCount + 1,
                    averageWorkoutTime:
                      (parseFloat(averageWorkoutTime) * workoutsCount +
                        TimeToMinutes(
                          postWorkout?.workoutDuration ||
                            preWorkout?.workoutDuration ||
                            "00:00:00"
                        )) /
                      (workoutsCount + 1),
                  })
                  .then(() => setModal(true));
              });
          }
        }}
      >
        <h3
          style={{ fontSize: 14, color: "black", fontWeight: "bold" }}
          onClick={() => {
            history.push("/workouts");
          }}
        >
          {completed ? "Return" : "Complete Workout"}
        </h3>
      </button>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        // fullWidth
        onClose={handleCloseDialog}
      >
        <DialogContent>
          {/* <video width="500" height="500" controls>
            <source src={workoutVideoUrl} type="video/mp4" />
          </video> */}
          <div
            dangerouslySetInnerHTML={{
              __html: `<iframe title="video" height="470" width="730" frameborder="0" src="https://player.vimeo.com/video/${workoutVideoUrl.substring(
                workoutVideoUrl.lastIndexOf("/") + 1
              )}"></iframe>`,
            }}
          />
          <div
            onClick={handleCloseDialog}
            style={{
              cursor: "pointer",
              position: "absolute",
              right: 0,
              top: 0,
              padding: 12,
            }}
          >
            {" "}
            <CloseIcon />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
