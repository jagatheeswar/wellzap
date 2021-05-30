import React, { useState, useEffect } from "react";
import "./AthleteNutrition.css";
import NutritionScreenHeader from "./NutritionScreenHeader";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import AddFoodCard from "./AddFoodCard";

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
  const [serverData, setServerData] = useState([]);
  const [entireFood, setEntireFood] = useState([
    {
      meal: "",
      description: "",
      food: [
        {
          foodName: "",
          quantity: 1,
        },
      ],
    },
  ]);
  const [foodId, setFoodId] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    fetch("https://rongoeirnet.herokuapp.com/getFood")
      .then((response) => response.json())
      .then((responseJson) => {
        //Successful response from the API Call
        setServerData(responseJson.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="coachAddMeal">
      <div className="coachAddMeal__header">
        <NutritionScreenHeader name="Add Meal" />
        <img src="/assets/nutrition.jpeg" alt="" />
      </div>
      <div className="coachAddMeal__input">
        <h4>Nutrition Plan Name</h4>
        <input type="text" placeholder="Enter Nutrition Plan Name" />
      </div>
      <div className="coachAddMeal__form">
        <div className="athleteAddMeal__typeOfMeal">
          {entireFood.map((ent, index) => (
            <div className="athleteAddMealfood__container">
              <FormControl className={classes.formControl}>
                <InputLabel id="meal-select-label">
                  Select the type of meal
                </InputLabel>
                <Select
                  labelId="meal-select-label"
                  id="meal-select-label"
                  value={ent.meal}
                  onChange={(e) => {
                    let temp = [...entireFood];
                    temp[index].meal = e.target.value;
                    setEntireFood(temp);
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
                <textarea type="text" placeholder="Enter Meal Description" />
              </div>

              <div className="foodCard__addButtons">
                <div
                  className="foodCard__addfoodButton"
                  onClick={() => {
                    let foodData = [...entireFood];
                    let temp = [...ent.food];
                    temp.push({
                      foodName: "",
                      quantity: 1,
                    });
                    foodData[index].food = temp;
                    setEntireFood(foodData);
                  }}
                >
                  <h3>Add Food</h3>
                </div>

                <div
                  className="foodCard__addmealButton"
                  onClick={() => {
                    setEntireFood([
                      ...entireFood,
                      {
                        meal: "",
                        description: "",
                        food: [
                          {
                            foodName: "",
                            quantity: 1,
                          },
                        ],
                      },
                    ]);
                  }}
                >
                  <h3>Add Meal</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoachAddMeal;
