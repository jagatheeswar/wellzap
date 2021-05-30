import React, { useState, useEffect } from "react";
import "./AthleteNutrition.css";
import NutritionScreenHeader from "./NutritionScreenHeader";
import { makeStyles } from "@material-ui/core/styles";
import AddMeal from "../../Components/AddMeal/AddMeal";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function AthleteAddMeal() {
  const classes = useStyles();
  const [serverData, setServerData] = useState([]);
  const [entireFood, setEntireFood] = useState([
    {
      meal: "",
      description: "",
      food: [
        {
          foodName: "",
          proteins: 0,
          carbs: 0,
          fat: 0,
          calories: 0,
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
    <div className="athleteAddMeal">
      <NutritionScreenHeader name="Add Meal" />
      <AddMeal
        serverData={serverData}
        entireFood={entireFood}
        setEntireFood={setEntireFood}
        type={type}
        classes={classes}
      />
    </div>
  );
}

export default AthleteAddMeal;
