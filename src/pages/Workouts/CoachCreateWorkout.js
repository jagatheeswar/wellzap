import React, { useEffect, useState } from "react";
import "./workouts.css";
import WorkoutScreenHeader from "./WorkoutScreenHeader";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import NoSsr from "@material-ui/core/NoSsr";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
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
        <h3>Workout Name</h3>
        <input type="text" placeholder="Enter Workout Name" />
      </div>
      <img src="/assets/illustration.jpeg" alt="" height="400px" width="90%" />

      <div className="coachCreateWorkout__selectDropdown">
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "600",
            lineHeight: "28px",
          }}
        >
          Workout Details
        </h3>
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
      <div className="createWorkout__inputTime">
        <h3>Workout Duration</h3>
        <input value="00:00:00" type="time" value="18:00" />
      </div>
      <div className="createWorkout__calorieBurn">
        <h3>Calories Burn Estimate</h3>
        <input
          type="number"
          min="0"
          placeholder="Enter Calories Burn Estimate"
        />
      </div>
      <div className="createWorkout__workoutDifficulty">
        <h3>Workout Difficulty</h3>
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
        <h3>Exercises</h3>
        <div>
          <div
            style={{
              width: "70%",
              marginLeft: "30px",
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
                    onClick={() => {
                      let temp = [...group];
                      temp.splice(idx, 1);
                      setGroup(temp);
                    }}
                  >
                    {/* <Icon
                        name="times"
                        size={19}
                        style={{ marginRight: 0 }}
                        type="font-awesome-5"
                      /> */}
                    X
                  </div>
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "14px",
                      marginVertical: 10,
                    }}
                  >
                    Group Name
                  </h3>

                  <input
                    style={{
                      borderWidth: "1px",
                      borderColor: "#DBE2EA",
                      backgroundColor: "#fff",
                      width: "100px",
                      borderRadius: "5px",
                      padding: "7px",
                    }}
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

                {exercises.length > 0 && (
                  <SearchableDropdown
                    name="Search for Exercise"
                    list={exercises}
                    idx={idx}
                    state={group}
                    setState={setGroup}
                  />
                )}

                {grp.exercises?.map((workout, idx1) => (
                  <div key={idx1} style={{ width: "95%", marginLeft: "3%" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "10px",
                        marginBottom: "10px",
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
                          <h4>{workout.name}</h4>
                          <div
                            onClick={() => {
                              let temp1 = [...group];
                              let temp = group[idx].exercises;
                              temp.splice(idx1, 1);
                              temp1[idx].exercises = temp;
                              console.log({ temp1 });
                              setGroup(temp1);
                            }}
                          >
                            {/* <Icon
                                name="times"
                                size={15}
                                style={{ marginRight: 10 }}
                                type="font-awesome-5"
                              /> */}
                            X
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <h5 style={{ width: "50%", fontSize: "12px" }}>
                            Reps
                          </h5>
                          {workout.sets.map((s, i) => (
                            <h5
                              key={i}
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
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
                            flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <h5 style={{ width: "50%", fontSize: "12px" }}>
                            Weights
                          </h5>
                          {workout.sets.map((s, i) => (
                            <h5 key={i} style={{ fontSize: "12px" }}>
                              {s.weights ? s.weights : 0}
                              {i < workout.sets.length - 1 ? " - " : null}
                            </h5>
                          ))}
                          <div style={{ marginLeft: "20px" }}>
                            {selectedWorkoutEdit === idx1 ? (
                              <img
                                style={{
                                  width: "25px",
                                  height: "20px",
                                  marginRight: "5px",
                                }}
                                src="/assets/up.png"
                              />
                            ) : (
                              <img
                                style={{
                                  width: "25px",
                                  height: "20px",
                                  marginRight: "5px",
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
                          }}
                        >
                          <h5 style={{ width: "50%", fontSize: "12px" }}>
                            Rest(secs)
                          </h5>
                          {workout.sets.map((s, i) => (
                            <h5 key={i} style={{ fontSize: "12px" }}>
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
                            borderColor: "#006d77",
                            padding: "5px",
                            borderRadius: "50px",
                            width: "120px",
                            marginTop: "10px",
                            marginBottom: "10px",
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
                          <h5 style={{ color: "black", textAlign: "center" }}>
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
                                marginTop: "20px",
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
                              {/* <Icon
                                  name="times"
                                  size={15}
                                  style={{ marginRight: 10 }}
                                  type="font-awesome-5"
                                /> */}
                              X
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
                              <h5 style={{ fontSize: "14px", marginBottom: 5 }}>
                                Reps
                              </h5>
                              <input
                                style={{
                                  width: "50px",
                                  height: "35px",
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
                              <h5 style={{ fontSize: "14px", marginBottom: 5 }}>
                                Weights
                              </h5>
                              <input
                                style={{
                                  width: "50px",
                                  height: "35px",
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
                              <h5 style={{ fontSize: "14px", marginBottom: 5 }}>
                                Rest
                              </h5>
                              <input
                                style={{
                                  width: "50px",
                                  height: "35px",
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
                            borderWidth: "1px",
                            borderRadius: "5px",
                            borderColor: "#DBE2EA",
                            alignSelf: "flex-end",
                            padding: "5px",
                            paddingLeft: "7px",
                            paddingRight: "7px",
                          }}
                        >
                          {/* <Icon
                              name="check"
                              size={20}
                              style={{ alignSelf: "flex-end" }}
                              color="black"
                              type="font-awesome-5"
                            /> */}
                          Tick
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
              width: "60px",
              marginLeft: "30px",
              marginRight: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              borderRadius: "4px",
              borderTopWidth: "1px",
              borderColor: "#e3e3e3",
              paddingBottom: "15px",
              paddingTop: "15px",
            }}
          >
            <div
              style={{
                backgroundColor: "#fcd54a",
                padding: "10px",
                borderRadius: "50px",
                width: "150px",
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
                {/* <Icon
                    name="plus"
                    size={15}
                    style={{ marginRight: 10 }}
                    color="black"
                    type="font-awesome-5"
                  /> */}
                +
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
        <h3>Workout Description</h3>
        <textarea placeholder="Enter Workout Description" />
      </div>
      <div className="createWorkout__completeWorkoutButton">
        Complete Workout
      </div>
    </div>
  );
}

export default CoachCreateWorkout;
