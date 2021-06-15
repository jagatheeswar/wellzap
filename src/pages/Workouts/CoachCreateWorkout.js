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
import Modal from "react-awesome-modal";
import { useHistory } from "react-router";
import { formatDate } from "../../functions/formatDate";

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
  const [selectedExercises, setSelectedExercises] = useState([]);
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

  return (
    <div className="coachCreateWorkout">
      <WorkoutScreenHeader name="Create Workout" />
      <div className="coachCreateWorkout__workoutName">
        <h3 className="createWorkout__inputLabel">Workout Name</h3>
        <input
          className="createWorkout__input"
          type="text"
          placeholder="Enter Workout Name"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
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
          type="time"
          value={workoutDuration}
          onChange={(e) => setWorkoutDuration(e.target.value)}
        />
      </div>
      <div className="createWorkout__calorieBurn">
        <h3 className="createWorkout__inputLabel">Calories Burn Estimate</h3>
        <input
          className="createWorkout__input"
          type="number"
          min="0"
          placeholder="Enter Calories Burn Estimate"
          value={caloriesBurnEstimate}
          onChange={(e) => setCaloriesBurnEstimate(e.target.value)}
        />
      </div>
      <div className="createWorkout__workoutDifficulty">
        <h3 className="createWorkout__inputLabel">Workout Difficulty</h3>
        <FormControl className={classes.formControl}>
          <InputLabel id="meal-select-label">
            Select the Workout difficulty
          </InputLabel>
          <Select
            labelId="meal-select-label"
            id="meal-select-label"
            value={workoutDifficulty}
            onChange={(e) => setWorkoutDifficulty(e.target.value)}
          >
            <MenuItem value={"Easy"}>Easy</MenuItem>
            <MenuItem value={"Moderate"}>Moderate</MenuItem>
            <MenuItem value={"Hard"}>Hard</MenuItem>
          </Select>
        </FormControl>
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
      <div className="createWorkout__description">
        <h3 className="createWorkout__inputLabel">Workout Description</h3>
        <textarea
          placeholder="Enter Workout Description"
          value={workoutDescription}
          onChange={(e) => setWorkoutDescription(e.target.value)}
        />
      </div>
      <div
        className="createWorkout__completeWorkoutButton"
        onClick={() => setModal(true)}
      >
        Complete Workout
      </div>
      <Modal
        visible={modal}
        width="80%"
        height="300"
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
        width="80%"
        height="300"
        effect="fadeInUp"
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

export default CoachCreateWorkout;
