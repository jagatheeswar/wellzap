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
  const [selectedExercises, setSelectedExercises] = useState([]);
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
    });
    console.log(objs);
    setExercises(objs);
  }, [objs]);

  const Select_exercises_section = () => {
    return (
      <div>
        <div
          style={{
            marginTop: 20,
          }}
        >
          <label>Select Exercise</label>
          <br />
          <input
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              border: "none",
              boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.4)",
              borderRadius: 5,
              marginTop: 10,
            }}
            placeholder="Search For any Excercise"
          />
        </div>
        <div
          style={{
            marginTop: 20,
          }}
        >
          <div>
            <SearchableDropdown
              name="Search for Exercise"
              list={exercises}
              state={selectedExercises}
              setState={setSelectedExercises}
            />
          </div>
        </div>

        {selectedExercises?.map((workout, idx1) => (
          <div
            key={idx1}
            style={{
              width: "95%",

              boxSizing: "border-box",
              width: 350,
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
    );
  };
  return (
    <div className="coachCreateWorkout">
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
            <div>
              {console.log(sectionId)}
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
            <div>
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
              />
            </div>
            <div
              style={{
                marginTop: 20,
              }}
            >
              <label>Equipment Needed</label>
              <br />
              {console.log(exercises)}
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
                placeholder="Workout Difficulty"
              />
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
        <div>
          <div>
            <div className="Workouts_body">
              <h3>Add Exercises</h3>

              <div>
                <div
                  style={{
                    marginTop: 20,
                  }}
                >
                  <label>Select Exercise</label>
                  <br />
                  <input
                    style={{
                      width: "100%",
                      padding: "10px",
                      boxSizing: "border-box",
                      border: "none",
                      boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.4)",
                      borderRadius: 5,
                      marginTop: 10,
                    }}
                    placeholder="Search For any Excercise"
                  />
                </div>
                <div
                  style={{
                    marginTop: 20,
                  }}
                >
                  <div>
                    <SearchableDropdown
                      name="Search for Exercise"
                      list={exercises}
                      state={selectedExercises}
                      setState={setSelectedExercises}
                    />
                  </div>
                </div>

                {selectedExercises?.map((workout, idx1) => (
                  <div
                    key={idx1}
                    style={{
                      width: "95%",

                      boxSizing: "border-box",
                      width: 350,
                    }}
                  >
                    {console.log("se", selectedExercises)}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "white",
                        borderRadius: 10,
                        cursor: "pointer",
                        padding: 20,
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
                    sectionId < 3 && setsectionId(sectionId + 1);
                  }}
                >
                  Add Excercise
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
                }}
              >
                Confirm Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoachAddWorkout;
