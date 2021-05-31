import React, { useEffect, useState } from "react";
import "./Workouts.css";
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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled("div")`
  width: 300px;
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

const Listbox = styled("ul")`
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
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

function CoachCreateWorkout() {
  const classes = useStyles();

  const userData = useSelector(selectUserData);
  const [coaches, setCoaches] = useState([]);

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
    options: coaches,
    getOptionLabel: (option) => option.title,
  });

  useEffect(() => {
    if (userData?.id) {
      const data = [];
      db.collection("coaches")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((coach) => {
            if (userData?.data.listOfCoaches.includes(coach.id)) {
              let currentID = coach.id;
              let appObj = { ...coach.data(), ["id"]: currentID };
              data.push(appObj);
            }
          });
          setCoaches(data);
        });
    }
  }, [userData?.id]);

  return (
    <div className="coachCreateWorkout">
      <WorkoutScreenHeader name="Create Workout" />
      <div className="coachCreateWorkout__workoutName">
        <h3>Workout Name</h3>
        <input type="text" placeholder="Enter Workout Name" />
      </div>
      <img src="/assets/illustration.jpeg" alt="" height="400px" width="90%" />

      <div className="coachCreateWorkout__selectDropdown">
        <NoSsr>
          <div>
            <div {...getRootProps()} className="selectDropdown1">
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  lineHeight: "28px",
                }}
              >
                Workout Details
              </h3>
              <Label
                style={{
                  fontSize: "18px",
                  fontWeight: "400",
                  lineHeight: "20px",
                  paddingBottom: "2%",
                }}
                {...getInputLabelProps()}
              >
                Equipments Needed
              </Label>
              <InputWrapper
                ref={setAnchorEl}
                className={focused ? "focused" : ""}
                style={{ marginBottom: "3%" }}
              >
                {value.map((option, index) => (
                  <Tag label={option.name} {...getTagProps({ index })} />
                ))}

                <input {...getInputProps()} placeholder="Equipments Selected" />
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
          </div>
        </NoSsr>
        <NoSsr>
          <div>
            <div {...getRootProps()} className="selectDropdown1">
              <Label
                style={{
                  fontSize: "18px",
                  fontWeight: "400",
                  lineHeight: "20px",
                  paddingBottom: "2%",
                }}
                {...getInputLabelProps()}
              >
                Targeted Muscle Group
              </Label>
              <InputWrapper
                ref={setAnchorEl}
                className={focused ? "focused" : ""}
              >
                {value.map((option, index) => (
                  <Tag label={option.name} {...getTagProps({ index })} />
                ))}

                <input
                  {...getInputProps()}
                  placeholder="Enter the target muscle group"
                />
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
          </div>
        </NoSsr>
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
