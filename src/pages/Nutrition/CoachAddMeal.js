import React, { useState, useEffect } from "react";
import "./CoachNutrition.css";
import NutritionScreenHeader from "./NutritionScreenHeader";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import AddFoodCard from "./AddFoodCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { useSelector } from "react-redux";
import Modal from "react-awesome-modal";
import { useHistory } from "react-router";
import { db } from "../../utils/firebase";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function CoachAddMeal() {
  const classes = useStyles();
  const userType = useSelector(selectUserType);
  const userData = useSelector(selectUserData);
  const [nutritionName, setNutritionName] = useState("");
  const [plan, setPlan] = useState([
    {
      meal: "",
      description: "",
    },
  ]);
  const [foodId, setFoodId] = useState("");
  const [type, setType] = useState("");
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const history = useHistory();

  // useEffect(() => {
  //   if (route.params?.nutrition) {
  //     setPlan(route.params?.nutrition.data.nutrition.plan);
  //     setFoodName(route.params?.nutrition.data.nutrition.nutritionName);
  //   }
  // }, [route.params?.nutrition]);

  console.log({ plan });

  return (
    <div className="coachAddMeal">
      <div className="coachAddMeal__header">
        <NutritionScreenHeader name="Add Meal" />
        <img src="/assets/nutrition.jpeg" alt="" />
      </div>
      <div className="coachAddMeal__input">
        <h4>Nutrition Plan Name</h4>
        <input
          type="text"
          placeholder="Enter Nutrition Plan Name"
          value={nutritionName}
          onChange={(e) => setNutritionName(e.target.value)}
        />
      </div>
      <div className="coachAddMeal__form">
        <div className="athleteAddMeal__typeOfMeal">
          {plan?.map((item, idx) => (
            <div className="athleteAddMealfood__container">
              <FormControl className={classes.formControl}>
                <InputLabel id="meal-select-label">
                  Select the type of meal
                </InputLabel>
                <Select
                  labelId="meal-select-label"
                  id="meal-select-label"
                  value={item.meal}
                  onChange={(e) => {
                    let temp = [...plan];
                    temp[idx].meal = e.target.value;
                    setPlan(temp);
                  }}
                >
                  <MenuItem value={"Breakfast"}>Breakfast</MenuItem>
                  <MenuItem value={"Lunch"}>Lunch</MenuItem>
                  <MenuItem value={"Snack"}>Snack</MenuItem>
                  <MenuItem value={"Pre Workout"}>Pre Workout</MenuItem>
                  <MenuItem value={"Post Workout"}>Post Workout</MenuItem>
                  <MenuItem value={"Dinner"}>Dinner</MenuItem>
                </Select>
              </FormControl>
              <div className="coachAddMeal__textArea">
                <h4>Description</h4>
                <textarea
                  type="text"
                  placeholder="Enter Meal Description"
                  value={item.description}
                  onChange={(e) => {
                    let temp = [...plan];
                    temp[idx].description = e.target.value;
                    setPlan(temp);
                  }}
                />
              </div>
            </div>
          ))}

          {userType !== "athlete" && (
            <div
              className="coachFoodCard__addmealButton"
              onClick={() => {
                setPlan([
                  ...plan,
                  {
                    meal: "",
                    description: "",
                  },
                ]);
              }}
            >
              <h3>Add Meal</h3>
            </div>
          )}
          {userType !== "athlete" && (
            <div
              className="coachFoodCard__submitMealButton"
              onClick={() => {
                setModal(true);
              }}
            >
              <h3>Add Plan</h3>
            </div>
          )}
        </div>
      </div>
      <Modal
        visible={modal}
        width="80%"
        height="300"
        effect="fadeInUp"
        onClickaway={() => setModal(false)}
      >
        <div className="createWorkout__modal">
          <h3>Do you want to save the meal?</h3>
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
                db.collection("Food")
                  .add({
                    from_id: userData?.id,
                    assignedTo_id: "",
                    nutrition: {
                      nutritionName: nutritionName,
                      plan,
                    },
                  })
                  .then(() => {
                    // navigation.navigate("CreateNutrition", {
                    //   nutrition: {
                    //     nutritionName: foodName,
                    //     plan,
                    //   },
                    // });
                    setModal(false);
                    setModal1(true);
                  });
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
          <h3>Would you like to assign this meal to your athletes?</h3>
          <h4>You can complete this step later from the meal screen</h4>
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
                history.push({
                  pathname: "/assign-nutrition",
                  state: {
                    nutrition: {
                      nutritionName: nutritionName,
                      plan,
                    },
                    type: "add",
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
    </div>
  );
}

export default CoachAddMeal;
