import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { selectUserData, selectUserType } from "../../features/userSlice";
import formatSpecificDate from "../../functions/formatSpecificDate";
import incr_date from "../../functions/incr_date";
import Axios from "axios";
import { db } from "../../utils/firebase";
import WorkoutScreenHeader from "./WorkoutScreenHeader";
import "./workouts.css";
import formatSpecificDate1 from "../../functions/formatSpecificDate1";
import SearchableDropdown from "../../Components/SearchableDropdown";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import { formatDate } from "../../functions/formatDate";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "react-awesome-modal";
import { getType } from "@reduxjs/toolkit";

function AssignWorkout() {
  const location = useLocation();
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const [listOfAthletes, setListOfAthletes] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [currentStartWeek, setCurrentStartWeek] = useState(null);
  const [currentEndWeek, setCurrentEndWeek] = useState(null);
  const [workoutDuration, setworkoutDuration] = useState(null);
  const [caloriesBurnEstimate, setcaloriesBurnEstimate] = useState(null);
  const [workoutDifficulty, setworkoutDifficulty] = useState(null);
  const [workoutDescription, setworkoutDescription] = useState(null);
  const [daysList, setDaysList] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  const [specificDates, setSpecificDates] = useState([]);
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState("");
  const [selectedWorkoutEdit, setSelectedWorkoutEdit] = useState("");
  const [group, setGroup] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workout, setWorkout] = useState(null);
  const [coachDetails, setCoachDetails] = useState([]);
  const [workoutVideoUrl, setWorkoutVideoUrl] = useState("");
  const [modal, setModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [type, setType] = useState("");
  const [objs, setObjs] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [modal2, setModal2] = useState(false);
  const history = useHistory();

  useEffect(() => {
    Axios.get("https://rongoeirnet.herokuapp.com/getexercise")
      .then((res) => {
        setObjs(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    objs?.map((item, idx) => {
      item.name = item.workoutName;
    });
    setExercises(objs);
  }, [objs]);

  useEffect(() => {
    if (workoutVideoUrl) {
      setVideoLoading(false);
    }
  }, [workoutVideoUrl]);

  useEffect(() => {
    if (location.state?.assignType) {
      setType(location.state?.assignType);
    }
  }, [location.state?.assignType]);

  useEffect(() => {
    if (
      location.state?.athlete_id &&
      location.state?.workout?.data?.selectedAthletes
    ) {
      let tmp = [];
      let selectedAthlete =
        location.state?.workout?.data?.selectedAthletes.find(
          (x) => x.id === location.state?.athlete_id
        );
      tmp.push(selectedAthlete);
      setSelectedAthletes(tmp);
    }
  }, [location.state?.athlete_id]);

  useEffect(() => {
    console.log(location.state.workout);
    if (location.state.workout) {
      setWorkout(location.state.workout);
      setworkoutDifficulty(
        location.state.workout?.data?.preWorkout?.workoutDifficulty
      );

      setworkoutDescription(
        location.state.workout?.data?.preWorkout?.workoutDescription
      );

      setcaloriesBurnEstimate(
        location.state.workout?.data?.preWorkout?.caloriesBurnEstimate
      );

      setworkoutDuration(
        location.state.workout?.data?.preWorkout?.workoutDuration
      );
      setSelectedExercises(
        location.state.workout?.data?.preWorkout?.selectedExercises
      );

      if (
        location.state?.workout?.data?.selectedAthletes &&
        !location.state?.athlete_id
      ) {
        setSelectedAthletes(location.state?.workout?.data?.selectedAthletes);
      }
    }
  }, [location]);

  useEffect(() => {
    if (group && workout) {
      let temp = { ...workout };
      temp.data.preWorkout.group = group;
      setWorkout(temp);
    }
  }, [group]);

  useEffect(() => {
    if (location.state?.workout && userType === "athlete") {
      db.collection("coaches")
        .doc(location.state?.workout?.data?.assignedById)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setCoachDetails({ id: doc.id, data: doc.data() });
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  }, [location.state?.workout]);

  useEffect(() => {
    if (type === "non-editable" && location.state.workout) {
      var minDate = location.state.workout?.data?.selectedDates.reduce(
        function (a, b) {
          return a < b ? a : b;
        }
      );
      var curr = new Date(minDate); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

      setCurrentStartWeek(formatSpecificDate(firstday));
      setCurrentEndWeek(formatSpecificDate(lastday));
    } else {
      var curr = new Date(); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

      setCurrentStartWeek(formatSpecificDate(firstday));
      setCurrentEndWeek(formatSpecificDate(lastday));
    }
  }, [type, location.state.workout]);

  useEffect(() => {
    if (currentStartWeek) {
      let temp = currentStartWeek;

      let datesCollection = [];

      for (var i = 0; i < 7; i++) {
        datesCollection.push(temp);
        temp = incr_date(temp);
      }

      setSpecificDates(datesCollection);
    }
  }, [currentStartWeek]);

  useEffect(() => {
    if (userData?.id) {
      const data = [];
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((athlete) => {
            if (userData?.data?.listOfAthletes?.includes(athlete.id)) {
              let currentID = athlete.id;
              let appObj = { ...athlete.data(), ["id"]: currentID };
              data.push(appObj);
            }
          });
          setListOfAthletes(data);
        });
    }
  }, [userData?.id]);

  return (
    <div className="assignWorkout">
      <WorkoutScreenHeader name="Assign Workout" />
      <img
        style={{ objectFit: "cover" }}
        src="/assets/illustration.jpeg"
        width="100%"
        height="150px"
      />
      <div className="assignWorkout__banner">
        <img
          src={userData?.data?.imageUrl}
          width="40px"
          height="40px"
          style={{ borderRadius: "40px", objectFit: "cover" }}
        />
        <div>
          <h5>{userData?.data?.name}</h5>
        </div>
      </div>
      <div className="assignWorkout__container">
        <h3>Workout Details</h3>
        <div className="assignWorkout__summaryCard">
          <div className="assignWorkout__summaryCardLeft">
            {console.log(type)}
            <textarea
              rows="5"
              cols="40"
              name="description"
              value={workoutDescription}
              disabled={type == "non-editable" || type == "view"}
              onChange={(val) => {
                let temp = workout;
                setworkoutDescription(val.target.value);
                temp.data.preWorkout.workoutDescription = workoutDescription;
                setWorkout(temp);
              }}
            />

            <div className="assignWorkout__summaryCardLeftComponents">
              <img src="/assets/Icon_material_access_time.png" alt="" />
              <input
                value={workoutDuration}
                disabled={type == "non-editable" || type == "view"}
                onChange={(val) => {
                  console.log(workout.data.preWorkout.workoutDuration);
                  let temp = workout;
                  setworkoutDuration(val.target.value);
                  temp.data.preWorkout.workoutDuration = workoutDuration;
                  setWorkout(temp);
                }}
              />
              <img src="/assets/Icon_awesome_burn.png" alt="" />
              <input
                value={caloriesBurnEstimate}
                disabled={type == "non-editable" || type == "view"}
                onChange={(val) => {
                  //console.log(workout.data.preWorkout.workoutDuration);
                  let temp = workout;
                  setcaloriesBurnEstimate(val.target.value);
                  temp.data.preWorkout.caloriesBurnEstimate =
                    caloriesBurnEstimate;
                  setWorkout(temp);
                }}
              />
              <img src="/assets/Icon_feather_trending_up.png" alt="" />
              <input
                value={workoutDifficulty}
                disabled={type == "non-editable" || type == "view"}
                onChange={(val) => {
                  let temp = workout;
                  setworkoutDifficulty(val.target.value);
                  temp.data.preWorkout.workoutDifficulty = workoutDifficulty;
                  setWorkout(temp);
                }}
              />
            </div>
          </div>
          <div className="assignWorkout__summaryCardRight">
            <div>
              <div className="assignWorkout__summaryCardRow">
                <h5>Equipments Needed : </h5>
                <div className="assignWorkout__summaryCardRow">
                  {workout?.data?.preWorkout?.equipmentsNeeded?.map(
                    (equipment, i) => (
                      <h6 key={i}>
                        {equipment.name}
                        {i <
                        workout?.data?.preWorkout?.equipmentsNeeded?.length - 1
                          ? ", "
                          : null}
                      </h6>
                    )
                  )}
                </div>
              </div>
              <div className="assignWorkout__summaryCardRow">
                <h5>Target Muscles : </h5>
                <div className="assignWorkout__summaryCardRow">
                  {workout?.data?.preWorkout?.targetedMuscleGroup?.map(
                    (muscle, i) => (
                      <h6 key={i}>
                        {muscle.name}
                        {i <
                        workout?.data?.preWorkout?.targetedMuscleGroup?.length -
                          1
                          ? ", "
                          : null}
                      </h6>
                    )
                  )}
                </div>
              </div>
            </div>
            <div
              className="createWorkout__completeWorkoutButton"
              onClick={() => {
                if (userType === "athlete") {
                  // navigation.navigate("PostWorkoutDetails", {
                  //   workout: workout,
                  //   workoutName: location.state?.workoutName,
                  // });
                } else {
                  if (type === "non-editable") {
                    history.goBack();
                  } else if (type === "update") {
                    let tempDate1 = [];
                    selectedAthletes.map((athlete) => {
                      athlete.selectedDays.map((d) => {
                        tempDate1.push(d);
                      });
                    });

                    selectedAthletes.selectedDays = tempDate1;

                    db.collection("workouts")
                      .doc(workout.id)
                      .update({
                        completed: false,
                        preWorkout: workout.data?.preWorkout,
                        saved: false,
                        selectedAthletes,
                      })
                      .then(() => {
                        history.goBack();
                      });
                  } else {
                    console.log("Assigning the workout");
                    let tempDate1 = [];
                    selectedAthletes.map((athlete) => {
                      athlete.selectedDays.map((d) => {
                        tempDate1.push(d);
                      });
                    });
                    if (selectedAthletes && tempDate1.length > 0) {
                      db.collection("CoachWorkouts")
                        .add({
                          assignedById: workout.data?.assignedById,
                          completed: false,
                          preWorkout: workout.data?.preWorkout,
                          saved: false,
                          selectedAthletes: selectedAthletes,
                          selectedDates: tempDate1,
                        })
                        .then((docRef) => {
                          console.log("Coach Workout ID", docRef);
                          selectedAthletes.map((athlete, idx) => {
                            workout.data.assignedToId = athlete.id;
                            // sendPushNotification(
                            //   athlete.token,
                            //   "new workout assigned"
                            // );
                            athlete.selectedDays.map((tempDate, idx1) => {
                              workout.data.date = tempDate;

                              db.collection("workouts")
                                .add({
                                  assignedById: workout.data?.assignedById,
                                  assignedToId: workout.data?.assignedToId,
                                  date: workout.data?.date,
                                  completed: false,
                                  preWorkout: workout.data?.preWorkout,
                                  saved: false,
                                  selectedAthletes,
                                  coachWorkoutId: docRef.id,
                                })
                                .then((docRef1) => {
                                  console.log({ docRef1 });
                                  history.push("/workouts");
                                })
                                .catch((error) => {
                                  console.error(
                                    "Error adding document: ",
                                    error
                                  );
                                });
                            });
                          });
                        })
                        .catch((error) => {
                          console.error("Error adding document: ", error);
                        });
                    } else {
                      alert("Please select an athlete and assign a date");
                    }
                  }
                }
              }}
            >
              {userType === "athlete"
                ? "Complete Workout"
                : type === "non-editable"
                ? "Return"
                : "Save Changes and Exit"}
            </div>
          </div>
        </div>
        <div className="assignWorkout__athletesList">
          <SearchableDropdown
            name="Search for Athletes"
            list={listOfAthletes}
            state={selectedAthletes}
            setState={setSelectedAthletes}
          />
          <div>
            {selectedAthletes.map((athlete, index) => (
              <div
                key={index}
                style={{
                  marginLeft: "4%",
                  marginTop: "25px",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fcd54a",
                    borderRadius: "10px",
                    height: "45px",
                    width: "49%",
                  }}
                >
                  <img
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "10px",
                      marginLeft: "20px",
                      marginRight: "20px",
                    }}
                    src={athlete.imageUrl ? athlete.imageUrl : null}
                  />
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      lineHeight: "28px",
                      color: "black",
                      marginLeft: "15%",
                    }}
                  >
                    {athlete.name}
                  </h2>
                </div>
                <h2
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    marginTop: "10px",
                    lineHeight: "28px",
                    marginLeft: "1%",
                  }}
                >
                  Select days
                </h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginBottom: "10px",
                    width: "45%",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "3%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "50%",
                    }}
                  >
                    <IconButton
                      style={{
                        marginRight: "10px",
                        marginLeft: "25%",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={() => {
                        var curr = new Date(currentStartWeek); // get current date
                        var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

                        var firstday = new Date(
                          curr.setDate(first)
                        ).toUTCString();
                        var lastday = new Date(
                          curr.setDate(curr.getDate() + 6)
                        ).toUTCString();
                        if (new Date(currentStartWeek) > new Date()) {
                          setCurrentStartWeek(formatSpecificDate(firstday));
                          setCurrentEndWeek(formatSpecificDate(lastday));
                        }
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    {daysList.map((day, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (type !== "view") {
                            if (
                              athlete?.selectedDays?.includes(
                                specificDates[idx]
                              )
                            ) {
                              let selected =
                                selectedAthletes[index].selectedDays;
                              var index1 = selected.indexOf(specificDates[idx]);
                              if (index1 !== -1) {
                                selected.splice(index1, 1);
                                selectedAthletes[index] = {
                                  ...selectedAthletes[index],
                                  selected,
                                };
                                setSelectedAthletes([...selectedAthletes]);
                              }
                            } else {
                              if (
                                new Date(specificDates[idx]) > new Date() ||
                                specificDates[idx] === formatDate()
                              ) {
                                let selectedDays =
                                  selectedAthletes[index].selectedDays;
                                selectedAthletes[index] = {
                                  ...selectedAthletes[index],
                                  selectedDays: [
                                    ...selectedDays,
                                    specificDates[idx],
                                  ],
                                };
                                setSelectedAthletes([...selectedAthletes]);
                              }
                            }
                          }
                        }}
                        style={
                          athlete?.selectedDays?.includes(specificDates[idx])
                            ? {
                                backgroundColor: "#fcd54a",
                                color: "#fff",
                                width: "85px",
                                height: "25px",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative",
                                borderRadius: "8px",
                                marginRight: "2px",
                                marginBottom: "5px",
                                padding: "5px",
                                cursor: "pointer",
                              }
                            : {
                                width: "85px",
                                height: "25px",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative",
                                borderRadius: "8px",
                                marginRight: "2px",
                                marginBottom: "5px",
                                padding: "5px",
                                cursor: "pointer",
                              }
                        }
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              lineHeight: "20px",
                              width: "80%",
                              textAlign: "center",
                              padding: "5px",
                              color: athlete?.selectedDays?.includes(
                                specificDates[idx]
                              )
                                ? "black"
                                : "black",
                            }}
                          >
                            {day}
                          </div>
                        </div>
                      </div>
                    ))}

                    <IconButton
                      style={{
                        marginLeft: "10%",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={() => {
                        var curr = new Date(currentStartWeek); // get current date
                        var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

                        var firstday = new Date(
                          curr.setDate(first)
                        ).toUTCString();
                        var lastday = new Date(
                          curr.setDate(curr.getDate() + 6)
                        ).toUTCString();

                        setCurrentStartWeek(formatSpecificDate(firstday));
                        setCurrentEndWeek(formatSpecificDate(lastday));
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </div>

                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "500",
                      lineHeight: "18px",
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      width: "100%",
                      height: "25px",
                      marginLeft: "45px",
                      cursor: "pointer",
                    }}
                  >
                    {specificDates?.map((tempDate, idx) => (
                      <div
                        style={{
                          width: "43px",
                          height: "30px",
                        }}
                        key={idx}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            fontWeight: "500",
                            lineHeight: "18px",
                            width: "100%",
                            paddingLeft: "5px",
                            paddingRight: "5px",
                            paddingBottom: "5px",
                            textAlign: "center",
                          }}
                        >
                          {formatSpecificDate1(tempDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="createWorkout__exercises">
          <h3 className="createWorkout__inputLabel">Exercises</h3>
          <div>
            <div>
              <div style={{ width: "95%" }}>
                <SearchableDropdown
                  name="Search for Exercise"
                  list={exercises}
                  state={selectedExercises}
                  setState={setSelectedExercises}
                />
              </div>
              {selectedExercises?.map((workout, idx1) => (
                <div key={idx1} style={{ width: "95%", marginLeft: "3%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "10px",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (selectedWorkoutEdit === "") {
                        setSelectedWorkoutEdit(idx1);
                      } else {
                        setSelectedWorkoutEdit("");
                      }
                    }}
                  >
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setWorkoutVideoUrl(workout.videoUrl);
                        setModal2(true);
                        setVideoLoading(true);
                      }}
                    >
                      <img
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "8px",
                          backgroundColor: "#d3d3d3",
                          objectFit: "cover",
                          marginRight: "15px",
                        }}
                        src={
                          workout.thumbnail_url
                            ? workout.thumbnail_url
                            : "/assets/illustration.jpeg"
                        }
                      />
                    </div>
                    <div style={{ marginLeft: "10px", width: "60%" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            height: "20px",
                          }}
                        >
                          {workout.name}
                        </h4>
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            let temp = [...selectedExercises];
                            temp.splice(idx1, 1);
                            setSelectedExercises(temp);
                          }}
                        >
                          <CloseIcon />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: "20px",
                        }}
                      >
                        <h5
                          style={{
                            width: "30%",
                            fontSize: "12px",
                            fontWeight: "400",
                          }}
                        >
                          Reps
                        </h5>
                        {workout.sets.map((s, i) => (
                          <h5
                            key={i}
                            style={{
                              fontSize: "12px",
                              textAlign: "center",
                              fontWeight: "400",
                            }}
                          >
                            {s.reps ? s.reps : "12px"}
                            {i < workout.sets.length - 1 ? " - " : null}
                          </h5>
                        ))}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          height: "20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            marginRight: "20px",
                          }}
                        >
                          <h5
                            style={{
                              width: "37%",
                              fontSize: "12px",
                              fontWeight: "400",
                            }}
                          >
                            Weights
                          </h5>
                          {workout.sets.map((s, i) => (
                            <h5
                              key={i}
                              style={{
                                fontSize: "12px",
                                fontWeight: "400",
                                width: s === 0 && "20px",
                              }}
                            >
                              {s.weights ? s.weights : 0}
                              {i < workout.sets.length - 1 ? " - " : null}
                            </h5>
                          ))}
                        </div>
                        <div>
                          {selectedWorkoutEdit === idx1 ? (
                            <img
                              style={{
                                width: "25px",
                                height: "20px",
                                marginRight: "5px",
                                objectFit: "cover",
                              }}
                              src="/assets/up.png"
                            />
                          ) : (
                            <img
                              style={{
                                width: "25px",
                                height: "20px",
                                marginRight: "5px",
                                objectFit: "cover",
                              }}
                              src="/assets/down.png"
                            />
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: "20px",
                        }}
                      >
                        <h5
                          style={{
                            width: "30%",
                            fontSize: "12px",
                            fontWeight: "400",
                          }}
                        >
                          Rest(secs)
                        </h5>
                        {workout.sets.map((s, i) => (
                          <h5
                            key={i}
                            style={{ fontSize: "12px", fontWeight: "400" }}
                          >
                            {s.rest ? s.rest : 15}
                            {i < workout.sets.length - 1 ? " - " : null}
                          </h5>
                        ))}
                      </div>
                    </div>
                  </div>
                  {selectedWorkoutEdit === idx1 && (
                    <div>
                      <div
                        style={{
                          borderWidth: "1px",
                          borderColor: "#fcd13c",
                          borderStyle: "solid",
                          padding: "5px",
                          borderRadius: "50px",
                          width: "120px",
                          height: "20px",
                          marginTop: "10px",
                          marginBottom: "10px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => {
                          // navigation.navigate("AddWorkout");
                          let temp = [...selectedExercises];
                          temp[idx1].sets.push({
                            reps: "",
                            weights: "",
                            rest: "",
                          });

                          setSelectedExercises(temp);
                        }}
                      >
                        <h5
                          style={{
                            color: "black",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          Add New Set
                        </h5>
                      </div>
                      {workout.sets?.map((set, idx2) => (
                        <div
                          key={idx2}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            marginTop: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              marginLeft: "-15px",
                              marginRight: "5px",
                            }}
                            onClick={() => {
                              let temp = [...selectedExercises];
                              temp.splice(idx2, 1);
                              setSelectedExercises(temp);
                            }}
                          >
                            <CloseIcon />
                          </div>
                          <h5
                            style={{
                              marginTop: "18px",
                              marginRight: "15px",
                            }}
                          >
                            Set {idx2 + 1}
                          </h5>
                          <div
                            style={{
                              marginLeft: "5px",
                              marginRight: "5px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <h5
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                textAlign: "center",
                                marginRight: "10px",
                              }}
                            >
                              Reps
                            </h5>
                            <input
                              style={{
                                width: "50px",
                                height: "20px",
                                borderWidth: "1px",
                                borderColor: "#DBE2EA",
                                backgroundColor: "#fff",
                                padding: "7px",
                                borderRadius: "8px",
                                textAlign: "center",
                              }}
                              value={String(set.reps)}
                              placeholder={"12"}
                              onChange={(e) => {
                                let temp = [...selectedExercises];
                                temp[idx1].sets[idx2].reps = e.target.value;
                                setSelectedExercises(temp);
                              }}
                            />
                          </div>
                          <div
                            style={{
                              marginLeft: "5px",
                              marginRight: "5px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <h5
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                textAlign: "center",
                                marginRight: "10px",
                              }}
                            >
                              Weights
                            </h5>
                            <input
                              style={{
                                width: "50px",
                                height: "20px",
                                borderWidth: "1px",
                                borderColor: "#DBE2EA",
                                backgroundColor: "#fff",
                                padding: "7px",
                                borderRadius: "8px",
                                textAlign: "center",
                              }}
                              value={String(set.weights)}
                              placeholder={"12"}
                              onChange={(e) => {
                                let temp = [...selectedExercises];
                                temp[idx1].sets[idx2].weights = e.target.value;
                                setSelectedExercises(temp);
                              }}
                            />
                          </div>
                          <div
                            style={{
                              marginLeft: "5px",
                              marginRight: "5px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <h5
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                textAlign: "center",
                                marginRight: "10px",
                              }}
                            >
                              Rest
                            </h5>
                            <input
                              style={{
                                width: "50px",
                                height: "20px",
                                borderWidth: "1px",
                                borderColor: "#DBE2EA",
                                backgroundColor: "#fff",
                                padding: "7px",
                                borderRadius: "8px",
                                textAlign: "center",
                              }}
                              value={String(set.rest)}
                              placeholder={"12"}
                              onChange={(e) => {
                                let temp = [...selectedExercises];
                                temp[idx1].sets[idx2].rest = e.target.value;
                                setSelectedExercises(temp);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <div
                        onClick={() => setSelectedWorkoutEdit("")}
                        style={{
                          position: "relative",
                          left: "70%",
                          borderWidth: "1px",
                          borderRadius: "5px",
                          borderColor: "#DBE2EA",
                          display: "flex",
                          alignSelf: "flex-end",
                          padding: "5px",
                          paddingLeft: "7px",
                          paddingRight: "7px",
                          cursor: "pointer",
                        }}
                      >
                        <CheckBoxIcon fontSize="large" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* <div className="createWorkout__description">
          <h3 className="createWorkout__inputLabel">Workout Description</h3>
          <textarea placeholder="Enter Workout Description" />
        </div> */}
      </div>
      <Modal
        visible={modal2}
        width="80%"
        height="500"
        effect="fadeInUp"
        onClickaway={() => setModal2(false)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <video width="500" height="400" autoplay controls>
            <source src={workoutVideoUrl} />
          </video> */}
          <iframe width="420" height="415" src={workoutVideoUrl}></iframe>
          <div
            style={{
              padding: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
            onClick={() => {
              setModal2(false);
            }}
          >
            <CloseIcon />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AssignWorkout;
