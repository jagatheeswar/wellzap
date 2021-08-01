import React, { useEffect, useState } from "react";
import "./AddMeal.css";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import AddFoodCard from "../../pages/Nutrition/AddFoodCard";

function AddMeal({ serverData, entireFood, setEntireFood, type, classes }) {
  return (
    <div className="addMeal">
      <div className="addMeal__typeOfMeal">
        {entireFood.map((ent, index) => (
          <div className="addMealfood__container">
            <FormControl className={classes.formControl}>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: 18,
                }}
              >
                Select Meal Type
              </div>
              <InputLabel id="meal-select-label"></InputLabel>
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
                <MenuItem value={"Supplements"}>Supplements</MenuItem>
              </Select>
            </FormControl>

            {ent.food?.map((item, idx) => {
              return (
                <AddFoodCard
                  type={type}
                  item={item}
                  idx={idx}
                  key={idx}
                  ent={ent}
                  entireFood={entireFood}
                  index={index}
                  serverData={serverData}
                  setEntireFood={setEntireFood}
                />
              );
            })}
            <textarea
              className="foodCard__description"
              type="text"
              placeholder="Description"
              value={entireFood[index].description}
              onChange={(e) => {
                let temp = [...entireFood];
                temp[index].description = e.target.value;
                setEntireFood(temp);
              }}
            />

            <div className="foodCard__addButtons">
              <div
                className="foodCard__addfoodButton"
                onClick={() => {
                  if (ent.food[ent.food.length - 1].foodName == "") {
                    console.log("no");
                  } else {
                    let foodData = [...entireFood];
                    let temp = [...ent.food];

                    temp.push({
                      foodName: "",
                      proteins: 0,
                      carbs: 0,
                      fat: 0,
                      calories: 0,
                      quantity: 1,
                    });
                    foodData[index].food = temp;

                    setEntireFood(foodData);
                  }
                }}
              >
                <h3>Add Food</h3>
              </div>

              <div
                className="foodCard__addmealButton"
                onClick={() => {
                  if (entireFood[entireFood.length - 1].foodName == "") {
                    console.log("no");
                  } else {
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
                  }
                }}
              >
                <h3>Add Meal</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddMeal;
