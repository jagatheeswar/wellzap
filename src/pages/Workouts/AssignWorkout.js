import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { selectUserData, selectUserType } from "../../features/userSlice";
import formatSpecificDate from "../../functions/formatSpecificDate";
import incr_date from "../../functions/incr_date";
import Axios from "axios";
import { db } from "../../utils/firebase";
import firebase from "firebase";
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
import SelectSearch from "react-select-search";
import Switch from "@material-ui/core/Switch";
import "./dropdown.css";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import styled from "styled-components";
import CheckIcon from "@material-ui/icons/Check";

const InputWrapper = styled("div")`
  width: 350px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 4%;

  &:hover {
    border-color: #40a9ff;
  }

  &.focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    font-size: 14px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`;

const Listbox = styled("ul")`
  width: 350px;
  margin: 2px 0 0;
  margin-left: 2.1%;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 150px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected="true"] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus="true"] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`;

const Tag = styled(({ label, onDelete, ...props }) => (
  <div {...props}>
    <span>{label}</span>
    <CloseIcon onClick={onDelete} />
  </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;

  line-height: 22px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`;

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
  margin-left: 4%;
  margin-top: 20px;
`;

function AssignWorkout() {
  const location = useLocation();
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const [listOfAthletes, setListOfAthletes] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [selectedAthletes1, setSelectedAthletes1] = useState([]);
  const [currentStartWeek, setCurrentStartWeek] = useState(null);
  const [currentEndWeek, setCurrentEndWeek] = useState(null);
  const [athlete_selecteddays, setathlete_selecteddays] = useState({});
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
  const [options, setoptions] = useState(null);
  const [show_data, setshow_data] = useState([]);
  const [cardio, setCardio] = useState(false);
  const [cardioSelect, setCardioSelect] = useState("Run");
  const [cardioExercise, setCardioExercise] = useState([
    { name: "Run" },
    { name: "Walk" },
    { name: "Elliptical" },
    { name: "Bike" },
    { name: "Row" },
  ]);
  const history = useHistory();

  useEffect(() => {
    Axios.get("https://rongoeirnet.herokuapp.com/getexercise")
      .then((res) => {
        setObjs(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let temp = [];
    if (selectedAthletes?.length > 0) {
      selectedAthletes.forEach((item) => {
        item.value = item["id"];
        temp.push(item);
        if (temp.length == selectedAthletes.length) {
          setoptions(temp);
        }
      });
    }
  }, [selectedAthletes]);

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
    //console.log(location?.state?.workout?.data?.selectedAthletes);
    let tmp = [];
    if (
      location.state?.athlete_id &&
      location.state?.workout?.data?.selectedAthletes
    ) {
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

      if (location.state?.workout?.data?.selectedAthletes) {
        //console.log("gagna")
        //console.log(location.state?.workout?.data?.selectedAthletes)
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
    console.log(selectedExercises);
  }, [selectedExercises]);

  useEffect(() => {
    console.log(athlete_selecteddays);
    let temp = [...selectedAthletes];
    selectedAthletes.map((athlete, idx) => {
      if (athlete_selecteddays[athlete.id]) {
        temp[idx].selectedDays = athlete_selecteddays[athlete.id];
      }
      setSelectedAthletes1(temp);
    });

    console.log(athlete_selecteddays);
  }, [selectedAthletes]);

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
      var minDate = location.state?.workout?.data?.selectedDates?.reduce(
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

  useEffect(() => {
    console.log("selectedAthletes");
    console.log(selectedAthletes);
  }, [selectedAthletes]);

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    multiple: true,
    options: listOfAthletes,
    getOptionLabel: (option) => option.name,
  });

  useEffect(() => {
    //console.log("4")
    value.map((v) => {
      v.selectedDays = [];
    });
    if (!location.state?.workout?.data?.selectedAthletes) {
      setSelectedAthletes(value);
    }
  }, [value]);

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
                    selectedAthletes?.map((athlete) => {
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
                        timestamp:
                          firebase.firestore.FieldValue.serverTimestamp(),
                      })
                      .then(() => {
                        history.goBack();
                      });
                  } else {
                    console.log("Assigning the workout");
                    let tempDate1 = [];
                    selectedAthletes?.map((athlete) => {
                      athlete.selectedDays?.map((d) => {
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
                          timestamp:
                            firebase.firestore.FieldValue.serverTimestamp(),
                        })
                        .then((docRef) => {
                          console.log("Coach Workout ID", docRef);
                          selectedAthletes?.map((athlete, idx) => {
                            workout.data.assignedToId = athlete.id;
                            // sendPushNotification(
                            //   athlete.token,
                            //   "new workout assigned"
                            // );
                            athlete.selectedDays?.map((tempDate, idx1) => {
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
                                  timestamp:
                                    firebase.firestore.FieldValue.serverTimestamp(),
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

        {userType == "athlete" || type == "non-editable" ? (
          <div
            style={{
              padding: "20px",
            }}
          >
            {" "}
            <div className="assignWorkout__athletesList">
              <h4>Selected Athletes</h4>
              <input
                style={{
                  width: "100%",
                  padding: 12,
                  marginBottom: 10,
                  boxSizing: "border-box",
                  border: "none",
                }}
                placeholder={
                  selectedAthletes?.length == 0 ? "no athletes selected" : ""
                }
                value={
                  show_data.length > 0
                    ? show_data[0]?.name
                    : "Click on Athlete to show selected dates"
                }
              />
              <div
                className="selectedAthletes_list"
                style={{
                  height:
                    `${selectedAthletes?.length}` > 4
                      ? 260
                      : `${selectedAthletes?.length}` * 65,
                  overflow: "scroll",
                  overflowY: `${selectedAthletes?.length}` <= 4 && "hidden",
                  backgroundColor: "white",
                  overflowX: "hidden",
                }}
              >
                {selectedAthletes?.map((athlete, idx) => (
                  <div
                    onClick={() => {
                      let temp = [];
                      if (show_data[0]?.id == athlete.id) {
                        setshow_data([]);
                      } else {
                        temp.push(athlete);
                        setshow_data(temp);
                        console.log(athlete.name, show_data);
                      }
                    }}
                    style={{
                      backgroundColor:
                        athlete?.id == show_data[0]?.id ? "#fcd13f" : "white",
                    }}
                    className="selectedAthletes_item"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: 10,
                      }}
                    >
                      <img
                        style={{ borderRadius: 18 }}
                        src={athlete.imageUrl}
                        alt=""
                        width="36"
                        height="36"
                      />
                      <span style={{ marginLeft: 15 }}>{athlete.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                {show_data?.map((athlete, index) => (
                  <div
                    key={index}
                    style={{
                      //  marginLeft: "4%",
                      marginTop: 20,
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",

                      backgroundColor: "white",
                      borderRadius: 10,
                      //boxShadow: "0 0 1px 2px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        // backgroundColor: "#fcd54a",
                        borderRadius: "10px",
                        height: "45px",
                      }}
                    >
                      <img
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "18px",
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
                        }}
                      >
                        {athlete.name}
                      </h2>
                    </div>
                    {type != "view" && type != "non-editable" && (
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
                    )}
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
                              if (type !== "view" && type !== "non-editable") {
                                if (
                                  athlete?.selectedDays?.includes(
                                    specificDates[idx]
                                  )
                                ) {
                                  let selected =
                                    selectedAthletes[index].selectedDays;
                                  var index1 = selected.indexOf(
                                    specificDates[idx]
                                  );
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
                                    let temp = athlete_selecteddays;
                                    temp[selectedAthletes[index].id] =
                                      selectedAthletes[index].selectedDays;

                                    setathlete_selecteddays(temp);
                                    setSelectedAthletes([...selectedAthletes]);
                                  }
                                }
                              }
                            }}
                            style={
                              athlete?.selectedDays?.includes(
                                specificDates[idx]
                              )
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
          </div>
        ) : (
          <div>
            <div {...getRootProps()}>
              <Label {...getInputLabelProps()}>Search for Athletes</Label>
              <InputWrapper
                ref={setAnchorEl}
                className={focused ? "focused" : ""}
              >
                {value.map((option, index) => (
                  <Tag label={option.name} {...getTagProps({ index })} />
                ))}

                <input {...getInputProps()} />
              </InputWrapper>
            </div>
            {groupedOptions.length > 0 ? (
              <Listbox {...getListboxProps()}>
                {groupedOptions.map((option, index) => (
                  <li {...getOptionProps({ option, index })}>
                    <span>{option.name}</span>
                    <CheckIcon fontSize="small" />
                  </li>
                ))}
              </Listbox>
            ) : null}
            <div>
              {selectedAthletes1?.map((athlete, index) => (
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
                      width: "350px",
                    }}
                  >
                    <img
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "18px",
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
                      justifyContent: "flex-start",
                      flexWrap: "wrap",
                      marginBottom: "10px",
                      width: "300px",
                    }}
                  >
                    <div
                      style={{
                        marginLeft: "3%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "300px",
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
                                var index1 = selected.indexOf(
                                  specificDates[idx]
                                );
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
                                  let temp = athlete_selecteddays;
                                  temp[selectedAthletes[index].id] =
                                    selectedAthletes[index].selectedDays;

                                  setathlete_selecteddays(temp);
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
                        marginLeft: "35px",
                        cursor: "pointer",
                      }}
                    >
                      {specificDates?.map((tempDate, idx) => (
                        <div
                          style={{
                            width: "45px",
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
        )}

        {console.log("ss", selectedAthletes)}

        <div className="createWorkout__exercises">
          {userType == "athlete" || type == "non-editable" ? null : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginRight: 20,
              }}
            >
              <h3 className="createWorkout__inputLabel">Exercises</h3>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ margin: 0 }}>Weights</p>
                <Switch
                  checked={cardio}
                  onChange={(event) => {
                    setCardio(!cardio);
                  }}
                  value={cardio}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
                <p style={{ margin: 0 }}>Cardio</p>
              </div>
            </div>
          )}
          <div>
            <div>
              {userType == "athlete" || type == "non-editable" ? null : (
                <div style={{ width: "100%" }}>
                  <SearchableDropdown
                    name="Search for Exercise"
                    list={cardio ? cardioExercise : exercises}
                    state={selectedExercises}
                    setState={setSelectedExercises}
                    cardio={cardio}
                  />
                </div>
              )}

              <div className="excercise__container">
                <div className="yellow"></div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <div className="excercise__header">
                    <div>Exercise</div>
                    {console.log("ex", selectedExercises)}
                    <div>
                      {" "}
                      {selectedWorkoutEdit ? (
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

                  {selectedExercises?.map((workout, idx1) => (
                    <div>
                      <div className="excercise__body">
                        <div
                          className="excercise"
                          style={{
                            display: "flex",
                            alignContent: "center",
                            alignItems: "center",
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
                                width: "100px",
                                height: "56px",
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
                          <div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    height: "20px",
                                    marginBottom: 10,
                                  }}
                                >
                                  {workout?.name}
                                </div>
                              </div>
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
                                          display: "flex",
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
                            </div>
                          </div>
                        </div>

                        <div
                          style={{ fontSize: 12 }}
                          onClick={() => {
                            if (selectedWorkoutEdit === "") {
                              setSelectedWorkoutEdit(idx1);
                            } else {
                              setSelectedWorkoutEdit("");
                            }
                          }}
                        >
                          view details
                        </div>
                      </div>
                      <div>
                        {selectedWorkoutEdit === idx1 && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              borderBottom: "1px solid black",
                            }}
                          >
                            {type == "non-editable" || workout.cardio ? null : (
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

                                  let tmp = {};

                                  Object.keys(temp[idx1].sets[0]).forEach(
                                    (val) => {
                                      tmp[val] = "";
                                    }
                                  );

                                  temp[idx1].sets.push(tmp);

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
                            )}

                            {workout.sets?.map((set, idx2) => (
                              <div
                                key={idx2}
                                style={{
                                  display: "flex",
                                  alignItems: "center",

                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{
                                    marginLeft: "-15px",
                                    marginRight: "5px",
                                  }}
                                  onClick={() => {
                                    {
                                      let temp = [...selectedExercises];
                                      if (temp[idx1].sets.length > 1) {
                                        temp[idx1].sets.splice(idx2, 1);
                                        setSelectedExercises(temp);
                                      }
                                    }
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

                                {Object.keys(set).map((set_, idx5) => (
                                  <div
                                    key={idx5}
                                    style={{
                                      marginLeft: "10px",
                                      marginRight: "10px",
                                      display: "flex",
                                      alignItems: "center",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <div
                                      style={{
                                        margin: 5,
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        textAlign: "center",
                                        marginRight: "10px",
                                      }}
                                    >
                                      {set_}
                                    </div>
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
                                      value={workout.sets[idx2][set_]}
                                      placeholder={"12"}
                                      onChange={(e) => {
                                        let temp = [...selectedExercises];
                                        let tmp = selectedExercises[idx1].sets;
                                        tmp[idx2][set_] = e.target.value;
                                        temp[idx1].sets = tmp;

                                        console.log(idx2, tmp[idx2][set_]);

                                        // temp[idx1].sets[idx4][set_] =
                                        //   e.target.value;

                                        // temp[idx1].sets[idx4][set_] =
                                        //   e.target.value;
                                        setSelectedExercises(temp);
                                      }}
                                    />
                                  </div>
                                ))}
                                {/* {workout.cardio ? null : (
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
                                      disabled={
                                        type == "non-editable" || type == "view"
                                      }
                                      value={String(set.reps)}
                                      placeholder={"12"}
                                      onChange={(e) => {
                                        let temp = [...selectedExercises];
                                        temp[idx1].sets[idx2].reps =
                                          e.target.value;
                                        setSelectedExercises(temp);
                                      }}
                                    />
                                  </div>
                                )}
                                {workout.cardio ? null : (
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
                                        temp[idx1].sets[idx2].weights =
                                          e.target.value;
                                        setSelectedExercises(temp);
                                      }}
                                      disabled={
                                        type == "non-editable" || type == "view"
                                      }
                                    />
                                  </div>
                                )} */}
                                {/* <div
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
                                    {workout.cardio ? "Time" : "Rest"}
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
                                    disabled={
                                      type == "non-editable" || type == "view"
                                    }
                                    value={String(set.rest)}
                                    placeholder={"12"}
                                    onChange={(e) => {
                                      let temp = [...selectedExercises];
                                      temp[idx1].sets[idx2].rest =
                                        e.target.value;
                                      setSelectedExercises(temp);
                                    }}
                                  />
                                </div> */}
                              </div>
                            ))}

                            {/* <div
                              style={{
                                borderBottom: "2px solid black",

                                borderColor: "red",
                                width: 200,
                              }}
                              className=""
                            >
                              hi
                            </div> */}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
