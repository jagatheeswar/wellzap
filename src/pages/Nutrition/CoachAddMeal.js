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
import firebase from "firebase";
import Switch from "@material-ui/core/Switch";
import styled from "styled-components";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
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

function CoachAddMeal(props) {
  const classes = useStyles();
  const userType = useSelector(selectUserType);
  const userData = useSelector(selectUserData);
  const [nutritionName, setNutritionName] = useState("");
  const [addFood, setAddFood] = useState(false);
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
      addFood: false,
    },
  ]);
  const [foodId, setFoodId] = useState("");
  const [type, setType] = useState("");
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const history = useHistory();

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

  // useEffect(() => {
  //   if (route.params?.nutrition) {
  //     setPlan(route.params?.nutrition.data.nutrition.plan);
  //     setFoodName(route.params?.nutrition.data.nutrition.nutritionName);
  //   }
  // }, [route.params?.nutrition]);

  const AddLongTermMeal = () => {
    /*
    db.collection("Food")
    .add({
      from_id: userData?.id,
      assignedTo_id: "",
      nutrition: {
        nutritionName: nutritionName,
        plan,
      },
    })*/
    var weeks = props.weeks;
    var selectedWeekNum = props.selectedWeekNum;
    var selectedDay = props.selectedDay;
    weeks[selectedWeekNum - 1].days[selectedDay] = {
      from_id: userData?.id,
      assignedTo_id: "",
      nutrition: {
        nutritionName: nutritionName,
        entireFood,
      },
    };
    props.setWeeks(weeks);
    props.handleCloseNutrition();
  };

  return (
    <div className="coachAddMeal">
      <div className="coachAddMeal__header">
        <NutritionScreenHeader name="Add Meal" />
        <img src="/assets/nutrition.jpeg" alt="" />
      </div>
      <div className="coachAddMeal__input">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4>Nutrition Plan Name</h4>
          {userType !== "athlete" && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ margin: 0, marginRight: 10 }}>Add Food</p>
              <Switch
                checked={addFood}
                onChange={(event) => {
                  let tempMeal = [...entireFood];
                  tempMeal[0].addFood = !addFood;
                  setEntireFood(tempMeal);
                  setAddFood(!addFood);
                }}
                name="Add Food"
                value={addFood}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Enter Nutrition Plan Name"
          value={nutritionName}
          onChange={(e) => setNutritionName(e.target.value)}
        />
      </div>

      <div className="coachAddMeal__form">
        <div className="athleteAddMeal__typeOfMeal">
          {entireFood?.map((item, idx) => (
            <div className="athleteAddMealfood__container">
              <FormControl className={classes.formControl}>
                <b style={{ marginBottom: 10 }}>Select the type of meal</b>
                <Select
                  labelId="meal-select-label"
                  id="meal-select-label"
                  value={item.meal}
                  onChange={(e) => {
                    let temp = [...entireFood];
                    temp[idx].meal = e.target.value;
                    setEntireFood(temp);
                  }}
                  style={{ width: "97%" }}
                >
                  <MenuItem value={"Breakfast"}>Breakfast</MenuItem>
                  <MenuItem value={"Lunch"}>Lunch</MenuItem>
                  <MenuItem value={"Snack"}>Snack</MenuItem>
                  <MenuItem value={"Pre Workout"}>Pre Workout</MenuItem>
                  <MenuItem value={"Post Workout"}>Post Workout</MenuItem>
                  <MenuItem value={"Dinner"}>Dinner</MenuItem>
                </Select>
              </FormControl>
              {addFood ? (
                <div>
                  {item.food?.map((item2, idx2) => {
                    return (
                      <AddFoodCard
                        type={type}
                        item={item2}
                        idx={idx2}
                        key={idx2}
                        ent={item}
                        entireFood={entireFood}
                        index={idx}
                        serverData={serverData}
                        setEntireFood={setEntireFood}
                      />
                    );
                  })}
                  <div
                    className="foodCard__addfoodButton"
                    onClick={() => {
                      let foodData = [...entireFood];
                      let temp = [...item.food];
                      temp.push({
                        foodName: "",
                        proteins: 0,
                        carbs: 0,
                        fat: 0,
                        calories: 0,
                        quantity: 1,
                      });
                      foodData[idx].food = temp;

                      setEntireFood(foodData);
                    }}
                  >
                    <h3>Add Food</h3>
                  </div>
                </div>
              ) : (
                <div className="coachAddMeal__textArea">
                  <h4 style={{ margin: 0, marginBottom: 10 }}>Description</h4>
                  <textarea
                    type="text"
                    placeholder="Enter Meal Description"
                    value={item.description}
                    onChange={(e) => {
                      let temp = [...entireFood];
                      temp[idx].description = e.target.value;
                      setEntireFood(temp);
                    }}
                  />
                </div>
              )}
            </div>
          ))}

          {userType !== "athlete" && (
            <div
              className="coachFoodCard__addmealButton"
              onClick={() => {
                setEntireFood([
                  ...entireFood,
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
                    addFood: false,
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
              style={{ padding: 5 }}
              onClick={() => {
                if (props.isLongTerm) {
                  AddLongTermMeal();
                } else {
                  setModal(true);
                }
              }}
            >
              <h3>Confirm</h3>
            </div>
          )}
        </div>
      </div>
      <Modal
        visible={modal}
        width="450px"
        height="250"
        effect="fadeInUp"
        onClickaway={() => setModal(false)}
      >
        <div className="createWorkout__modal">
          <h3>Save Nutrition?</h3>
          <h3> Do you want to save the Nutrition</h3>
          <div className="createWorkout__modalButtons">
            <div
              className="createWorkout__modalButton"
              onClick={() => setModal(false)}
              style={{
                backgroundColor: "transparent",
              }}
            >
              CANCEL
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className="createWorkout__modalButton"
                onClick={() => {
                  setModal(false);
                  setModal1(true);
                }}
                style={{
                  backgroundColor: "transparent",
                  fontWeight: 600,
                }}
              >
                DON'T SAVE
              </div>
              <div
                className="createWorkout__modalButton"
                style={{
                  borderRadius: 10,
                  padding: "5px 20px",
                }}
                onClick={() => {
                  if (nutritionName) {
                    db.collection("Food")
                      .add({
                        from_id: userData?.id,
                        assignedTo_id: "",
                        nutrition: {
                          nutritionName: nutritionName,
                          entireFood,
                          timestamp:
                            firebase.firestore.FieldValue.serverTimestamp(),
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
                  } else {
                    alert("Please choose a name for nutrition");
                  }
                }}
              >
                SAVE
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        visible={modal1}
        width="450"
        height="250"
        effect="fadeInUp"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
        onClickaway={() => setModal(false)}
      >
        <div className="createWorkout__modal">
          <h3>Assign meal</h3>
          <h4>Do you want to Assign the Meal</h4>
          <div className="createWorkout__modalButtons">
            <div
              className="createWorkout__modalButton"
              onClick={() => setModal1(false)}
              style={{
                backgroundColor: "transparent",
              }}
            >
              CANCEL
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className="createWorkout__modalButton"
                onClick={() => {
                  setModal1(false);
                }}
                style={{
                  backgroundColor: "transparent",
                  fontWeight: 600,
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
                        entireFood,
                      },
                      type: "add",
                    },
                  });
                  setModal1(false);
                }}
                style={{
                  borderRadius: 10,
                  padding: "5px 20px",
                }}
              >
                YES
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CoachAddMeal;
