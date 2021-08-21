import React, { useEffect, useState } from "react";
import "./CoachAddWorkout.css";
import WorkoutScreenHeader from "./WorkoutScreenHeader";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import NoSsr from "@material-ui/core/NoSsr";
import styled from "styled-components";
import { db } from "../../utils/firebase";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core";
import Axios from "axios";
import SearchableDropdown from "../../Components/SearchableDropdown";
import AddIcon from "@material-ui/icons/Add";

import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "react-awesome-modal";
import { useHistory } from "react-router";
import { formatDate } from "../../functions/formatDate";
import SelectSearch, { fuzzySearch } from "react-select-search";
import firebase from "firebase";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
} from "@material-ui/core";
import CreateOwnWorkout from "./CreateOwnWorkout";

// const useStyles = makeStyles((theme) => ({
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 300,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
// }));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CoachAddWorkout(props) {
  const userData = useSelector(selectUserData);
  const [workoutName, setWorkoutName] = useState("");
  const [openCreateExercise, setOpenCreateExercise] = React.useState(false);

  const [workoutDescription, setWorkoutDescription] = useState("");
  const [equipmentsNeeded, setEquipmentsNeeded] = useState([]);
  const [targetedMuscleGroup, setTargetedMuscleGroup] = useState([]);
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [caloriesBurnEstimate, setCaloriesBurnEstimate] = useState("");
  const [workoutDifficulty, setWorkoutDifficulty] = useState("easy");
  const [selectedExercises, setSelectedExercises] = useState([
    {
      value: null,
    },
  ]);
  const [selectedWorkoutEdit, setSelectedWorkoutEdit] = useState(null);
  const [sectionId, setsectionId] = useState(1);
  const [modal, setModal] = useState(false);

  const [modal1, setModal1] = useState(false);
  const [workoutVideoUrl, setWorkoutVideoUrl] = useState("");
  const [modal2, setModal2] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [listOfEquipments, setListOfEquipments] = useState([]);
  const [listOfTargetedMuscles, setListOfTargetedMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [objs, setObjs] = useState(null);
  const [additionalnotes, setadditionalnotes] = useState("");
  const [reload, setreload] = useState(false);
  const [selectedExercises_list, setselectedExercises_list] = useState([
    {
      temp: null,
    },
  ]);
  const [tempexercises, settempexercises] = useState([
    {
      name: "",
      data: null,
    },
  ]);
  const history = useHistory();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    Axios.get("https://rongoeirnet.herokuapp.com/getexercise")
      .then((res) => {
        let temp = res.data.data;
        db.collection("coaches")
          .doc(userData?.id)
          .collection("ownWorkout")
          .get()
          .then((doc) => {
            doc.forEach((w) => {
              let tmp = w.data();
              tmp["_id"] = w.id;
              console.log(w.data());

              temp.push(tmp);
              //setObjs(temp);
            });
          })
          .then(() => {
            setObjs(temp);
          });

        let data1 = [];
        let data2 = [];
        res.data.data.map((item, idx) => {
          data1.push({ id: ID(), name: item.bodyPart });
          data1.push({ id: ID(), name: item.bodyPart2 });
          data1.push({ id: ID(), name: item.bodyPart3 });
          data1.push({ id: ID(), name: item.bodyPart4 });
          data2.push({ id: ID(), name: item.equipment });
        });
        data1 = data1.filter(
          (thing, index, self) =>
            index ===
            self.findIndex((t) => t.name === thing.name && thing.name !== "")
        );
        data2 = data2.filter(
          (thing, index, self) =>
            index === self.findIndex((t) => t.name === thing.name)
        );
        setListOfTargetedMuscles(data1);
        setListOfEquipments(data2);
      })
      .catch((err) => console.error(err));
  }, [reload]);

  useEffect(() => {
    // if (userData) {
    //   db.collection("coaches")
    //     .doc(userData?.id)
    //     .collection("ownWorkouts")
    //     .get()
    //     .then((doc) => {
    //       doc.forEach((w) => {});
    //     });
    // }
    objs?.map((item, idx) => {
      item.name = item.workoutName;
      item.value = item._id;
      //item.data = item;
    });
    //   console.log(objs);
    setExercises(objs);
    console.log(objs);
  }, [objs, userData]);

  useEffect(() => {
    if (userData) {
    }
  }, []);

  useEffect(() => {
    console.log("eq", equipmentsNeeded);
  }, [equipmentsNeeded]);
  const handleCloseworkout = () => {
    setreload(!reload);
    setOpenCreateExercise(false);
  };

  useEffect(() => {
    setSelectedWorkoutEdit("");
    let temp = selectedExercises;
    if (sectionId == 3) {
      if (selectedExercises.length > 1) {
        selectedExercises.map((val, idx) => {
          !val.value && temp.splice(idx, 1);
          setSelectedExercises(temp);
        });
      }
      // if (!selectedExercises[selectedExercises.length - 1].value) {
      //   temp.pop();
      //   setSelectedExercises(temp);
      // }
    }
  }, [sectionId]);

  // useEffect(() => {
  //   if (selectedExercises.length > 0) {
  //     let temp = tempexercises;

  //     temp[temp.length - 1].name =
  //       selectedExercises[selectedExercises.length - 1].workoutName;
  //     temp[temp.length - 1].date =
  //       selectedExercises[selectedExercises.length - 1];

  //     settempexercises(temp);
  //   }

  //   console.log("cg", selectedExercises);
  //   console.log("cg", tempexercises);
  //   let data = selectedExercises_list;
  //   data.push(selectedExercises[selectedExercises.length - 1]);
  //   setselectedExercises_list(data);
  // }, [selectedExercises]);

  return (
    <div
      className="coachCreateWorkout"
      style={{
        minHeight: "99vh",
      }}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        <WorkoutScreenHeader name="Create Workouts" />

        <div
          className="addWorkout__button"
          style={{ width: 180 }}
          onClick={() => setOpenCreateExercise(true)}
        >
          <img src="/assets/plus_thin.png" alt="" width="15px" height="15px" />
          <h5>ADD OWN EXERCISE</h5>
        </div>
      </div>

      <div className="Createworkout_header">
        <div className="workouts_header">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => setsectionId(1)}
            >
              <div
                style={{
                  width: 30,
                  cursor: "pointer",

                  margin: 5,
                }}
              >
                <span
                  className="header_item"
                  style={{
                    backgroundColor:
                      sectionId == 1 ? "#fcd11c" : sectionId > 1 && "green",
                    color: sectionId == 1 ? "black" : "white",
                  }}
                >
                  1
                </span>
              </div>
              <div className="header_line"></div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => setsectionId(2)}
            >
              <div
                style={{
                  width: 30,
                  margin: 5,
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    backgroundColor:
                      sectionId == 2 ? "#fcd11c" : sectionId > 2 && "green",
                    color: sectionId == 2 && "black",
                  }}
                  className="header_item"
                >
                  2
                </span>
              </div>
              <div className="header_line"></div>
            </div>
            <div
              style={{
                width: "auto",
              }}
              onClick={() => setsectionId(3)}
            >
              <div
                style={{
                  width: 30,
                  margin: 5,
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    backgroundColor:
                      sectionId == 3 ? "#fcd11c" : sectionId > 3 && "green",
                    color: sectionId == 3 && "black",
                  }}
                  className="header_item"
                >
                  3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sectionId == 1 && (
        <div
          style={{
            minHeight: "99.99vh",
          }}
        >
          <div className="Workouts_body">
            <h3>Workout Details</h3>
            <div
              style={{
                marginTop: 20,
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
              style={{
                marginTop: 20,
              }}
            >
              <label>Equipment Needed</label>
              <br />
              {console.log(equipmentsNeeded)}
              <SearchableDropdown
                name=""
                list={listOfEquipments}
                state={equipmentsNeeded}
                setState={setEquipmentsNeeded}
              />
              {/* <input
                style={{
                  width: "100%",
                  padding: "15px",
                  boxSizing: "border-box",
                  border: "none",
                  boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.4)",
                  borderRadius: 5,
                  marginTop: 10,
                }}
                placeholder="Search for any equipment"
              /> */}
            </div>
            <div>
              <label>Targeted Muscles</label>
              <br />

              <SearchableDropdown
                name=""
                list={listOfTargetedMuscles}
                state={targetedMuscleGroup}
                setState={setTargetedMuscleGroup}
              />
              {/* <input
                style={{
                  width: "100%",
                  padding: "15px",
                  boxSizing: "border-box",
                  border: "none",
                  boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.4)",
                  borderRadius: 5,
                  marginTop: 10,
                }}
                placeholder="Search for any equipment"
              /> */}
            </div>

            <div>
              <label>Workout Duration (hh:mm:ss)</label>
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
                type="time"
                step="1"
                placeholder="Workout Duration"
                value={workoutDuration}
                onChange={(val) => {
                  setWorkoutDuration(val.target.value);
                }}
              />
            </div>
            <div
              style={{
                marginTop: 20,
              }}
            >
              <label>Calorie Burn Estimate</label>
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
                value={caloriesBurnEstimate}
                onChange={(val) => {
                  setCaloriesBurnEstimate(val.target.value);
                }}
                placeholder="Calorie Burn Estimate"
              />
            </div>
            <div
              style={{
                marginTop: 20,
              }}
            >
              <label>Workout Difficulty</label>
              <br />
              <select
                style={{
                  width: "100%",
                  padding: "15px",
                  boxSizing: "border-box",
                  border: "none",
                  boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.4)",
                  borderRadius: 5,
                  marginTop: 10,
                }}
                value={workoutDifficulty}
                onChange={(val) => {
                  setWorkoutDifficulty(val.target.value);
                }}
                placeholder="Workout Difficulty"
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 30,
              marginBottom: 30,
            }}
          >
            <button
              style={{
                border: "none",
                outline: "none",
                width: 100,
                height: 40,
                backgroundColor: "transparent",
              }}
              disabled={!(sectionId > 1)}
              onClick={() => {
                sectionId > 1 && setsectionId(sectionId - 1);
              }}
            >
              Back
            </button>
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
              disabled={!(sectionId < 3)}
              onClick={() => {
                sectionId < 3 && setsectionId(sectionId + 1);
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {sectionId == 2 && (
        <div
          style={{
            minHeight: "99vh",
          }}
        >
          <div>
            <div className="Workouts_body">
              <h3>Add Exercises</h3>

              {selectedExercises.map((workout, idx1) => (
                <div key={idx1}>
                  <div
                    style={{
                      marginTop: 20,
                    }}
                  >
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
                              temp[idx1] = f;
                              temp[idx1].sets = [];

                              temp[idx1].sets.push({
                                reps: "12",
                                weights: "12",
                                // sets: "",
                                rest: "12",
                              });

                              setSelectedExercises(temp);
                              console.log(f);

                              let temp1 = tempexercises;
                              settempexercises(temp1);

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
                      display: workout.value ? "block" : "none",
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
                          console.log(workout);
                          if (workout?.videoUrl) {
                            setWorkoutVideoUrl(workout.videoUrl);
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
                            workout.thumbnail_url
                              ? workout.thumbnail_url
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
                          display: workout.value ? "block" : "none",
                          marginTop: 20,
                          borderRadius: 10,
                        }}
                      >
                        {workout.sets?.map((set, idx2) => (
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
                  disabled={!(sectionId < 3)}
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
            <div
              style={{
                display: "flex",
                height: 30,
                marginTop: 30,
                marginBottom: 30,
              }}
            >
              <button
                style={{
                  border: "none",
                  outline: "none",
                  width: 100,
                  backgroundColor: "transparent",
                }}
                disabled={!(sectionId > 1)}
                onClick={() => {
                  sectionId > 1 && setsectionId(sectionId - 1);
                }}
              >
                Back
              </button>
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
                disabled={!(sectionId < 3)}
                onClick={() => {
                  sectionId < 3 && setsectionId(sectionId + 1);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {sectionId == 3 && (
        <div
          style={{
            minHeight: "99vh",
          }}
        >
          <div>
            <div className="Workouts_body">
              <h3>Review</h3>
              <div
                style={{
                  marginTop: 20,
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
                  value={workoutName}
                  onChange={(val) => {
                    setWorkoutName(val.target.value);
                  }}
                  placeholder="Enter Workout Name"
                />
              </div>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <label>Workout Description</label>
                <br />
                <textarea
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "15px",
                    boxSizing: "border-box",
                    border: "none",
                    boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.4)",
                    borderRadius: 5,
                    marginTop: 10,
                  }}
                  placeholder="Describe here"
                />
              </div>

              <div className="excercises">
                <div
                  style={{
                    marginBottom: 20,
                    borderBottomWidth: 1,
                    borderColor: "#d3d3d3",

                    width: "100%",
                  }}
                >
                  <div>
                    {selectedExercises?.map((workout, idx1) =>
                      workout.cardio ? (
                        <div
                          key={idx1}
                          style={{
                            border: "1px solid rgb(0,0,0,0.2)",
                            display: workout.value ? "block" : "none",
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
                              {/* <input
                                type="checkbox"
                                //disabled={completed ? true : false}
                                //checked={workout?.completed}
                                tintColors={{
                                  true: "#ffe486",
                                  false: "#ffe486",
                                }}
                                // onValueChange={(newValue) => {
                                //   let temp = [...selectedExercises];
                                //   let tmp =
                                //     selectedExercises[idx].exercises[idx1];
                                //   tmp.completed = newValue.target.value;
                                //   if (newValue.target.value === true) {
                                //     tmp.sets.map((s) => {
                                //       s.actualReps = s.reps;
                                //     });
                                //     console.log("checked value ", tmp.sets);
                                //   } else {
                                //     tmp.sets.map((s) => {
                                //       s.actualReps = "";
                                //     });
                                //   }

                                //   temp[idx].exercises[idx1] = tmp;

                                //   setSelectedExercises(temp);
                                // }}
                              /> */}

                              <img
                                style={{
                                  width: 100,
                                  height: 56,
                                  borderRadius: 8,
                                  backgroundColor: "#d3d3d3",
                                }}
                                src={
                                  workout.thumbnail_url
                                    ? `${workout.thumbnail_url}`
                                    : "../assets/illustration.jpeg"
                                }
                              />

                              <div style={{ marginHorizontal: 10 }}>
                                <h3>{workout.name}</h3>
                                {workout.sets.map((set, idx2) =>
                                  Object.keys(set).map((set_, idx5) => (
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
                                  ))
                                )}

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
                                              height: 25,
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
                                marginTop: 20,
                              }}
                            >
                              {console.log("sett", workout.sets)}
                              {workout.sets?.map((set, idx2) => (
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
                                      marginLeft: "-15px",
                                      marginRight: "5px",
                                    }}
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
                                      {console.log("st1", workout.sets)}
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
                      ) : (
                        <div
                          key={idx1}
                          style={{
                            display: workout.value ? "block" : "none",
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
                              }}
                            >
                              {/* <input
                                type="checkbox"
                                //disabled={completed}
                                //checked={workout?.completed}
                                tintColors={{
                                  true: "#ffe486",
                                  false: "#ffe486",
                                }}
                                // onChange={(newValue) => {
                                //   let temp = [...selectedExercises];
                                //   let tmp =
                                //     selectedExercises[idx].exercises[idx1];
                                //   tmp.completed = newValue.target.value;
                                //   if (newValue.target.value === true) {
                                //     tmp.sets.map((s) => {
                                //       s.actualReps = s.rest;
                                //     });
                                //   } else {
                                //     tmp.sets.map((s) => {
                                //       s.actualReps = "";
                                //     });
                                //   }

                                //   temp[idx].exercises[idx1] = tmp;

                                //   setSelectedExercises(temp);
                                // }}
                              /> */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
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
                                    workout.thumbnail_url
                                      ? ` ${workout.thumbnail_url}`
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
                                  {workout.name}
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
                          {/* {selectedWorkoutEdit === idx1 && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              {1 || workout.cardio ? null : (
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
                              )}
                              {workout.sets?.map((set, idx19) => (
                                <div
                                  key={idx19}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",

                                    marginBottom: "10px",
                                  }}
                                >
                                  {workout.cardio ? null : (
                                    <h5
                                      style={{
                                        marginTop: "18px",
                                        marginRight: "15px",
                                      }}
                                    >
                                      Set {idx19 + 1}
                                    </h5>
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
                                          temp[idx1].sets[idx19].reps =
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
                                          temp[idx1].sets[idx19].weights =
                                            e.target.value;
                                          setSelectedExercises(temp);
                                        }}
                                      />
                                    </div>
                                  )}
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
                                      value={String(set.rest)}
                                      placeholder={"12"}
                                      onChange={(e) => {
                                        let temp = [...selectedExercises];
                                        temp[idx1].sets[idx19].rest =
                                          e.target.value;
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
                          )} */}
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
                              {workout.sets?.map((set, idx2) => (
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
                                  {console.log("st1", workout.sets)}
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
                      )
                    )}
                  </div>
                </div>
              </div>
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "100%" }} className="Dotted_line"></div>
              </div> */}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 30,
                marginBottom: 30,
              }}
            >
              <button
                style={{
                  border: "none",
                  outline: "none",
                  width: 100,
                  height: 40,
                  backgroundColor: "transparent",
                }}
                disabled={!(sectionId > 1)}
                onClick={() => {
                  sectionId > 1 && setsectionId(sectionId - 1);
                }}
              >
                Back
              </button>
              <button
                style={{
                  border: "none",
                  outline: "none",
                  width: 150,
                  height: 40,
                  backgroundColor: "#ffe486",
                  borderRadius: 7,
                  boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.2)",
                }}
                onClick={() => {
                  sectionId < 3 && setsectionId(sectionId + 1);
                  console.log(selectedExercises);
                  selectedExercises.length > 0 &&
                  selectedExercises[selectedExercises.length - 1].value
                    ? setModal(true)
                    : alert("Please select atleast one Excercise");

                  // db.collection("CoachWorkouts")
                  //   .add({
                  //     assignedById: userData?.id,
                  //     assignedToId: "",
                  //     date: formatDate(),
                  //     preWorkout: {
                  //       workoutName,
                  //       additionalnotes,
                  //       workoutDescription,
                  //       equipmentsNeeded,
                  //       targetedMuscleGroup,
                  //       workoutDuration,
                  //       caloriesBurnEstimate,
                  //       workoutDifficulty,
                  //       selectedExercises,
                  //     },
                  //   })
                  //   .then(() => {
                  //     alert("done");
                  //     history.push("/workouts");
                  //   })
                  //   .catch((e) => console.error("err", e));
                }}
              >
                Confirm Workout
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        visible={modal}
        width="450px"
        height="300"
        effect="fadeInUp"
        onClickaway={() => setModal(false)}
      >
        <div className="createWorkout__modal">
          <h2>Save Workout</h2>
          <h3> Do you want to save the Workout</h3>
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
                  if (workoutName) {
                    setModal(false);
                    let compliance = 0;
                    console.log(props);
                    if (props.isLongTerm) {
                      selectedExercises.map((ex) => {
                        ex.sets.map((s) => {
                          if (s.time) {
                            compliance = compliance + s.time;
                          } else if (s.weights) {
                            compliance = compliance + s.reps * s.weights;
                          } else {
                            compliance = compliance + s.reps;
                          }
                        });
                      });
                      var lweeks = props.weeks;
                      var lselectedWeekNum = props.selectedWeekNum;
                      var lselectedDay = props.selectedDay;
                      lweeks[lselectedWeekNum - 1].days[lselectedDay] = {
                        assignedById: userData?.id,
                        assignedToId: "",
                        date: formatDate(),
                        timestamp:
                          firebase.firestore.FieldValue.serverTimestamp(),
                        preWorkout: {
                          workoutName,
                          workoutDescription,
                          equipmentsNeeded,
                          targetedMuscleGroup,
                          workoutDuration,
                          caloriesBurnEstimate,
                          workoutDifficulty,
                          selectedExercises,
                          compliance,
                        },
                      };

                      props.setWeeks(lweeks);

                      props.handleCloseworkout();
                    } else {
                      setModal1(true);
                    }
                  }
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
                  if (workoutName) {
                    let compliance = 0;

                    selectedExercises.map((ex) => {
                      ex.sets.map((s) => {
                        if (s.time) {
                          compliance = compliance + s.time;
                        } else if (s.weights) {
                          compliance = compliance + s.reps * s.weights;
                        } else {
                          compliance = compliance + s.reps;
                        }
                      });
                    });
                    db.collection("CoachWorkouts")
                      .add({
                        assignedById: userData?.id,
                        assignedToId: "",
                        date: formatDate(),

                        preWorkout: {
                          workoutName,
                          workoutDescription,
                          equipmentsNeeded,
                          targetedMuscleGroup,
                          workoutDuration,
                          caloriesBurnEstimate,
                          workoutDifficulty,
                          selectedExercises,
                          compliance,
                        },
                      })
                      .then(() => {
                        setModal(false);
                        console.log(props);
                        if (props.isLongTerm) {
                          var lweeks = props.weeks;
                          var lselectedWeekNum = props.selectedWeekNum;
                          var lselectedDay = props.selectedDay;
                          lweeks[lselectedWeekNum - 1].days[lselectedDay] = {
                            assignedById: userData?.id,
                            assignedToId: "",
                            date: formatDate(),

                            preWorkout: {
                              workoutName,
                              workoutDescription,
                              equipmentsNeeded,
                              targetedMuscleGroup,
                              workoutDuration,
                              caloriesBurnEstimate,
                              workoutDifficulty,
                              selectedExercises,
                              compliance,
                            },
                          };

                          props.setWeeks(lweeks);

                          props.handleCloseworkout();
                        } else {
                          setModal1(true);
                          console.log(compliance, "cop");
                        }
                      })
                      .catch((e) => console.error(e));
                  } else {
                    alert("please fill all required feilds");
                  }
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
        height="270px"
        effect="fadeInUp"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
        onClickaway={() => setModal(false)}
      >
        <div className="createWorkout__modal">
          <h2>Assign Workout</h2>
          <h3> Do you want to Assign the Workout</h3>
          <div className="createWorkout__modalButtons">
            <div
              className="createWorkout__modalButton"
              onClick={() => setModal1(false)}
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
                  let compliance = 0;
                  selectedExercises.map((ex) => {
                    ex.sets.map((s) => {
                      if (s.time) {
                        compliance = compliance + s.time;
                      } else if (s.weights) {
                        compliance = compliance + s.reps * s.weights;
                      } else {
                        compliance = compliance + s.reps;
                      }
                    });
                  });
                  history.push({
                    pathname: "/assign-workout",
                    state: {
                      workout: {
                        data: {
                          assignedById: userData?.id,
                          assignedToId: "",
                          date: "",
                          preWorkout: {
                            workoutName,
                            workoutDescription,
                            equipmentsNeeded,
                            targetedMuscleGroup,
                            workoutDuration,
                            caloriesBurnEstimate,
                            workoutDifficulty,
                            selectedExercises,
                            compliance,
                          },
                        },
                      },
                    },
                  });
                  setModal1(false);
                }}
              >
                YES
              </div>
            </div>
          </div>
        </div>
      </Modal>
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
      <Dialog
        open={openCreateExercise}
        onClose={handleCloseworkout}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ width: 1000, height: 600 }}>
          <div
            onClick={() => {
              setOpenCreateExercise(false);
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
          <CreateOwnWorkout />
        </DialogContent>
      </Dialog>
      {/* <Modal
        visible={modal2}
        width="80%"
        height="500"
        effect="fadeInUp"
        onClickaway={() => setModal2(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <video width="500" height="500" controls>
          <source src={workoutVideoUrl} />
        </video>
      </Modal> */}
    </div>
  );
}

export default CoachAddWorkout;
