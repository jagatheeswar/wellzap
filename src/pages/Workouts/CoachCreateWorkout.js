import React, { useEffect, useState } from "react";
import "./workouts.css";
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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function CoachCreateWorkout() {
  const classes = useStyles();
  const userData = useSelector(selectUserData);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [equipmentsNeeded, setEquipmentsNeeded] = useState([]);
  const [targetedMuscleGroup, setTargetedMuscleGroup] = useState([]);
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [caloriesBurnEstimate, setCaloriesBurnEstimate] = useState("");
  const [workoutDifficulty, setWorkoutDifficulty] = useState("");
  const [group, setGroup] = useState([
    {
      exercises: [],
      groupName: "",
    },
  ]);
  const [selectedWorkoutEdit, setSelectedWorkoutEdit] = useState(null);
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [workoutVideoUrl, setWorkoutVideoUrl] = useState("");
  const [modal2, setModal2] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [listOfEquipments, setListOfEquipments] = useState([]);
  const [listOfTargetedMuscles, setListOfTargetedMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [objs, setObjs] = useState(null);

  console.log({ equipmentsNeeded, targetedMuscleGroup });

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

  console.log({ group });

  return (
    <div className="coachCreateWorkout">
      <WorkoutScreenHeader name="Create Workout" />
      <div className="coachCreateWorkout__workoutName">
        <h3 className="createWorkout__inputLabel">Workout Name</h3>
        <input
          className="createWorkout__input"
          type="text"
          placeholder="Enter Workout Name"
        />
      </div>
      <div className="createWorkout__banner">
        <img
          src="/assets/illustration.jpeg"
          alt=""
          height="400px"
          width="90%"
        />
      </div>
      <div className="coachCreateWorkout__selectDropdown">
        <h3 className="createWorkout__subHeading">Workout Details</h3>
        <div className="createWorkout__row">
          <SearchableDropdown
            name="Equipments Needed"
            list={listOfEquipments}
            state={equipmentsNeeded}
            setState={setEquipmentsNeeded}
          />
          <SearchableDropdown
            name="Targeted Muscle Group"
            list={listOfTargetedMuscles}
            state={targetedMuscleGroup}
            setState={setTargetedMuscleGroup}
          />
        </div>
      </div>
      <div className="createWorkout__inputTime">
        <h3 className="createWorkout__inputLabel">Workout Duration</h3>
        <input
          className="createWorkout__input"
          value="00:00:00"
          type="time"
          value="18:00"
        />
      </div>
      <div className="createWorkout__calorieBurn">
        <h3 className="createWorkout__inputLabel">Calories Burn Estimate</h3>
        <input
          className="createWorkout__input"
          type="number"
          min="0"
          placeholder="Enter Calories Burn Estimate"
        />
      </div>
      <div className="createWorkout__workoutDifficulty">
        <h3 className="createWorkout__inputLabel">Workout Difficulty</h3>
        <FormControl className={classes.formControl}>
          <InputLabel id="meal-select-label">
            Select the Workout difficulty
          </InputLabel>
          <Select labelId="meal-select-label" id="meal-select-label">
            <MenuItem value={"Easy"}>Easy</MenuItem>
            <MenuItem value={"Moderate"}>Moderate</MenuItem>
            <MenuItem value={"Hard"}>Hard</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="createWorkout__exercises">
        <h3 className="createWorkout__inputLabel">Exercises</h3>
        <div>
          <div
            style={{
              width: "70%",
              marginRight: "30px",
              padding: "30px",
              backgroundColor: "#fff",
              borderRadius: "4px",
            }}
          >
            {group?.map((grp, idx) => (
              <div
                key={idx}
                style={{
                  paddingBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "30px",
                      backgroundColor: "#fcd54a",
                      marginLeft: "-30px",
                      marginRight: "20px",
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                    }}
                  ></div>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      width: "62%",
                    }}
                  >
                    Group
                  </h3>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      let temp = [...group];
                      temp.splice(idx, 1);
                      setGroup(temp);
                    }}
                  >
                    <CloseIcon />
                  </div>
                </div>
                <div>
                  <h3 className="createWorkout__inputLabel">Group Name</h3>

                  <input
                    className="createWorkout__input"
                    value={grp.groupName}
                    onChange={(e) => {
                      let temp = [...group];
                      temp[idx].groupName = e.target.value;
                      setGroup(temp);
                    }}
                    placeholder="Enter Group Name"
                  />
                </div>

                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    width: "90%",
                    marginTop: "15px",
                  }}
                >
                  Exercise
                </h3>
                <div style={{ width: "95%" }}>
                  <SearchableDropdown
                    name="Search for Exercise"
                    idx={idx}
                    list={exercises}
                    state={group}
                    setState={setGroup}
                  />
                </div>

                {grp.exercises?.map((workout, idx1) => (
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
                              let temp1 = [...group];
                              let temp = group[idx].exercises;
                              temp.splice(idx1, 1);
                              temp1[idx].exercises = temp;
                              console.log({ temp1 });
                              setGroup(temp1);
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
                            let temp = [...group];
                            let tmp = group[idx].exercises[idx1].sets;
                            tmp.push({
                              reps: "",
                              weights: "",
                              rest: "",
                            });
                            temp[idx].exercises[idx1].sets = tmp;

                            setGroup(temp);
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
                                let temp = [...group];
                                let tmp = group[idx].exercises[idx1].sets;
                                tmp.splice(idx2, 1);

                                temp[idx].exercises[idx1].sets = tmp;

                                setGroup(temp);
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
                                  let temp = [...group];
                                  let tmp = group[idx].exercises[idx1].sets;
                                  tmp[idx2].reps = e.target.value;

                                  temp[idx].exercises[idx1].sets = tmp;

                                  setGroup(temp);
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
                                  let temp = [...group];
                                  let tmp = group[idx].exercises[idx1].sets;
                                  tmp[idx2].weights = e.target.value;

                                  temp[idx].exercises[idx1].sets = tmp;

                                  setGroup(temp);
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
                                  let temp = [...group];
                                  let tmp = group[idx].exercises[idx1].sets;
                                  tmp[idx2].rest = e.target.value;

                                  temp[idx].exercises[idx1].sets = tmp;

                                  setGroup(temp);
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
            ))}
          </div>
          <div
            style={{
              width: "70%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              borderRadius: "4px",
              borderTopWidth: "1px",
              borderColor: "#e3e3e3",
              padding: "30px",
            }}
          >
            <div
              style={{
                backgroundColor: "#fcd54a",
                padding: "10px",
                borderRadius: "50px",
                width: "150px",
                height: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                setGroup([
                  ...group,
                  {
                    groupName: "",
                    exercises: [],
                  },
                ]);
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AddIcon fontSize="small" />

                <h5
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  CREATE GROUP
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="createWorkout__description">
        <h3 className="createWorkout__inputLabel">Workout Description</h3>
        <textarea placeholder="Enter Workout Description" />
      </div>
      <div className="createWorkout__completeWorkoutButton">
        Complete Workout
      </div>
    </div>
  );
}

export default CoachCreateWorkout;
