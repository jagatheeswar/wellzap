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
import SelectSearch, { fuzzySearch } from "react-select-search";

import Switch from "@material-ui/core/Switch";
import { Grid } from "@material-ui/core";

import moment from "moment";
import "./dropdown.css";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import styled from "styled-components";
import CheckIcon from "@material-ui/icons/Check";
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

const InputWrapper = styled("div")`
  width: 350px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

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
  margin-left: 20px;
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

function AssignWorkout(props) {
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
  const [athlete_dates, setathlete_dates] = useState({});
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
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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
      selectedAthletes.forEach((item, idx) => {
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
      item.value = item._id;
      //item.data = item;
    });

    setExercises(objs);
    console.log(objs);
  }, [objs, userData]);

  useEffect(() => {
    if (workoutVideoUrl) {
      setVideoLoading(false);
    }
  }, [workoutVideoUrl]);

  useEffect(() => {
    if (selectedExercises && workout) {
      let temp = { ...workout };

      temp.data.preWorkout.selectedExercises = selectedExercises;
      setWorkout(temp);
    }
  }, [selectedExercises]);

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

  // useEffect(() => {
  //   if (workout) {
  //     let temp = [...workout];
  //     if (selectedExercises.length > 0) {
  //       temp.data.preWorkout.selectedExercises = selectedExercises;
  //       setWorkout(temp);
  //     }
  //   }
  // }, [selectedExercises, workout]);

  useEffect(() => {
    console.log("st", location.state);
    if (location.state?.workout) {
      setWorkout(location.state?.workout);

      setworkoutDifficulty(
        location.state?.workout?.data?.preWorkout?.workoutDifficulty
      );

      setworkoutDescription(
        location.state?.workout?.data?.preWorkout?.workoutDescription
      );

      setcaloriesBurnEstimate(
        location.state?.workout?.data?.preWorkout?.caloriesBurnEstimate
      );

      setworkoutDuration(
        location.state?.workout?.data?.preWorkout?.workoutDuration
      );
      setSelectedExercises(
        location.state?.workout?.data?.preWorkout?.selectedExercises
      );

      if (location.state?.workout?.data?.selectedAthletes) {
        //console.log("gagna")
        //console.log(location.state?.workout?.data?.selectedAthletes)
        setSelectedAthletes(location.state?.workout?.data?.selectedAthletes);
      }
    }
  }, [location]);

  useEffect(() => {
    if (props?.isLongTerm) {
      setWorkout({ data: props.selectedDayData });
      setworkoutDifficulty(props.selectedDayData.preWorkout.workoutDifficulty);
      setworkoutDescription(
        props.selectedDayData.preWorkout?.workoutDescription
      );

      setcaloriesBurnEstimate(
        props.selectedDayData.preWorkout?.caloriesBurnEstimate
      );

      setworkoutDuration(props.selectedDayData.preWorkout?.workoutDuration);
      setSelectedExercises(props.selectedDayData.preWorkout?.selectedExercises);
      if (props.selectedDayData.selectedAthletes) {
        setSelectedAthletes(props.selectedDayData?.selectedAthletes);
      }
    }
  }, [props?.isLongTerm]);

  useEffect(() => {
    if (group && workout) {
      let temp = { ...workout };
      temp.data.preWorkout.group = group;
      setWorkout(temp);
    }
  }, [group]);

  useEffect(() => {
    let temp = [...selectedAthletes];

    let tmp = { ...athlete_dates };

    console.log(selectedAthletes, athlete_dates);
    selectedAthletes.map((athlete, idx) => {
      console.log(athlete);
      if (athlete_selecteddays[athlete.id]) {
        temp[idx].selectedDays = athlete_selecteddays[athlete.id];
      } else {
        if (athlete_dates[athlete.id]) {
          // temp[idx].selectedDays = athlete_selecteddays[athlete.id];
        } else {
          var curr = new Date(); // get current date
          var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

          var firstday = new Date(curr.setDate(first)).toUTCString();
          var lastday = new Date(
            curr.setDate(curr.getDate() + 6)
          ).toUTCString();

          temp[idx].currentStartWeek = formatSpecificDate(firstday);
          temp[idx].currentEndWeek = formatSpecificDate(lastday);

          let t1 = formatSpecificDate(firstday);

          let datesCollection = [];

          for (var i = 0; i < 7; i++) {
            datesCollection.push(t1);
            t1 = incr_date(t1);
          }

          tmp[athlete.id] = datesCollection;

          console.log(athlete_dates);
        }
      }
      setathlete_dates(tmp);

      setSelectedAthletes1(temp);
    });
  }, [selectedAthletes]);
  useEffect(() => {
    console.log(athlete_dates);
  }, [athlete_dates]);

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
  }, [type, location.state?.workout]);

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
  }, []);

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
    <div>
      <WorkoutScreenHeader name="Assign Workout" />

      <div className="assignWorkout">
        <img
          style={{ objectFit: "cover" }}
          src="/assets/illustration.jpeg"
          width="100%"
          height="150px"
        />
        <div className="assignWorkout__banner">
          <img
            src={
              userData?.data?.imageUrl
                ? userData?.data?.imageUrl
                : "https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/images%2FuserImage.jpeg?alt=media&token=7a57513d-4d38-410d-b176-cdb5a3bdb6ef"
            }
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
                  let temp = { ...workout };
                  setworkoutDescription(val.target.value);
                  temp.data.preWorkout.workoutDescription = val.target.value;
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
                    temp.data.preWorkout.workoutDuration = val.target.value;
                    setWorkout(temp);
                  }}
                />
                <img src="/assets/Icon_awesome_burn.png" alt="" />
                <input
                  value={caloriesBurnEstimate}
                  disabled={type == "non-editable" || type == "view"}
                  onChange={(val) => {
                    //console.log(workout.data.preWorkout?.workoutDuration);
                    let temp = workout;
                    setcaloriesBurnEstimate(val.target.value);
                    temp.data.preWorkout.caloriesBurnEstimate =
                      val.target.value;
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
                          workout?.data?.preWorkout?.equipmentsNeeded?.length -
                            1
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
                          workout?.data?.preWorkout?.targetedMuscleGroup
                            ?.length -
                            1
                            ? ", "
                            : null}
                        </h6>
                      )
                    )}
                  </div>
                </div>
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
                  {selectedAthletes1?.map((athlete, idx) => (
                    <div
                      onClick={() => {
                        let temp = [];
                        if (show_data[0]?.id == athlete.id) {
                          setshow_data([]);
                        } else {
                          temp.push(athlete);
                          setshow_data(temp);
                          // console.log(athlete.name, show_data);
                        }
                      }}
                      style={{
                        backgroundColor:
                          athlete?.id == show_data[0]?.id ? "#FFE486" : "white",
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
                          src={
                            athlete.imageUrl
                              ? athlete.imageUrl
                              : "https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/images%2FuserImage.jpeg?alt=media&token=7a57513d-4d38-410d-b176-cdb5a3bdb6ef"
                          }
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
                  {console.log(show_data)}
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
                          // backgroundColor: "#ffe486",
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
                          src={
                            athlete.imageUrl
                              ? athlete.imageUrl
                              : "https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/images%2FuserImage.jpeg?alt=media&token=7a57513d-4d38-410d-b176-cdb5a3bdb6ef"
                          }
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

                              display: "flex",
                              alignItems: "center",
                            }}
                            onClick={() => {
                              var curr = new Date(athlete.currentStartWeek); // get current date
                              var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

                              var firstday = new Date(
                                curr.setDate(first)
                              ).toUTCString();
                              var lastday = new Date(
                                curr.setDate(curr.getDate() + 6)
                              ).toUTCString();
                              if (
                                new Date(athlete.currentStartWeek) > new Date()
                              ) {
                                let temp = { ...athlete_dates };
                                let tm = [...selectedAthletes1];
                                tm[index].currentStartWeek =
                                  formatSpecificDate(firstday);

                                tm[index].currentEndWeek =
                                  formatSpecificDate(lastday);
                                setSelectedAthletes1(tm);

                                let tmp = formatSpecificDate(firstday);

                                let datesCollection = [];

                                for (var i = 0; i < 7; i++) {
                                  datesCollection.push(tmp);
                                  tmp = incr_date(tmp);
                                }

                                temp[athlete.id] = datesCollection;

                                setathlete_dates(temp);
                              }
                            }}
                          >
                            <ChevronLeftIcon />
                          </IconButton>
                          {console.log(athlete_dates)}

                          {daysList.map((day, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                if (
                                  type !== "view" &&
                                  type !== "non-editable"
                                ) {
                                  if (
                                    athlete?.selectedDays?.includes(
                                      athlete_dates[athlete.id][idx]
                                    )
                                  ) {
                                    let selected =
                                      selectedAthletes[index].selectedDays;
                                    var index1 = selected.indexOf(
                                      athlete_dates[athlete.id][idx]
                                    );
                                    if (index1 !== -1) {
                                      selected.splice(index1, 1);
                                      selectedAthletes[index] = {
                                        ...selectedAthletes[index],
                                        selected,
                                      };
                                      setSelectedAthletes([
                                        ...selectedAthletes,
                                      ]);
                                    }
                                  } else {
                                    if (
                                      new Date(athlete_dates[athlete.id][idx]) >
                                        new Date() ||
                                      athlete_dates[athlete.id][idx] ===
                                        formatDate()
                                    ) {
                                      let selectedDays =
                                        selectedAthletes[index].selectedDays;
                                      selectedAthletes[index] = {
                                        ...selectedAthletes[index],
                                        selectedDays: [
                                          ...selectedDays,
                                          athlete_dates[athlete.id][idx],
                                        ],
                                      };
                                      let temp = athlete_selecteddays;
                                      temp[selectedAthletes[index].id] =
                                        selectedAthletes[index].selectedDays;

                                      setathlete_selecteddays(temp);
                                      setSelectedAthletes([
                                        ...selectedAthletes,
                                      ]);
                                    }
                                  }
                                }
                              }}
                              style={
                                athlete?.selectedDays?.includes(
                                  athlete_dates[athlete.id][idx]
                                )
                                  ? {
                                      backgroundColor: "#ffe486",
                                      color: "#fff",
                                      width: "85px",

                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "relative",
                                      borderRadius: "8px",
                                      marginRight: "2px",
                                      cursor: "pointer",
                                    }
                                  : {
                                      width: "85px",

                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "relative",
                                      borderRadius: "8px",
                                      marginRight: "2px",
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

                                    textAlign: "center",
                                    padding: "5px",
                                    color:
                                      new Date(athlete_dates[athlete.id][idx]) <
                                      new Date(formatDate())
                                        ? "grey"
                                        : "black",
                                  }}
                                >
                                  {day}
                                </div>

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

                                      paddingBottom: "5px",
                                      textAlign: "center",
                                      color:
                                        new Date(
                                          athlete_dates[athlete.id][idx]
                                        ) < new Date(formatDate())
                                          ? "grey"
                                          : "black",
                                    }}
                                  >
                                    {formatSpecificDate1(
                                      athlete_dates[athlete.id][idx]
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          <IconButton
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                            onClick={() => {
                              var curr = new Date(athlete.currentStartWeek); // get current date
                              var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

                              var firstday = new Date(
                                curr.setDate(first)
                              ).toUTCString();
                              var lastday = new Date(
                                curr.setDate(curr.getDate() + 6)
                              ).toUTCString();
                              let temp = { ...athlete_dates };
                              let tm = [...selectedAthletes1];
                              tm[index].currentStartWeek =
                                formatSpecificDate(firstday);

                              tm[index].currentEndWeek =
                                formatSpecificDate(lastday);
                              setSelectedAthletes1(tm);

                              let tmp = formatSpecificDate(firstday);

                              let datesCollection = [];

                              for (var i = 0; i < 7; i++) {
                                datesCollection.push(tmp);
                                tmp = incr_date(tmp);
                              }

                              temp[athlete.id] = datesCollection;

                              setathlete_dates(temp);
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
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div {...getRootProps()}>
                <Label
                  style={{
                    fontSize: 18,
                    marginLeft: 20,
                    fontWeight: 400,
                  }}
                >
                  Search for Athletes
                </Label>
                <InputWrapper
                  style={{ marginLeft: 20 }}
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid
                  container
                  spacing={2}
                  className="coachNutrition__homeContainer"
                >
                  {selectedAthletes1?.map((athlete, index) => (
                    <Grid
                      item
                      xs={6}
                      className="coachNutrition__homeRightContainer"
                    >
                      <div
                        key={index}
                        style={{
                          marginTop: "25px",
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "95%",
                          backgroundColor: "white",
                          borderRadius: 5,
                          padding: 15,
                          boxSizing: "border-box",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#ffe486",
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
                            src={
                              athlete.imageUrl
                                ? athlete.imageUrl
                                : "https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/images%2FuserImage.jpeg?alt=media&token=7a57513d-4d38-410d-b176-cdb5a3bdb6ef"
                            }
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
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "300px",
                            }}
                          >
                            <IconButton
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                              onClick={() => {
                                if (type != "view") {
                                  var curr = new Date(athlete.currentStartWeek); // get current date
                                  var first =
                                    curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

                                  var firstday = new Date(
                                    curr.setDate(first)
                                  ).toUTCString();
                                  var lastday = new Date(
                                    curr.setDate(curr.getDate() + 6)
                                  ).toUTCString();
                                  if (
                                    new Date(athlete.currentStartWeek) >
                                    new Date()
                                  ) {
                                    let temp = { ...athlete_dates };
                                    let tm = [...selectedAthletes1];
                                    tm[index].currentStartWeek =
                                      formatSpecificDate(firstday);

                                    tm[index].currentEndWeek =
                                      formatSpecificDate(lastday);
                                    setSelectedAthletes1(tm);

                                    let tmp = formatSpecificDate(firstday);

                                    let datesCollection = [];

                                    for (var i = 0; i < 7; i++) {
                                      datesCollection.push(tmp);
                                      tmp = incr_date(tmp);
                                    }

                                    temp[athlete.id] = datesCollection;

                                    setathlete_dates(temp);
                                  }
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
                                        athlete_dates[athlete.id][idx]
                                      )
                                    ) {
                                      let selected =
                                        selectedAthletes[index].selectedDays;
                                      var index1 = selected.indexOf(
                                        athlete_dates[athlete.id][idx]
                                      );
                                      if (index1 !== -1) {
                                        selected.splice(index1, 1);
                                        selectedAthletes[index] = {
                                          ...selectedAthletes[index],
                                          selected,
                                        };
                                        setSelectedAthletes([
                                          ...selectedAthletes,
                                        ]);
                                      }
                                    } else {
                                      if (
                                        new Date(
                                          athlete_dates[athlete.id][idx]
                                        ) > new Date() ||
                                        athlete_dates[athlete.id][idx] ===
                                          formatDate()
                                      ) {
                                        let selectedDays =
                                          selectedAthletes[index].selectedDays;
                                        selectedAthletes[index] = {
                                          ...selectedAthletes[index],
                                          selectedDays: [
                                            ...selectedDays,
                                            athlete_dates[athlete.id][idx],
                                          ],
                                        };
                                        let temp = athlete_selecteddays;
                                        temp[selectedAthletes[index].id] =
                                          selectedAthletes[index].selectedDays;

                                        setathlete_selecteddays(temp);
                                        setSelectedAthletes([
                                          ...selectedAthletes,
                                        ]);
                                      }
                                    }
                                  }
                                }}
                                style={
                                  athlete?.selectedDays?.includes(
                                    athlete_dates[athlete.id][idx]
                                  )
                                    ? {
                                        backgroundColor: "#ffe486",
                                        color: "#fff",
                                        width: "85px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        position: "relative",
                                        borderRadius: "8px",
                                        marginRight: "2px",

                                        cursor: "pointer",
                                      }
                                    : {
                                        width: "85px",

                                        justifyContent: "center",
                                        alignItems: "center",
                                        position: "relative",
                                        borderRadius: "8px",
                                        marginRight: "2px",
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
                                      color:
                                        new Date(
                                          athlete_dates[athlete.id][idx]
                                        ) < new Date(formatDate())
                                          ? "grey"
                                          : "black",
                                    }}
                                  >
                                    {day}
                                  </div>
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

                                        paddingBottom: "5px",
                                        textAlign: "center",
                                        color:
                                          new Date(
                                            athlete_dates[athlete.id][idx]
                                          ) < new Date(formatDate())
                                            ? "grey"
                                            : "black",
                                      }}
                                    >
                                      {formatSpecificDate1(
                                        athlete_dates[athlete.id][idx]
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                            <IconButton
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                              onClick={() => {
                                if (type != "view") {
                                  var curr = new Date(athlete.currentStartWeek); // get current date
                                  var first =
                                    curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

                                  var firstday = new Date(
                                    curr.setDate(first)
                                  ).toUTCString();
                                  var lastday = new Date(
                                    curr.setDate(curr.getDate() + 6)
                                  ).toUTCString();

                                  let temp = { ...athlete_dates };
                                  let tm = [...selectedAthletes1];
                                  tm[index].currentStartWeek =
                                    formatSpecificDate(firstday);

                                  tm[index].currentEndWeek =
                                    formatSpecificDate(lastday);
                                  setSelectedAthletes1(tm);

                                  let tmp = formatSpecificDate(firstday);

                                  let datesCollection = [];

                                  for (var i = 0; i < 7; i++) {
                                    datesCollection.push(tmp);
                                    tmp = incr_date(tmp);
                                  }

                                  temp[athlete.id] = datesCollection;

                                  setathlete_dates(temp);

                                  setCurrentStartWeek(
                                    formatSpecificDate(firstday)
                                  );
                                  setCurrentEndWeek(
                                    formatSpecificDate(lastday)
                                  );
                                }
                              }}
                            >
                              <ChevronRightIcon />
                            </IconButton>
                          </div>
                          {/* 
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
                        {athlete_dates[athlete.id]?.map((tempDate, idx) => (
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
                                color:
                                  new Date(athlete_dates[athlete.id][idx]) <
                                  new Date(formatDate())
                                    ? "grey"
                                    : "black",
                              }}
                            >
                              {formatSpecificDate1(tempDate)}
                            </div>
                          </div>
                        ))}
                      </div> */}
                        </div>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </div>
          )}

          <div>
            {console.log(workout, selectedExercises)}
            <div className="Workouts_body">
              <h3>Add Exercises</h3>
              {console.log(selectedExercises)}
              {selectedExercises?.map((item, idx1) => (
                <div key={idx1}>
                  <div
                    style={{
                      marginTop: 20,
                    }}
                  >
                    {type != "non-editable" && (
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        {exercises?.length > 0 && (
                          <div
                            style={{
                              width: "50%",
                            }}
                          >
                            <SelectSearch
                              options={exercises}
                              onChange={(d, f) => {
                                let temp = [...selectedExercises];
                                let tmp = { ...workout };

                                console.log(d, f);
                                temp[idx1] = f;
                                temp[idx1].sets = [];

                                temp[idx1].sets.push({
                                  reps: "12",
                                  weights: "12",
                                  // sets: "",
                                  rest: "12",
                                });

                                console.log(workout);
                                tmp.data.preWorkout.selectedExercises = temp;

                                setSelectedExercises(temp);
                                console.log(f);
                                setWorkout(tmp);

                                // navigation.navigate("AddWorkout");
                              }}
                              value={selectedExercises[idx1].value}
                              name="language"
                              search
                              filterOptions={fuzzySearch}
                              placeholder="Search for a Workout"
                            />
                          </div>
                        )}
                        <div style={{ width: "40%", marginLeft: 20 }}>
                          <SelectSearch
                            className="select-search sets"
                            options={[
                              {
                                name: "Reps/Weight/Rest",
                                value: 1,
                              },
                              {
                                name: "Reps",
                                value: 2,
                              },
                              {
                                name: "Time",
                                value: 3,
                              },
                            ]}
                            onChange={(val, dat) => {
                              let temp = [...selectedExercises];
                              temp[idx1].sets = [];
                              console.log(val);
                              if (val == 1) {
                                temp[idx1].sets.push({
                                  reps: "12",
                                  weights: "0",
                                  // sets: "",
                                  rest: "30",
                                });
                              }
                              if (val == 2) {
                                temp[idx1].sets.push({
                                  reps: "12",
                                });
                              }
                              if (val == 3) {
                                temp[idx1].sets.push({
                                  time: "30",
                                });
                              }

                              setSelectedExercises(temp);
                            }}
                          />
                        </div>
                        <div
                          style={{
                            marginLeft: 20,
                            display: "flex",
                            marginLeft: "auto",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            let temp = [...selectedExercises];
                            if (temp.length > 1) {
                              temp.splice(idx1, 1);
                              setSelectedExercises(temp);
                            }
                          }}
                        >
                          {" "}
                          <CloseIcon />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* {
                    // selectedExercises.length > 0 ? (
                    data?.value ? (
                      selectedExercises
                        .slice(idx1, idx1 + 1)
                        .map((workout, idx2) => ( */}
                  <div
                    key={idx1}
                    style={{
                      marginTop: 20,
                      boxSizing: "border-box",
                      display: item.value ? "block" : "none",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "white",
                        borderRadius: 10,
                        cursor: "pointer",
                        padding: 20,
                        backgroundColor: "white",
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
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={() => {
                          console.log(item);
                          if (item?.videoUrl) {
                            setWorkoutVideoUrl(item.videoUrl);
                            setOpenDialog(true);
                            setVideoLoading(true);
                          }
                        }}
                      >
                        <img
                          style={{
                            width: "150px",
                            height: "84px",
                            borderRadius: "8px",
                            backgroundColor: "#d3d3d3",
                            objectFit: "cover",
                            marginRight: "15px",
                          }}
                          src={
                            item.thumbnail_url
                              ? item.thumbnail_url
                              : "/assets/illustration.jpeg"
                          }
                        />
                      </div>
                      <div
                        style={{
                          marginLeft: "10px",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
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
                                marginBottom: 7,
                              }}
                            >
                              {item?.name}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            {item?.sets?.map((s, i) => (
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
                                      {item?.sets?.map((s, i) => (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div
                                            key={i}
                                            style={{
                                              fontSize: 13,
                                              fontWeight: 500,
                                              width: 30,
                                              textAlign: "center",
                                            }}
                                          >
                                            {s[set_] ? s[set_] : 12}
                                          </div>
                                          {i < item.sets.length - 1
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
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              marginRight: 20,
                              marginTop: 10,
                            }}
                          >
                            <h3 style={{ fontSize: 11 }}>Edit</h3>

                            <div>
                              {selectedWorkoutEdit === idx1 ? (
                                <img
                                  style={{
                                    width: 20,
                                    height: 20,
                                  }}
                                  src="../assets/up.png"
                                />
                              ) : (
                                <img
                                  style={{
                                    width: 20,
                                    height: 20,
                                  }}
                                  src="../assets/down.png"
                                />
                              )}
                            </div>
                          </div>
                          {/* <div
                            onClick={() => {
                              selectedExercises.splice(idx1, 1);
                            }}
                          >
                            {" "}
                            <CloseIcon />
                          </div> */}
                        </div>
                      </div>
                    </div>
                    {selectedWorkoutEdit === idx1 && (
                      <div
                        style={{
                          backgroundColor: "white",
                          padding: 20,
                          boxSizing: "border-box",
                          display: item.value ? "block" : "none",
                          marginTop: 20,
                          borderRadius: 10,
                        }}
                      >
                        {item.sets?.map((set, idx2) => (
                          <div
                            key={idx2}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              marginTop: "10px",
                              marginBottom: "10px",
                              backgroundColor: "white",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignSelf: "flex-end",
                              }}
                            >
                              {type != "non-editable" && (
                                <div
                                  style={{}}
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
                              )}
                              <div style={{}}>Set {idx2 + 1}</div>
                            </div>

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
                                  maxLength="3"
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
                                  value={item.sets[idx2][set_]}
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
                                      temp[idx1].sets[idx2].reps =
                                        e.target.value;
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
                                      temp[idx1].sets[idx2].weights =
                                        e.target.value;
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
                                      temp[idx1].sets[idx2].rest =
                                        e.target.value;
                                      setSelectedExercises(temp);
                                    }}
                                  />
                                </div> */}
                          </div>
                        ))}
                        {type != "non-editable" && (
                          <div
                            style={{
                              borderWidth: "1px",
                              borderColor: "#fcd13c",
                              borderStyle: "solid",
                              padding: "5px",
                              borderRadius: "10px",
                              width: "120px",
                              height: "20px",
                              marginTop: "20px",
                              marginBottom: "10px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "white",
                            }}
                            onClick={() => {
                              // navigation.navigate("AddWorkout");
                              let temp = [...selectedExercises];

                              let tmp = {};

                              Object.keys(temp[idx1].sets[0]).forEach((val) => {
                                if (val == "weights") {
                                  tmp[val] = "0";
                                }
                                if (val == "reps") {
                                  tmp[val] = "12";
                                }
                                if (val == "rest") {
                                  tmp[val] = "30";
                                }
                                if (val == "time") {
                                  tmp[val] = "30";
                                } else {
                                  tmp[val] = "12";
                                }
                              });

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
                      </div>
                    )}
                  </div>

                  {/* <div
                    style={{
                      display: idx1 == 0 ? "none" : "block",
                      marginTop: 20,
                      fontSize: 16,
                      backgroundColor: "#FFE486",
                      width: 150,
                      borderRadius: 10,
                      padding: 10,
                      textAlign: "center",
                    }}
                    onClick={() => {
                      selectedExercises.splice(idx1, 1);
                    }}
                  >
                    Delete Workout
                  </div> */}

                  {/* <div
                    style={{
                      width: "100%",
                      marginTop: 20,
                      display:
                        selectedExercises.length - 1 == idx1 ? "none" : "block",
                    }}
                    className="Dotted_line"
                  ></div> */}
                </div>
              ))}
            </div>
            {type != "non-editable" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: 30,
                  justifyContent: "flex-end",
                }}
              >
                {/* <div className="Dotted_line"></div> */}
                <div
                  style={{
                    display: "flex",
                    height: 30,
                  }}
                >
                  <button
                    style={{
                      border: "none",
                      outline: "none",
                      width: 100,
                      height: 40,
                      backgroundColor: "#ffe486",
                      borderRadius: 7,
                      boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.2)",
                    }}
                    onClick={() => {
                      let temp = [...selectedExercises];

                      temp.push({
                        value: null,
                      });
                      setSelectedExercises(temp);
                      console.log("smk", selectedExercises);
                    }}
                  >
                    Add Exercise
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* <div className="createWorkout__exercises">
            <div
              style={{
                marginTop: 20,
              }}
            >
              <div>
                {props.isLongTerm ||
                userType == "athlete" ||
                type == "non-editable" ? null : (
                  <div style={{ width: "100%", margin: 20 }}>
                    <SearchableDropdown
                      name="Search for Exercise"
                      list={cardio ? cardioExercise : exercises}
                      state={selectedExercises}
                      setState={setSelectedExercises}
                      cardio={cardio}
                    />
                  </div>
                )}

                <div
                  className="excercise__container"
                  style={{
                    margin: 20,
                    width: "95%",
                    boxSizing: "border-box",
                  }}
                >
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

                      <div></div>
                    </div>

                    {selectedExercises?.map((item, idx1) => (
                      <div>
                        <div
                          key={idx1}
                          style={{
                            marginTop: 20,
                            boxSizing: "border-box",
                            width: "100%",
                          }}
                        >
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
                              cursor: "pointer",
                              marginTop: 20,
                              padding: 20,
                              borderRadius: 10,
                            }}
                            onClick={() => {
                              //console.log(3);
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
                                cursor: "pointer",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                                onClick={(e) => {
                                  setWorkoutVideoUrl(item.videoUrl);
                                  setOpenDialog(true);
                                  setVideoLoading(true);
                                }}
                              >
                                <img
                                  style={{
                                    width: 150,
                                    height: 84,
                                    borderRadius: 8,
                                    backgroundColor: "#d3d3d3",
                                    marginRight: 15,
                                    objectFit: "cover",
                                  }}
                                  src={
                                    item.thumbnail_url
                                      ? ` ${item.thumbnail_url}`
                                      : "../assets/illustration.jpeg"
                                  }
                                />
                              </div>
                              <div
                                style={{
                                  marginLeft: 10,
                                  textAlign: "left",
                                  width: "100%",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 17,
                                    fontWeight: 700,
                                    marginBottom: 7,
                                  }}
                                >
                                  {item.name}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  {item?.sets?.map((s, i) => (
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
                                            {item?.sets?.map((s, i) => (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <div
                                                  key={i}
                                                  style={{
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                    width: 30,
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  {s[set_] ? s[set_] : 12}
                                                </div>
                                                {i < item.sets.length - 1
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
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  marginRight: 20,
                                  marginTop: 10,
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "column",
                                  fontSize: 15,
                                }}
                              >
                                <div>Edit</div>
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
                              <div
                                onClick={() => {
                                  selectedExercises.splice(idx1, 1);
                                }}
                              >
                                {" "}
                                <CloseIcon />
                              </div>
                            </div>
                          </button>

                          {selectedWorkoutEdit === idx1 && (
                            <div
                              style={{
                                backgroundColor: "white",
                                padding: 20,
                                boxSizing: "border-box",
                                marginTop: 20,
                                borderRadius: 10,
                              }}
                            >
                              {item.sets?.map((set, idx2) => (
                                <div
                                  key={idx2}
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    backgroundColor: "white",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignSelf: "flex-end",
                                    }}
                                  >
                                    <div
                                      style={{}}
                                      onClick={() => {
                                        let temp = [...selectedExercises];
                                        if (temp[idx1].sets.length > 1) {
                                          temp[idx1].sets.splice(idx2, 1);
                                          setSelectedExercises(temp);
                                        }
                                      }}
                                    >
                                      <CloseIcon />
                                    </div>
                                    <div style={{}}>Set {idx2 + 1}</div>
                                  </div>
                                  {console.log("st1", item.sets)}
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
                                        maxLength="3"
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
                                        value={String(set[set_])}
                                        placeholder={"12"}
                                        onChange={(e) => {
                                          let temp = [...selectedExercises];
                                          console.log(temp[idx1].sets);

                                          temp[idx1].sets[idx2][set_] =
                                            e.target.value;
                                          setSelectedExercises(temp);
                                        }}
                                      />
                                    </div>
                                  ))}
                                 
                                </div>
                              ))}
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
                                  backgroundColor: "white",
                                }}
                                onClick={() => {
                                  // navigation.navigate("AddWorkout");
                                  let temp = [...selectedExercises];
                                  let tmp = {};

                                  Object.keys(temp[idx1].sets[0]).forEach(
                                    (val) => {
                                      if (val == "weights") {
                                        tmp[val] = "0";
                                      }
                                      if (val == "reps") {
                                        tmp[val] = "12";
                                      }
                                      if (val == "rest") {
                                        tmp[val] = "30";
                                      }
                                      if (val == "time") {
                                        tmp[val] = "30";
                                      }
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
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {props.isLongTerm ? null : (
            <div
              className="createWorkout__completeWorkoutButton"
              onClick={() => {
                if (userType === "athlete") {
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
                          createdAt: new Date(),
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
                                  createdAt: new Date(),
                                  assignedById: workout.data?.assignedById,
                                  assignedToId: workout.data?.assignedToId,
                                  date: workout.data?.date,
                                  completed: false,
                                  preWorkout: workout.data?.preWorkout,
                                  saved: false,
                                  selectedAthletes,
                                  coachWorkoutId: docRef.id,
                                  selectedDay: new Date(workout.date?.date),
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
          )}
        </div>
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
        {/* <Modal
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
          <video width="500" height="400" autoplay controls>
            <source src={workoutVideoUrl} />
          </video>
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
      </Modal> */}
      </div>
    </div>
  );
}

export default AssignWorkout;
