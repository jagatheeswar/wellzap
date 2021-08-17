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
import { useLocation } from "react-router-dom";
import firebase from "firebase";
import Switch from "@material-ui/core/Switch";

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
  const location = useLocation();
  const userData = useSelector(selectUserData);
  const [serverData, setServerData] = useState([]);
  const [FoodName, setFoodName] = useState(null);
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
  const [requestDate, setRequestDate] = useState(formatDate());
  const [foodId, setFoodId] = useState("");
  const [type, setType] = useState("");
  const history = useHistory();
  const [todaysFoodId, setTodaysFoodId] = useState(null);
  const [CoachMeal, setCoachMeal] = useState([
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
  const [showCoachMeal, setShowCoachMeal] = useState(false);

  // useEffect(() => {
  //   if (!todaysFoodId) {
  //     getInitialData();
  //   }
  // }, [userData?.id]);

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

  useEffect(() => {
    if (userData) {
      db.collection("Food")
        .where("assignedTo_id", "==", userData?.id)
        .where("selectedDays", "array-contains", foodId)
        .get()
        .then((snapshot) => {
          setCoachMeal(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, [requestDate, userData]);
  useEffect(() => {
    if (userData) {
      if (!location?.state?.todaysFoodId) {
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
      }
    }
  }, [userData]);
  useEffect(() => {
    if (location.state?.nutrition) {
      console.log(location.state?.nutrition.data.nutrition.plan);
      // setCoachEntireFood(location.state?.nutrition.data.nutrition.plan);
      setFoodName(location.state?.nutrition.data.nutrition.nutritionName);
    }
  }, [location.state?.nutrition]);

  console.log("total", location.state);

  useEffect(() => {
    if (location.state?.type) {
      setType(location.state?.type);
    }
  }, [location.state?.type]);

  useEffect(() => {
    if (location.state?.entireFood && location.state.entireFood.length > 0) {
      console.log(16);
      setEntireFood(location.state.entireFood);
    }
  }, [location.state?.entireFood]);

  useEffect(() => {
    if (location.state?.todaysFoodId) {
      setFoodId(location.state.todaysFoodId);
      console.log("Food id is", location.state?.todaysFoodId);
    }
  }, [location.state?.todaysFoodId]);

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
        name={"Food Logs for " + foodId ? foodId : todaysFoodId}
        entireFood={entireFood}
        todaysFoodId={todaysFoodId}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <div onClick={() => {}}>Your Meal</div>
        <Switch
          checked={showCoachMeal}
          onChange={(event) => {
            setShowCoachMeal(!showCoachMeal);
          }}
          name="Show Coach Meal"
          value={showCoachMeal}
          inputProps={{ "aria-label": "primary checkbox" }}
          color="#ffe486"
        />
        <div onClick={() => {}}>Assigned Meal</div>
      </div>
      {console.log(entireFood)}
      {!showCoachMeal && entireFood && (
        <AddMeal
          serverData={serverData}
          entireFood={entireFood}
          setEntireFood={setEntireFood}
          type={type}
          classes={classes}
        />
      )}

      {showCoachMeal &&
        (CoachMeal && CoachMeal[0]?.data?.nutrition?.entireFood ? (
          <AddMeal
            serverData={serverData}
            entireFood={CoachMeal[0]?.data?.nutrition?.entireFood}
            setEntireFood={setEntireFood}
            type={type}
            classes={classes}
          />
        ) : (
          <div
            style={{
              margin: 20,
              marginTop: 40,
              textAlign: "center",
            }}
          >
            There are no assigned meals for selected day
          </div>
        ))}

      {/* */}
      {console.log(CoachMeal[0]?.data?.nutrition?.entireFood)}
      {!showCoachMeal && (
        <div
          className="athleteFoodCard__submitMealButton"
          style={{ marginBottom: 20 }}
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
                console.log("id", entireFood);

                db.collection("AthleteNutrition")
                  .doc(userData?.id)
                  .collection("nutrition")
                  .doc(foodId ? foodId : formatDate())
                  .set(
                    {
                      entireFood,
                      date: new Date(foodId ? foodId : formatDate()),

                      timestamp:
                        firebase.firestore.FieldValue.serverTimestamp(),
                    },

                    { merge: true }
                  )
                  .then(() => {
                    history.push("/nutrition");
                  })
                  .catch((error) => {
                    console.error("Error updating document: ", error);
                  });
              }
            }
          }}
        >
          <h3> {type === "non-editable" ? "Return" : "Complete Nutrition"}</h3>
        </div>
      )}
    </div>
  );
}

export default AthleteAddMeal;
