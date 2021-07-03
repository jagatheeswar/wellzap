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
import SelectSearch from "react-select-search";

// const useStyles = makeStyles((theme) => ({
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 300,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
// }));

function CoachAddWorkout() {
  const userData = useSelector(selectUserData);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [equipmentsNeeded, setEquipmentsNeeded] = useState([]);
  const [targetedMuscleGroup, setTargetedMuscleGroup] = useState([]);
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [caloriesBurnEstimate, setCaloriesBurnEstimate] = useState("");
  const [workoutDifficulty, setWorkoutDifficulty] = useState("");
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

  console.log({
    workoutDescription,
  });

  var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    Axios.get("https://rongoeirnet.herokuapp.com/getexercise")
      .then((res) => {
        setObjs(res.data.data);
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
  }, []);

  useEffect(() => {
    objs?.map((item, idx) => {
      item.name = item.workoutName;
      item.value = item._id;
      //item.data = item;
    });
    //   console.log(objs);
    setExercises(objs);
    console.log(objs);
  }, [objs]);

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
        height: sectionId == 2 && "100vh",
      }}
    >
      <div
        className="workout_goBack"
        style={{
          fontSize: 20,
          fontWeight: 500,
          marginBottom: 20,
        }}
      >
        <span>&#60;</span>Create Workout
      </div>
      <div className="Createworkout_header">
        <div className="workouts_header">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div onClick={() => setsectionId(1)}>
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
              <hr />
            </div>
            <div onClick={() => setsectionId(2)}>
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
              <hr />
            </div>
            <div
              style={{
                width: "auto",
              }}
              onClick={() => setsectionId(3)}
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

      {sectionId == 1 && (
        <div>
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
            <div
              style={{
                marginTop: 20,
              }}
            >
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

            <div
              style={{
                marginTop: 20,
              }}
            >
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
                placeholder="Workout Difficulty">
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              height: 30,
              marginTop: 30,
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
                backgroundColor: "#fcd11c",
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
            height: "100%vh",
          }}
        >
          <div>
            <div className="Workouts_body">
              <h3>Add Exercises</h3>

              {selectedExercises.map((data, idx1) => (
                <div key={idx1}>
                  <div
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <div>
                      {exercises?.length > 0 && (
                        <SelectSearch
                          options={exercises}
                          onChange={(d, f) => {
                            let temp = selectedExercises;
                            temp[idx1] = f;
                            temp[idx1].sets = [];

                            temp[idx1].sets.push({
                              reps: "",
                              weights: "",
                              sets: "",
                              rest: "",
                            });

                            setSelectedExercises(temp);
                            console.log(f);

                            let temp1 = tempexercises;
                            settempexercises(temp1);

                            // navigation.navigate("AddWorkout");
                          }}
                          value={selectedExercises[idx1].value}
                          name="language"
                          placeholder="Choose Workout"
                        />
                      )}
                      <SelectSearch
                        options={[
                          {
                            name: "reps/weight/sets/rest",
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
                          let temp = selectedExercises;
                          temp[idx1].sets = [];
                          console.log(val);
                          if (val == 1) {
                            temp[idx1].sets.push({
                              reps: "",
                              weights: "",
                              sets: "",
                              rest: "",
                            });
                          }
                          if (val == 2) {
                            temp[idx1].sets.push({
                              Reps: "",
                            });
                          }
                          if (val == 3) {
                            temp[idx1].sets.push({
                              Time: "",
                            });
                          }

                          setSelectedExercises(temp);
                        }}
                      />
                    </div>
                  </div>

                  {data?.value &&
                    selectedExercises
                      .slice(idx1, idx1 + 1)
                      .map((workout, idx2) => (
                        <div
                          key={idx2}
                          style={{
                            marginTop: 20,
                            boxSizing: "border-box",
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
                                  {workout?.name}
                                </h4>
                              </div>
                            </div>
                          </div>
                          {selectedWorkoutEdit === idx1 && (
                            <div
                              style={{
                                backgroundColor: "white",
                                padding: 20,
                                boxSizing: "border-box",
                                marginTop: 20,
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
                                      {console.log("st", set)}
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

                                  temp[idx1].sets.push(temp[idx1].sets[0]);

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
                                  backgroundColor: "white",
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      ))}

                  <div
                    style={{
                      display: idx1 == 0 ? "none" : "block",
                      marginTop: 20,
                      fontSize: 16,
                      backgroundColor: "rgb(252, 209, 28)",
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
                  </div>

                  <div
                    style={{
                      display:
                        selectedExercises.length - 1 == idx1 ? "none" : "block",
                    }}
                    className="Dotted_line"
                  ></div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="Dotted_line"></div>
              <div
                style={{
                  display: "flex",
                  height: 30,
                  marginTop: 30,
                }}
              >
                <button
                  style={{
                    border: "none",
                    outline: "none",
                    width: 100,
                    height: 40,
                    backgroundColor: "#fcd11c",
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
                  backgroundColor: "#fcd11c",
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
        <div>
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
                  placeholder="Workout Name"
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
                  <div style={{ marginLeft: 10 }}>
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
                              <input
                                type="checkbox"
                                //disabled={completed ? true : false}
                                //checked={workout?.completed}
                                tintColors={{
                                  true: "#fcd54a",
                                  false: "#fcd54a",
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
                              />

                              <img
                                style={{
                                  width: 20,
                                  height: 20,
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
                                marginTop: 20,
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
                                      {console.log("st", set)}
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

                                  temp[idx1].sets.push(temp[idx1].sets[0]);

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
                                  backgroundColor: "white",
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          key={idx1}
                          style={{
                            borderBottom: "1px solid rgb(0,0,0,0.2)",
                            display: workout.value ? "block" : "none",
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
                              marginTop: 20,
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
                              <input
                                type="checkbox"
                                //disabled={completed}
                                //checked={workout?.completed}
                                tintColors={{
                                  true: "#fcd54a",
                                  false: "#fcd54a",
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
                              />
                              <div>
                                <img
                                  style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 8,
                                    backgroundColor: "#d3d3d3",
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
                                <h3>{workout.name}</h3>
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
                                        flexDirection: "row",
                                        alignItems: "center",
                                        width: 100,
                                      }}
                                    >
                                      {Object.keys(s).map((set_, i) => (
                                        <>
                                          <h3
                                            style={{
                                              marginRight: 10,
                                              marginLeft: i != 0 && 20,
                                              fontSize: 12,
                                            }}
                                          >
                                            {set_}
                                          </h3>
                                          {workout?.sets?.map((s, i) => (
                                            <h3
                                              key={i}
                                              style={{ fontSize: 12 }}
                                            >
                                              {s[set_] ? s[set_] : 12}
                                              {i < workout.sets.length - 1
                                                ? "-"
                                                : null}
                                            </h3>
                                          ))}
                                        </>
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
                            <div style={{ marginLeft: 30 }}>
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
                                marginTop: 20,
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
                                      {console.log("st", set)}
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

                                  temp[idx1].sets.push(temp[idx1].sets[0]);

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
                                  backgroundColor: "white",
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
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
                style={{ width: "100%", marginRight: 0 }}
                className="Dotted_line"
              ></div>
            </div>

            <div
              style={{
                marginTop: 20,
              }}
            >
              <label>Additional Notes</label>
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
                value={additionalnotes}
                onChange={(val) => {
                  setadditionalnotes(val.target.value);
                }}
                placeholder="Additional Notes"
              />
            </div>
            <div
              style={{
                display: "flex",
                height: 30,
                marginTop: 30,
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
                  backgroundColor: "#fcd11c",
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
        width="500px"
        height="300"
        style={{
          display: "flex",
          alignItems: "center",
        }}
        effect="fadeInUp"
        onClickaway={() => setModal(false)}
      >
        <div className="createWorkout__modal">
          <h3>Do you want to save the workout?</h3>
          <div className="createWorkout__modalButtons">
            <div
              className="createWorkout__modalButton"
              onClick={() => {
                setModal(false);
                setModal1(true);
              }}
            >
              DON'T SAVE
            </div>
            <div
              className="createWorkout__modalButton"
              onClick={() => {
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
                    },
                  })
                  .then(() => {
                    setModal(false);
                    setModal1(true);
                  })
                  .catch((e) => console.error(e));
              }}
            >
              SAVE
            </div>
          </div>
          <div
            className="createWorkout__modalButton"
            onClick={() => setModal(false)}
          >
            RETURN
          </div>
        </div>
      </Modal>
      <Modal
        visible={modal1}
        width="500px"
        effect="fadeInUp"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
        onClickaway={() => setModal(false)}
      >
        <div className="createWorkout__modal">
          <h3>Would you like to assign this workout to your athletes?</h3>
          <h4>You can complete this step later from the workout screen</h4>
          <div className="createWorkout__modalButtons">
            <div
              className="createWorkout__modalButton"
              onClick={() => {
                setModal1(false);
              }}
            >
              NO
            </div>
            <div
              className="createWorkout__modalButton"
              onClick={() => {
                let compliance = 0;
                selectedExercises.map((ex) => {
                  ex.sets.map((s) => {
                    compliance = compliance + s.reps * s.weights;
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
          <div
            className="createWorkout__modalButton"
            onClick={() => setModal1(false)}
          >
            RETURN
          </div>
        </div>
      </Modal>
      <Modal
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
      </Modal>
    </div>
  );
}

export default CoachAddWorkout;
