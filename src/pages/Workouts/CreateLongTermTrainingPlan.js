import React, { useEffect, useState } from "react";
import WorkoutScreenHeader from "./WorkoutScreenHeader";
import {
  Dialog,
  DialogContent,
  Grid,
  Divider,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { EventNoteOutlined, DashboardOutlined } from "@material-ui/icons";
import CoachAddWorkout from "./CoachAddWorkout";
import ViewAllSavedWorkouts from "./ViewAllSavedWorkouts";
import { db } from "../../utils/firebase";
import { selectUserData } from "../../features/userSlice";
import { useSelector } from "react-redux";
import firebase from "firebase";
import Modal from "react-awesome-modal";
import styled from "styled-components";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Calendar, utils } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import "date-fns";
import AssignWorkout from "./AssignWorkout";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
import incr_date from "../../functions/incr_date";
import formatSpecificDate from "../../functions/formatSpecificDate";

import formatSpecificDate1 from "../../functions/formatSpecificDate1";
import CreateOwnWorkout from "./CreateOwnWorkout";
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

const CreateLongTermTrainingPlan = () => {
  const userData = useSelector(selectUserData);
  const [weeks, setWeeks] = React.useState([
    {
      weeknum: 1,
      days: {
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: "",
      },
    },

    // { weeknum: 2, days: {monday: '', tuesday: ''} },
    // { weeknum: 3, days: {monday: '', tuesday: ''} }
  ]);

  const history = useHistory();
  const [checkBox, setCheckBox] = React.useState([
    { name: "week2", checked: false },
    { name: "week3", checked: false },
    { name: "week4", checked: false },
    { name: "week5", checked: false },
    { name: "week6", checked: false },
    { name: "week7", checked: false },
    { name: "week8", checked: false },
    { name: "week9", checked: false },
    { name: "week10", checked: false },
    { name: "week11", checked: false },
    { name: "week12", checked: false },
    { name: "week13", checked: false },
    { name: "week14", checked: false },
    { name: "week15", checked: false },
    { name: "week16", checked: false },
  ]);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogCopy, setOpenDialogCopy] = React.useState(false);
  const [openCreateworkout, setOpenCreateworkout] = React.useState(false);
  const [openCreateExercise, setOpenCreateExercise] = React.useState(false);
  const [openSavedworkout, setOpenSavedworkout] = React.useState(false);
  const [openAssignworkout, setOpenAssignworkout] = React.useState(false);
  const [showworkout, setShowworkout] = React.useState(false);
  const [selectedWeekNum, setSelectedWeekNum] = React.useState(1);
  const [selectedDay, setSelectedDay] = React.useState("monday");
  const [selectedDayData, setSelectedDayData] = React.useState(null);
  const [modal, setModal] = React.useState(false);
  const [show_data, setshow_data] = React.useState([]);
  const [modal1, setModal1] = React.useState(false);
  const [selectedAthletes, setSelectedAthletes] = React.useState([]);
  const [athletes, setAthletes] = useState([]);
  const [weekIndex, setWeekIndex] = useState(0);
  const [editable, seteditable] = useState(true);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const defaultValue = {
    year: 2021,
    month: 4,
    day: 5,
  };
  const [selectedDate, setSelectedDate] = useState(defaultValue);
  const [disabledDays, setDisabledDays] = useState({
    year: 2021,
    month: 0,
    day: 0,
  });

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
  const location = useLocation();
  const [workoutName, setWorkoutName] = useState(null);

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
    options: athletes,
    getOptionLabel: (option) => option.name,
  });

  useEffect(() => {
    console.log(location?.state);
    if (location?.state?.weeks) {
      let temp = location.state.weeks;
      setWeeks(temp);
      let tmp = [];
      if (location?.state?.selectedAthletes) {
        tmp.push(location.state.workout?.selectedAthletes[0]);
        setshow_data(tmp);
      }

      console.log(location.state.workout);
      seteditable(location.state.assignType === "view" ? false : true);
      console.log(location.state.assignType, editable);
    }
  }, [location?.state]);

  useEffect(() => {
    //console.log("3")
    if (userData?.id) {
      const data = [];
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
          });
          setAthletes(data);
        });
    }
  }, [userData?.id]);

  useEffect(() => {
    //console.log("4")
    value.map((v) => {
      v.selectedDays = [];
    });
    setSelectedAthletes(value);
  }, [value]);

  useEffect(() => {
    //console.log("5")
    let now = moment();

    let today_date = {
      year: now.get("year"),
      month: now.get("month") + 1,
      day: now.get("day"),
    };

    setSelectedDate(today_date);
    var temp = [];
    for (var i = 0; i < 90; i++) {
      if (moment(new Date()).add(i, "days").isoWeekday() != 1) {
        temp.push({
          year: moment(new Date()).add(i, "days").get("year"),
          month: moment(new Date()).add(i, "days").get("month") + 1,
          day: moment(new Date()).add(i, "days").get("date"),
        });
      }
    }
    setDisabledDays(temp);
    const dayINeed = 1;
    const today = moment().isoWeekday();

    if (today <= dayINeed) {
      //alert(moment().isoWeekday(dayINeed));
    } else {
      //alert(moment().add(1, 'weeks').isoWeekday(dayINeed))
    }
  }, []);

  useEffect(() => {
    console.log("2");
    // console.log(JSON.stringify(weeks));
    if (weeks.length <= 1) {
      setSelectedWeeks(weeks);
    } else {
      if (weeks.length >= weekIndex + 1) {
        setSelectedWeeks(weeks.slice(weekIndex, weekIndex + 2));
        //console.log(weeks.slice(weekIndex,weekIndex + 2))
      }
    }
  }, [weekIndex, weeks]);

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

  const handleClickOpenDialog = (week, day) => {
    setSelectedWeekNum(week);
    setSelectedDay(day);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickOpenDialogCopy = () => {
    setOpenDialogCopy(true);
  };

  const handleCloseDialogCopy = () => {
    setOpenDialogCopy(false);
  };

  const handleCloseworkout = () => {
    setOpenCreateworkout(false);
    setOpenSavedworkout(false);
    setOpenCreateExercise(false);
  };

  const handleWeeksCopy = () => {
    //console.log(checkBox)
    var temp = weeks;
    var index = 0;
    for (var i = checkBox.length - 1; i > 0; i--) {
      if (checkBox[i].checked) {
        index = i;
        break;
      }
    }
    //alert("index " + index)
    var len = weeks.length;
    if (index != 0 && weeks.length < index + 2) {
      for (var j = 0; j < index + 2 - len; j++) {
        temp.push({
          weeknum: len + 1 + j,
          days: {
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
            saturday: "",
            sunday: "",
          },
        });
      }
      for (var k = 0; k < index + 1; k++) {
        if (checkBox[k].checked) {
          temp[k + 1].days = weeks[weekIndex - 1].days;
          //console.log(k+2)
        }
      }
      console.log("temp " + temp);
      console.log(JSON.stringify(temp));
      setWeeks(temp);
      setWeekIndex(0);
    }
    console.log(weeks);
    setOpenDialogCopy(false);
    //alert(index)
  };

  function addDays(date, days) {
    var result = new Date(date);
    console.log(result);
    result.setDate(result.getDate() + days);

    //console.log(result.getDate(), result.getFullYear(), result.getMonth());
    return result;
  }
  function getMaxdate(days) {
    return new Promise((resolve, reject) => {
      var result = new Date();
      result.setDate(result.getDate() + days);

      //console.log(result.getDate(), , result.getMonth());
      resolve({
        year: result.getFullYear(),
        month: result.getMonth(),
        day: result.getDate(),
      });
    });
  }
  console.log(
    getMaxdate(90).then((d) => {
      console.log(d);
    })
  );

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const AssignworkoutPlan = () => {
    console.log(selectedDate);
    //console.log(selectedAthletes)

    var dat = weeks;
    var athlete = selectedAthletes;
    var local_date =
      selectedDate.year +
      "-" +
      (selectedDate.month <= 9
        ? "0" + String(selectedDate.month)
        : selectedDate.month) +
      "-" +
      (selectedDate.day <= 9 ? "0" + selectedDate.day : selectedDate.day);
    console.log("date : " + new Date(local_date));

    let tempdates = [];
    let tempDate1 = [];
    console.log("ath", athlete);
    athlete?.map((ath) => {
      ath.selectedDays?.map((d) => {
        tempDate1.push(d);
      });
    });
    if (athlete?.length > 0 && selectedDate && workoutName) {
      dat.forEach((id, idx) => {
        var dat2 = id.days;
        var keys = Object.keys(dat2);
        keys.forEach((id2, idx2) => {
          athlete?.map((ath) => {
            tempDate1.push(formatDate(addDays(local_date, 7 * idx + idx2)));
            if (ath.selectedDays) {
              ath.selectedDays = [];
              ath.selectedDays.push(
                formatDate(addDays(local_date, 7 * idx + idx2))
              );
            } else {
              ath.selectedDays.push(
                formatDate(addDays(local_date, 7 * idx + idx2))
              );
            }
          });
          //  console.log(addDays(local_date, 7 * idx + idx2));
        });
      });
      db.collection("longTermWorkout")
        .add({
          weeks,
          completed: false,
          assignedById: userData?.id,
          isLongTerm: true,
          date: formatDate(new Date()),
          workoutName: workoutName,
          saved: false,
          selectedAthletes: athlete,
          selectedDates: tempDate1,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((docRef) => {
          dat.forEach((id, idx) => {
            var dat2 = id.days;
            var keys = Object.keys(dat2);
            console.log(docRef.id);
            keys.forEach((id2, idx2) => {
              if (dat2[id2] != "") {
                athlete.forEach((ath) => {
                  // console.log(addDays(local_date, 7 * idx + idx2));
                  // console.log(id, id2, idx, idx2);
                  // console.log();
                  db.collection("workouts")
                    .add({
                      workoutName:
                        workoutName + " week-" + id.weeknum + ", day-" + idx2,
                      assignedById: userData?.id,
                      assignedToId: ath.id,
                      date: formatDate(addDays(local_date, 7 * idx + idx2)),
                      selectedAthletes: [ath],
                      timestamp:
                        firebase.firestore.FieldValue.serverTimestamp(),
                      completed: false,
                      preWorkout: dat2[id2].preWorkout,
                      saved: false,
                      coachWorkoutId: "",
                      isLongTerm: true,
                      coachWorkoutId: docRef.id,
                    })
                    .then((e) => {
                      console.log(e);
                      history.push("/workouts");
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                });
              }
            });
            if (idx + 1 == dat.length) {
              history.push("/workouts");
            }
          });
        })
        .catch((e) => {
          alert(e);
          console.log(e);
        });
    } else {
      alert("select atleast one athlete and a workoutName to continue");
    }
  };

  const handleChange = (event) => {
    //console.log(event.target.name)
    var temp = checkBox;
    //console.log(event.target.name.split("week"))
    temp[event.target.name.split("week")[1] - 2].checked = event.target.checked;
    //console.log(temp)
    setCheckBox([...temp]);
  };

  const saveLongTermworkout = () => {
    setModal(true);

    // db.collection("longTermworkout")
    //   .add({
    //     weeks,
    //     completed: false,
    //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     assignedToId: "",
    //     assignedById: userData?.id,
    //     saved: true,
    //     workoutName: workoutName,
    //   })
    //   .then(() => {
    //     alert(2);
    //   })
    //   .catch((e) => {
    //     alert(e);
    //   });
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
        }}
      >
        <WorkoutScreenHeader name="Create Long-Term Workout Plan" />

        <div
          className="addWorkout__button"
          style={{ width: 180 }}
          onClick={() => setOpenCreateExercise(true)}
        >
          <img src="/assets/plus_thin.png" alt="" width="15px" height="15px" />
          <h5>ADD OWN EXERCISE</h5>
        </div>
      </div>
      <div
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
        {!editable && (
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
                      width: "35px",
                      height: "35px",
                      borderRadius: "10px",
                      marginLeft: "20px",
                      marginRight: "20px",
                    }}
                    src={athlete?.imageUrl ? athlete?.imageUrl : null}
                  />
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      lineHeight: "28px",
                      color: "black",
                    }}
                  >
                    {athlete?.name}
                  </h2>
                </div>
                {!editable && (
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
                          if (!editable) {
                            console.log(day);
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
                                backgroundColor: "#ffe486",
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
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <div onClick={() => setWeekIndex(0)} style={{ cursor: "pointer" }}>
          <img
            style={{ objectFit: "contain" }}
            src="/assets/left_arrow.png"
            alt=""
            width="15px"
            height="15px"
          />
          <img
            style={{ objectFit: "contain" }}
            src="/assets/left_arrow.png"
            alt=""
            width="15px"
            height="15px"
          />{" "}
        </div>
        <div
          onClick={() => (weekIndex >= 1 ? setWeekIndex(weekIndex - 1) : null)}
          style={{ marginLeft: 20, cursor: "pointer" }}
        >
          <img
            style={{ objectFit: "contain" }}
            src="/assets/left_arrow.png"
            alt=""
            width="15px"
            height="15px"
          />{" "}
        </div>
        <div
          style={{
            width: 300,
            marginTop: -22,
            justifyContent: "center",
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <p>Week</p>{" "}
          {weeks?.length <= 6
            ? weeks?.map((i) => (
                <p
                  onClick={() => setWeekIndex(i.weeknum - 1)}
                  style={{
                    padding: 5,
                    cursor: "pointer",
                    fontWeight: weekIndex + 1 == i.weeknum ? "bold" : "100",
                  }}
                >
                  {i.weeknum}
                </p>
              ))
            : weekIndex <= 2
            ? weeks.slice(0, 7).map((i) => (
                <p
                  onClick={() => setWeekIndex(i.weeknum - 1)}
                  style={{
                    padding: 5,
                    cursor: "pointer",
                    fontWeight: weekIndex + 1 == i.weeknum ? "bold" : "100",
                  }}
                >
                  {i.weeknum}
                </p>
              ))
            : weekIndex >= weeks.length - 3
            ? weeks.slice(weeks.length - 6, weeks.length).map((i) => (
                <p
                  onClick={() => setWeekIndex(i.weeknum - 1)}
                  style={{
                    padding: 5,
                    cursor: "pointer",
                    fontWeight: weekIndex + 1 == i.weeknum ? "bold" : "100",
                  }}
                >
                  {i.weeknum}
                </p>
              ))
            : [
                weeks.slice(0, 2).map((i) => (
                  <p
                    onClick={() => setWeekIndex(i.weeknum - 1)}
                    style={{
                      padding: 5,
                      cursor: "pointer",
                      fontWeight: weekIndex + 1 == i.weeknum ? "bold" : "100",
                    }}
                  >
                    {i.weeknum}
                  </p>
                )),
                <p>..</p>,
                <p
                  onClick={() => setWeekIndex(weekIndex - 1)}
                  style={{ padding: 5, cursor: "pointer", fontWeight: "100" }}
                >
                  {weekIndex}
                </p>,
                <p
                  onClick={() => setWeekIndex(weekIndex)}
                  style={{ padding: 5, cursor: "pointer", fontWeight: "bold" }}
                >
                  {weekIndex + 1}
                </p>,
                <p
                  onClick={() => setWeekIndex(weekIndex + 1)}
                  style={{ padding: 5, cursor: "pointer", fontWeight: "100" }}
                >
                  {weekIndex + 2}
                </p>,
                <p>..</p>,
                weeks.slice(weeks.length - 2, weeks.length).map((i) => (
                  <p
                    onClick={() => setWeekIndex(i.weeknum - 1)}
                    style={{
                      padding: 5,
                      cursor: "pointer",
                      fontWeight: weekIndex + 1 == i.weeknum ? "bold" : "100",
                    }}
                  >
                    {i.weeknum}
                  </p>
                )),
              ]}
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() =>
            weeks.length == weekIndex + 1 ? null : setWeekIndex(weekIndex + 1)
          }
        >
          <img
            style={{ objectFit: "contain", transform: "rotate(180deg)" }}
            src="/assets/left_arrow.png"
            alt=""
            width="15px"
            height="15px"
          />{" "}
        </div>
        <div
          onClick={() => setWeekIndex(weeks.length - 1)}
          style={{ marginLeft: 20, cursor: "pointer" }}
        >
          <img
            style={{ objectFit: "contain", transform: "rotate(180deg)" }}
            src="/assets/left_arrow.png"
            alt=""
            width="15px"
            height="15px"
          />
          <img
            style={{ objectFit: "contain", transform: "rotate(180deg)" }}
            src="/assets/left_arrow.png"
            alt=""
            width="15px"
            height="15px"
          />{" "}
        </div>
      </div>

      <div
        style={{
          margin: 20,
        }}
      >
        <label>Workout Name</label>
        <br />
        <input
          style={{
            width: "100%",
            padding: "15px",
            boxSizing: "border-box",
            border: "none",
            boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.4)",
            borderRadius: 5,
            marginTop: 10,
          }}
          placeholder="Workout Name"
          value={workoutName}
          onChange={(val) => {
            setWorkoutName(val.target.value);
          }}
        />
      </div>
      <div
        className="weeksContainer"
        style={{ overflow: "auto", marginLeft: 20 }}
      >
        <div
          className="eachWeek"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {weeks.length > 1 ? (
            <div
              onClick={() =>
                weekIndex >= 1 ? setWeekIndex(weekIndex - 1) : null
              }
              style={{ cursor: "pointer", marginTop: "40%" }}
            >
              <img
                style={{ objectFit: "contain" }}
                src="/assets/left_arrow.png"
                alt=""
                width="15px"
                height="15px"
              />{" "}
            </div>
          ) : null}
          {selectedWeeks.map((index, idx) => (
            <div style={{ flexDirection: "column", width: "45%" }}>
              <p>Week {index.weeknum}</p>
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 15,
                  padding: 1,
                }}
              >
                {editable && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p style={{ marginLeft: 20 }}>Workout Plan</p>
                    <p
                      onClick={() => {
                        setWeekIndex(index.weeknum);
                        handleClickOpenDialogCopy();
                      }}
                      style={{ marginRight: 20, cursor: "pointer" }}
                    >
                      Copy
                    </p>
                  </div>
                )}
                <div
                  style={{
                    alignSelf: "center",
                    alignItems: "center",
                    height: 130,
                    cursor: "pointer",
                    width: 350,
                    marginTop: 20,
                    marginLeft: "auto",
                    marginRight: "auto",
                    border: "1px solid #727272",
                    alignItems: "center",
                    borderRadius: 15,
                    flexDirection: "column",
                  }}
                >
                  {index.days.monday == "" ? (
                    <div
                      onClick={() =>
                        editable &&
                        handleClickOpenDialog(index.weeknum, "monday")
                      }
                      style={{
                        justifyContent: "center",
                        height: "100%",
                        display: "flex",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          textAlign: "center",
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      >
                        MONDAY
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{
                            marginLeft: 10,
                            marginTop: 2,
                            marginBottom: 4,
                          }}
                        >
                          MONDAY
                        </p>
                        {editable && (
                          <p
                            onClick={() => {
                              var temp = [...weeks];
                              temp[index.weeknum - 1].days.monday = "";
                              console.log("delete temp");
                              console.log(JSON.stringify(temp));
                              setWeeks(temp);
                              setWeekIndex(index.weeknum - 1);
                            }}
                            style={{
                              marginLeft: 10,
                              marginTop: 2,
                              marginBottom: 4,
                              marginRight: 20,
                            }}
                          >
                            x
                          </p>
                        )}
                      </div>
                      <Grid
                        onClick={() => {
                          setSelectedDayData(index.days.monday);
                          setShowworkout(true);
                        }}
                        container
                      >
                        <Grid item xs={4}>
                          <img
                            src="/assets/illustration.jpeg"
                            alt=""
                            width="80px"
                            height="80px"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 16,
                              fontWeight: "600",
                            }}
                          >
                            {index.days.monday?.preWorkout?.workoutName}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Calories:{" "}
                            {
                              index.days.monday?.preWorkout
                                ?.caloriesBurnEstimate
                            }
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Difficulty:{" "}
                            {index.days.monday?.preWorkout?.workoutDifficulty}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Duration:{" "}
                            {index.days.monday?.preWorkout?.workoutDuration}
                          </p>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </div>
                <div
                  style={{
                    height: 130,
                    cursor: "pointer",
                    width: 350,

                    marginTop: 20,
                    marginLeft: "auto",
                    marginRight: "auto",
                    border: "1px solid #727272",
                    alignItems: "center",
                    borderRadius: 15,
                    flexDirection: "column",
                  }}
                >
                  {index.days.tuesday == "" ? (
                    <div
                      onClick={() => {
                        editable &&
                          handleClickOpenDialog(index.weeknum, "tuesday");
                      }}
                      style={{
                        justifyContent: "center",
                        height: "100%",
                        display: "flex",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          textAlign: "center",
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      >
                        TUESDAY
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{
                            marginLeft: 10,
                            marginTop: 2,
                            marginBottom: 4,
                          }}
                        >
                          TUESDAY
                        </p>
                        {editable && (
                          <p
                            onClick={() => {
                              var temp = weeks;
                              temp[index.weeknum - 1].days.tuesday = "";
                              setWeekIndex(index.weeknum);
                              setWeeks(temp);
                            }}
                            style={{
                              marginLeft: 10,
                              marginTop: 2,
                              marginBottom: 4,
                              marginRight: 20,
                            }}
                          >
                            x
                          </p>
                        )}
                      </div>
                      <Grid
                        onClick={() => {
                          setSelectedDayData(index.days.tuesday);
                          setShowworkout(true);
                        }}
                        container
                      >
                        <Grid item xs={4}>
                          <img
                            src="/assets/illustration.jpeg"
                            alt=""
                            width="80px"
                            height="80px"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 16,
                              fontWeight: "600",
                            }}
                          >
                            {index.days.tuesday?.preWorkout.workoutName}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Calories:{" "}
                            {
                              index.days.tuesday?.preWorkout
                                ?.caloriesBurnEstimate
                            }
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Difficulty:{" "}
                            {index.days.tuesday?.preWorkout?.workoutDifficulty}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Duration:{" "}
                            {index.days.tuesday?.preWorkout?.workoutDuration}
                          </p>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </div>
                <div
                  style={{
                    height: 130,
                    cursor: "pointer",
                    width: 350,

                    marginTop: 20,
                    marginLeft: "auto",
                    marginRight: "auto",
                    border: "1px solid #727272",
                    alignItems: "center",
                    borderRadius: 15,
                    flexDirection: "column",
                  }}
                >
                  {index.days.wednesday == "" ? (
                    <div
                      onClick={() =>
                        editable &&
                        handleClickOpenDialog(index.weeknum, "wednesday")
                      }
                      style={{
                        justifyContent: "center",
                        height: "100%",
                        display: "flex",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          textAlign: "center",
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      >
                        WEDNESDAY
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{
                            marginLeft: 10,
                            marginTop: 2,
                            marginBottom: 4,
                          }}
                        >
                          WEDNESDAY
                        </p>
                        {editable && (
                          <p
                            onClick={() => {
                              var temp = weeks;
                              temp[index.weeknum - 1].days.wednesday = "";
                              setWeekIndex(index.weeknum);
                              setWeeks(temp);
                            }}
                            style={{
                              marginLeft: 10,
                              marginTop: 2,
                              marginBottom: 4,
                              marginRight: 20,
                            }}
                          >
                            x
                          </p>
                        )}
                      </div>
                      <Grid
                        onClick={() => {
                          setSelectedDayData(index.days.wednesday);
                          setShowworkout(true);
                        }}
                        container
                      >
                        <Grid item xs={4}>
                          <img
                            src="/assets/illustration.jpeg"
                            alt=""
                            width="80px"
                            height="80px"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 16,
                              fontWeight: "600",
                            }}
                          >
                            {index.days.wednesday?.preWorkout.workoutName}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Calories:{" "}
                            {
                              index.days.wednesday?.preWorkout
                                ?.caloriesBurnEstimate
                            }
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Difficulty:{" "}
                            {
                              index.days.wednesday?.preWorkout
                                ?.workoutDifficulty
                            }
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Duration:{" "}
                            {index.days.wednesday?.preWorkout?.workoutDuration}
                          </p>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </div>
                <div
                  style={{
                    height: 130,
                    cursor: "pointer",
                    width: 350,

                    marginTop: 20,
                    marginLeft: "auto",
                    marginRight: "auto",
                    border: "1px solid #727272",
                    alignItems: "center",
                    borderRadius: 15,
                    flexDirection: "column",
                  }}
                >
                  {index.days.thursday == "" ? (
                    <div
                      onClick={() =>
                        editable &&
                        handleClickOpenDialog(index.weeknum, "thursday")
                      }
                      style={{
                        justifyContent: "center",
                        height: "100%",
                        display: "flex",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          textAlign: "center",
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      >
                        THURSDAY
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{
                            marginLeft: 10,
                            marginTop: 2,
                            marginBottom: 4,
                          }}
                        >
                          THURSDAY
                        </p>
                        {editable && (
                          <p
                            onClick={() => {
                              var temp = weeks;
                              temp[index.weeknum - 1].days.thursday = "";
                              setWeekIndex(index.weeknum);
                              setWeeks(temp);
                            }}
                            style={{
                              marginLeft: 10,
                              marginTop: 2,
                              marginBottom: 4,
                              marginRight: 20,
                            }}
                          >
                            x
                          </p>
                        )}
                      </div>
                      <Grid
                        onClick={() => {
                          setSelectedDayData(index.days.thursday);
                          setShowworkout(true);
                        }}
                        container
                      >
                        <Grid item xs={4}>
                          <img
                            src="/assets/illustration.jpeg"
                            alt=""
                            width="80px"
                            height="80px"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 16,
                              fontWeight: "600",
                            }}
                          >
                            {index.days.thursday?.preWorkout.workoutName}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Calories:{" "}
                            {
                              index.days.thursday?.preWorkout
                                ?.caloriesBurnEstimate
                            }
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Difficulty:{" "}
                            {index.days.thursday?.preWorkout?.workoutDifficulty}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Duration:{" "}
                            {index.days.thursday?.preWorkout?.workoutDuration}
                          </p>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </div>
                <div
                  style={{
                    height: 130,
                    cursor: "pointer",
                    width: 350,

                    marginTop: 20,
                    marginLeft: "auto",
                    marginRight: "auto",
                    border: "1px solid #727272",
                    alignItems: "center",
                    borderRadius: 15,
                    flexDirection: "column",
                  }}
                >
                  {index.days.friday == "" ? (
                    <div
                      onClick={() =>
                        editable &&
                        handleClickOpenDialog(index.weeknum, "friday")
                      }
                      style={{
                        justifyContent: "center",
                        height: "100%",
                        display: "flex",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          textAlign: "center",
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      >
                        FRIDAY
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{
                            marginLeft: 10,
                            marginTop: 2,
                            marginBottom: 4,
                          }}
                        >
                          FRIDAY
                        </p>
                        {editable && (
                          <p
                            onClick={() => {
                              var temp = weeks;
                              temp[index.weeknum - 1].days.friday = "";
                              setWeekIndex(index.weeknum);
                              setWeeks(temp);
                            }}
                            style={{
                              marginLeft: 10,
                              marginTop: 2,
                              marginBottom: 4,
                              marginRight: 20,
                            }}
                          >
                            x
                          </p>
                        )}
                      </div>
                      <Grid
                        onClick={() => {
                          setSelectedDayData(index.days.friday);
                          setShowworkout(true);
                        }}
                        container
                      >
                        <Grid item xs={4}>
                          <img
                            src="/assets/illustration.jpeg"
                            alt=""
                            width="80px"
                            height="80px"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 16,
                              fontWeight: "600",
                            }}
                          >
                            {index.days.friday?.preWorkout.workoutName}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Calories:{" "}
                            {
                              index.days.friday?.preWorkout
                                ?.caloriesBurnEstimate
                            }
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Difficulty:{" "}
                            {index.days.friday?.preWorkout?.workoutDifficulty}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Duration:{" "}
                            {index.days.friday?.preWorkout?.workoutDuration}
                          </p>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </div>
                <div
                  style={{
                    height: 130,
                    cursor: "pointer",
                    width: 350,

                    marginTop: 20,
                    marginLeft: "auto",
                    marginRight: "auto",
                    border: "1px solid #727272",
                    alignItems: "center",
                    borderRadius: 15,
                    flexDirection: "column",
                  }}
                >
                  {index.days.saturday == "" ? (
                    <div
                      onClick={() =>
                        editable &&
                        handleClickOpenDialog(index.weeknum, "saturday")
                      }
                      style={{
                        justifyContent: "center",
                        height: "100%",
                        display: "flex",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          textAlign: "center",
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      >
                        SATURDAY
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{
                            marginLeft: 10,
                            marginTop: 2,
                            marginBottom: 4,
                          }}
                        >
                          SATURDAY
                        </p>
                        {editable && (
                          <p
                            onClick={() => {
                              var temp = weeks;
                              temp[index.weeknum - 1].days.saturday = "";
                              setWeekIndex(index.weeknum);
                              setWeeks(temp);
                            }}
                            style={{
                              marginLeft: 10,
                              marginTop: 2,
                              marginBottom: 4,
                              marginRight: 20,
                            }}
                          >
                            x
                          </p>
                        )}
                      </div>
                      <Grid
                        onClick={() => {
                          setSelectedDayData(index.days.saturday);
                          setShowworkout(true);
                        }}
                        container
                      >
                        <Grid item xs={4}>
                          <img
                            src="/assets/illustration.jpeg"
                            alt=""
                            width="80px"
                            height="80px"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 16,
                              fontWeight: "600",
                            }}
                          >
                            {index.days.saturday?.preWorkout.workoutName}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Calories:{" "}
                            {
                              index.days.saturday?.preWorkout
                                ?.caloriesBurnEstimate
                            }
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Difficulty:{" "}
                            {index.days.saturday?.preWorkout?.workoutDifficulty}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Duration:{" "}
                            {index.days.saturday?.preWorkout?.workoutDuration}
                          </p>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </div>
                <div
                  style={{
                    height: 130,
                    cursor: "pointer",
                    width: 350,

                    marginTop: 20,
                    marginLeft: "auto",
                    marginRight: "auto",
                    border: "1px solid #727272",
                    alignItems: "center",
                    borderRadius: 15,
                    flexDirection: "column",
                  }}
                >
                  {index.days.sunday == "" ? (
                    <div
                      onClick={() =>
                        editable &&
                        handleClickOpenDialog(index.weeknum, "sunday")
                      }
                      style={{
                        justifyContent: "center",
                        height: "100%",
                        display: "flex",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          textAlign: "center",
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      >
                        SUNDAY
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{
                            marginLeft: 10,
                            marginTop: 2,
                            marginBottom: 4,
                          }}
                        >
                          SUNDAY
                        </p>
                        {editable && (
                          <p
                            onClick={() => {
                              var temp = weeks;
                              temp[index.weeknum - 1].days.sunday = "";
                              setWeekIndex(index.weeknum);
                              setWeeks(temp);
                            }}
                            style={{
                              marginLeft: 10,
                              marginTop: 2,
                              marginBottom: 4,
                              marginRight: 20,
                            }}
                          >
                            x
                          </p>
                        )}
                      </div>
                      <Grid
                        onClick={() => {
                          setSelectedDayData(index.days.sunday);
                          setShowworkout(true);
                        }}
                        container
                      >
                        <Grid item xs={4}>
                          <img
                            src="/assets/illustration.jpeg"
                            alt=""
                            width="80px"
                            height="80px"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 16,
                              fontWeight: "600",
                            }}
                          >
                            {index.days.sunday?.preWorkout.workoutName}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Calories:{" "}
                            {
                              index.days.sunday?.preWorkout
                                ?.caloriesBurnEstimate
                            }
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Difficulty:{" "}
                            {index.days.sunday?.preWorkout?.workoutDifficulty}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Duration:{" "}
                            {index.days.sunday?.preWorkout?.workoutDuration}
                          </p>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {editable && (weeks.length <= 1 || weeks.length == weekIndex + 1) ? (
            <div
              style={{
                flexDirection: "column",
                width: "45%",
                padding: 10,
                marginLeft: 20,
              }}
            >
              {/*<p style={{cursor:"pointer"}} onClick={handleClickOpenDialogCopy}>Copy</p>*/}
              <div
                onClick={() => {
                  setWeeks([
                    ...weeks,
                    {
                      weeknum: weeks.length + 1,
                      days: {
                        monday: "",
                        tuesday: "",
                        wednesday: "",
                        thursday: "",
                        friday: "",
                        saturday: "",
                        sunday: "",
                      },
                    },
                  ]);
                }}
                style={{
                  borderRadius: 15,
                  margin: 15,
                  cursor: "pointer",
                  border: "1px dashed #727272",
                  height: 100,
                  width: 350,
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  style={{ objectFit: "contain" }}
                  src="/assets/plus_thin.png"
                  alt=""
                  width="25px"
                  height="25px"
                />{" "}
              </div>
            </div>
          ) : null}
          <div
            style={{ cursor: "pointer", marginTop: "40%" }}
            onClick={() =>
              weeks.length == weekIndex + 1 ? null : setWeekIndex(weekIndex + 1)
            }
          >
            <img
              style={{ objectFit: "contain", transform: "rotate(180deg)" }}
              src="/assets/left_arrow.png"
              alt=""
              width="15px"
              height="15px"
            />{" "}
          </div>
        </div>
        {editable && (
          <div style={{ margin: 40 }}>
            <div
              style={{
                backgroundColor: "#FFE486",
                borderRadius: 10,
                cursor: "pointer",
                padding: 15,
                width: 200,
                marginRight: 20,
              }}
              onClick={saveLongTermworkout}
            >
              <h5 style={{ padding: 0, margin: 0, textAlign: "center" }}>
                SAVE LONG TERM WORKOUT
              </h5>
            </div>
          </div>
        )}
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid
            container
            style={{
              height: 300,
              width: 500,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Grid item xs={6}>
              <div
                onClick={() => {
                  setOpenCreateworkout(true);
                  handleCloseDialog();
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <EventNoteOutlined
                  style={{
                    backgroundColor: "#FFE486",
                    padding: 20,
                    borderRadius: "50%",
                  }}
                />
                <p>Create New Workout</p>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div
                onClick={() => {
                  setOpenSavedworkout(true);
                  handleCloseDialog();
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <DashboardOutlined
                  style={{
                    backgroundColor: "#FFE486",
                    padding: 20,
                    borderRadius: "50%",
                  }}
                />
                <p>Add From Saved Workouts</p>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openDialogCopy}
        onClose={handleCloseDialogCopy}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid
            container
            style={{ height: 450, width: "90vh", display: "flex", padding: 20 }}
          >
            <Grid item xs={4}>
              <p>Copy selected week to:</p>
            </Grid>
            <Divider orientation="vertical" />
            <Grid item xs={6}>
              <FormControl component="fieldset" onChange={handleChange}>
                {checkBox.map((index) => (
                  <div style={{ flexDirection: "column", marginLeft: 20 }}>
                    <FormControlLabel
                      control={<Checkbox name={index.name} />}
                      label={index.name}
                    />
                  </div>
                ))}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleWeeksCopy}
            style={{
              backgroundColor: "#FFE486",
              border: "none",
              outline: "none",
              padding: "10px 30px",
              borderRadius: 25,
              fontSize: 16,
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Confirm
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCreateworkout}
        onClose={handleCloseworkout}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ width: 1000, height: 600 }}>
          <div
            onClick={() => {
              setOpenCreateworkout(false);
            }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: "red",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              cursor: "pointer",
            }}
          >
            <CloseIcon />
          </div>
          <CoachAddWorkout
            isLongTerm={true}
            handleCloseworkout={handleCloseworkout}
            setWeeks={setWeeks}
            weeks={weeks}
            selectedWeekNum={selectedWeekNum}
            selectedDay={selectedDay}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={openSavedworkout}
        onClose={handleCloseworkout}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div
            onClick={() => {
              setOpenSavedworkout(false);
            }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: "red",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              cursor: "pointer",
            }}
          >
            <CloseIcon />
          </div>
          <ViewAllSavedWorkouts
            isLongTerm={true}
            handleCloseworkout={handleCloseworkout}
            setWeeks={setWeeks}
            weeks={weeks}
            selectedWeekNum={selectedWeekNum}
            selectedDay={selectedDay}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={openCreateExercise}
        onClose={handleCloseworkout}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ width: 800, height: 600 }}>
          <CreateOwnWorkout
            isLongTerm={true}
            handleCloseworkout={handleCloseworkout}
            setWeeks={setWeeks}
            weeks={weeks}
            selectedWeekNum={selectedWeekNum}
            selectedDay={selectedDay}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={showworkout}
        onClose={() => setShowworkout(false)}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div style={{ width: 1000, height: 550 }}>
            <AssignWorkout
              selectedDayData={selectedDayData}
              isLongTerm={true}
              handleCloseworkout={handleCloseworkout}
              setWeeks={setWeeks}
              weeks={weeks}
              selectedWeekNum={selectedWeekNum}
              selectedDay={selectedDay}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Modal
        visible={modal}
        width="450px"
        height="300"
        effect="fadeInUp"
        onClickaway={() => setModal(false)}
      >
        <div className="createWorkout__modal">
          <h2>Save Workout</h2>
          <h3>Do you want to save the Workout?</h3>
          <div className="createWorkout__modalButtons">
            <div
              className="createWorkout__modalButton"
              onClick={() => setModal(false)}
              style={{
                backgroundColor: "transparent",
              }}
            >
              CANCEL
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className="createWorkout__modalButton"
                onClick={() => {
                  setModal(false);
                  setModal1(true);
                }}
                style={{
                  backgroundColor: "transparent",
                  fontWeight: 600,
                }}
              >
                DON'T SAVE
              </div>
              <div
                className="createWorkout__modalButton"
                style={{
                  borderRadius: 10,
                  padding: "5px 20px",
                }}
                onClick={() => {
                  db.collection("longTermWorkout").add({
                    weeks,
                    completed: false,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    assignedToId: "",
                    assignedById: userData?.id,
                    date: formatDate(new Date()),
                    workoutName: workoutName,
                    isLongTerm: true,
                  });
                  setModal(false);
                  setModal1(true);
                }}
              >
                SAVE
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        visible={modal1}
        width="450px"
        height="300"
        effect="fadeInUp"
        onClickaway={() => setModal(false)}
      >
        <div className="createWorkout__modal">
          <h2>Assign Workout</h2>

          <h3>Would you like to assign this Workout to your athletes?</h3>
          <div className="createWorkout__modalButtons">
            <div
              className="createWorkout__modalButton"
              onClick={() => setModal1(false)}
              style={{
                backgroundColor: "transparent",
              }}
            >
              RETURN
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className="createWorkout__modalButton"
                onClick={() => {
                  setModal1(false);
                }}
                style={{
                  backgroundColor: "transparent",
                  fontWeight: 600,
                }}
              >
                NO
              </div>
              <div
                className="createWorkout__modalButton"
                style={{
                  borderRadius: 10,
                  padding: "5px 20px",
                }}
                onClick={() => {
                  setModal1(false);
                  setOpenAssignworkout(true);
                }}
              >
                YES
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Dialog
        open={openAssignworkout}
        onClose={() => setOpenAssignworkout(false)}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div
            style={{
              width: 800,
              height: 500,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ marginBottom: 20 }} {...getRootProps()}>
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
            <div style={{ marginLeft: 25 }}>
              <p>Select Start Date</p>

              <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                colorPrimary="#ffe486" // added this
                colorPrimaryLight="blue"
                calendarClassName="customcalendarScreen" // and this
                calendarTodayClassName="custom-today-day" // also this
                minimumDate={utils().getToday()}
                maximumDate={{
                  year: addDays(new Date(), 90).getFullYear(),
                  month: addDays(new Date(), 90).getMonth(),
                  day: addDays(new Date(), 90).getDate(),
                }}
                disabledDays={disabledDays}
              />
              {console.log(addDays(new Date(), 90).getMonth())}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={AssignworkoutPlan}
            style={{
              backgroundColor: "#FFE486",
              border: "none",
              outline: "none",
              padding: "10px 30px",
              borderRadius: 25,
              fontSize: 16,
              fontWeight: "600",
              cursor: "pointer",
              marginRight: 20,
            }}
          >
            Assign workout Plan
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateLongTermTrainingPlan;
