import React, { useState, useEffect } from "react";
import "./AthleteNutrition.css";
import NutritionScreenHeader from "./NutritionScreenHeader";
import { makeStyles } from "@material-ui/core/styles";
import AddMeal from "../../Components/AddMeal/AddMeal";
import { useHistory } from "react-router";
import { db } from "../../utils/firebase";
import { selectUserData } from "../../features/userSlice";
import { useSelector } from "react-redux";
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

function AthleteAddMeal() {
  const classes = useStyles();
  const userData = useSelector(selectUserData);
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
  const history = useHistory();
  const [todaysFoodId, setTodaysFoodId] = useState("");

  useEffect(() => {
    getInitialData();
  }, [userData?.id]);

  const getInitialData = async () => {
    db.collection("AthleteNutrition")
      .doc(userData?.id)
      .collection("nutrition")
      .doc(formatDate())
      .get()
      .then((doc) => {
          if (doc.data()?.entireFood) {
            setEntireFood(doc.data()?.entireFood);
            setTodaysFoodId(doc.id);
          }
      
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  console.log({ entireFood });

  useEffect(() => {
    fetch("https://rongoeirnet.herokuapp.com/getFood")
      .then((response) => response.json())
      .then((responseJson) => {
        //Successful response from the API Call
        console.log("Got the data");
        setServerData(responseJson.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="athleteAddMeal">
      <NutritionScreenHeader
        name="Add Meal"
        entireFood={entireFood}
        todaysFoodId={todaysFoodId}
      />
      <AddMeal
        serverData={serverData}
        entireFood={entireFood}
        setEntireFood={setEntireFood}
        type={type}
        classes={classes}
      />
      <div
        className="athleteFoodCard__submitMealButton"
        onClick={() => {
          if (type === "non-editable") {
            history.goBack();
          } else {
            var save = true;
            entireFood.forEach((id) => {
              if (id.meal == "Select the type of meal" || id.meal == "") {
                save = false;
              }
            });
            if (!save) {
              alert("Please select a meal");
            } else {
              db.collection("AthleteNutrition")
              .doc(userData?.id)
              .collection("nutrition")
              .doc(formatDate())
                .get()
                .then((snap) => {
                  if (snap.empty) {
                    db.collection("AthleteNutrition")
                      .doc(userData?.id)
                      .collection("nutrition")
                      .doc(formatDate())
                      .set({
                        entireFood,
                      })
                      .then((docRef) => {
                        console.log("Document successfully updated!", docRef);
                        history.push("/nutrition");
                      })
                      .catch((error) => {
                        console.error("Error updating document: ", error);
                      });
                  } else {
                    db.collection("AthleteNutrition")
                      .doc(userData?.id)
                      .collection("nutrition")
                      .doc(formatDate())
                          .update({
                            entireFood,
                          })
                          .then(() => {})
                          .catch((err) => {
                            console.log(err);
                          });
  
                  }
                });
            }
          }
        }}
      >
        <h3> {type === "non-editable" ? "Return" : "Complete Nutrition"}</h3>
      </div>
    </div>
  );
}

export default AthleteAddMeal;
