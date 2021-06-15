import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core";
import FormControlLabelPlacement from "../../Components/Buttons/YesNoButton";
import Months from "../../Components/Buttons/Months";
import Numbers from "../../Components/Buttons/Numbers";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTemperoryId,
  selectUser,
  selectUserType,
} from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function AthleteFoodAndLifestyleAssessment_coach({ route, navigation }) {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [doSmoke, setDoSmoke] = useState(false);
  const [consumeAlcohol, setConsumeAlcohol] = useState(false);
  const [haveAllergies, setHaveAllergies] = useState(false);
  const [fast, setFast] = useState(false);
  const [avoidNonVeg, setAvoidNonVeg] = useState(false);
  const [specifyAllergies, setSpecifyAllergies] = useState("");
  const [dishesDisliked, setDishesDisliked] = useState("");
  const [favDish, setFavDish] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");
  const [smokeFrequency, setSmokeFrequency] = useState("");
  const [smokePer, setSmokePer] = useState("");
  const [alcoholFrequency, setAlcoholFrequency] = useState("");
  const [alcoholPer, setAlcoholPer] = useState("");
  const [outsideFoodFrequency, setOutsideFoodFrequency] = useState("");
  const [outsideFoodPer, setOutsideFoodPer] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [daysList, setDaysList] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  const [selectedAvoidNonvegDays, setSelectedAvoidNonvegDays] = useState([]);
  const [selectedFastDays, setSelectedFastDays] = useState([]);
  const [color, changeColor] = useState([]);
  const [color1, changeColor1] = useState([]);
  const dispatch = useDispatch();
  const [type, setType] = useState(null);
  const [athlete_id, setAtheteId] = useState(null);
  const params = useParams();
  const Id = params.AthleteId;
  window.history.pushState(null, "", "/Athlete/food-and-lifestyle-assessment");

  useEffect(() => {
    if (userType == "coach") {
      db.collection("athletes")
        .doc(Id ? Id : 1)
        .get()
        .then(function (snap) {
          setUserData({
            id: Id,
            data: snap.data(),
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } else {
      setEditable(true);
      db.collection("athletes")
        .where("email", "==", user)
        .get()
        .then(function (snap) {
          snap.docs.forEach((item) => {
            setUserData({
              id: item.id,
              data: item.data(),
            });
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  }, [user, temperoryId]);

  useEffect(() => {
    if (userData) {
      let temp1 = [];
      let temp2 = [];
      db.collection("athletes")
        .doc(userData?.id)
        .collection("Lifestyle")
        .doc("lifestyle")
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            if (doc.data().doSmoke === "yes") {
              setDoSmoke("yes");
            } else {
              setDoSmoke("no");
            }
            if (doc.data().consumeAlcohol === "yes") {
              setConsumeAlcohol("yes");
            } else {
              setConsumeAlcohol("no");
            }
            if (doc.data().fast === "yes") {
              setFast("yes");
            } else {
              setFast("no");
            }
            if (doc.data().haveAllergies === "yes") {
              setHaveAllergies("yes");
            } else {
              setHaveAllergies("no");
            }
            if (doc.data().alcoholPer) {
              setAlcoholPer(doc.data().alcoholPer);
            } else {
              setAlcoholPer([]);
            }
            if (doc.data()?.smokePer) {
              setSmokePer(doc.data()?.smokePer);
            } else {
              setSmokePer([]);
            }
            if (doc.data().smokeFrequency) {
              setSmokeFrequency(doc.data().smokeFrequency);
            } else {
              setSmokeFrequency([]);
            }
            if (doc.data().alcoholFrequency) {
              setAlcoholFrequency(doc.data().alcoholFrequency);
            } else {
              setAlcoholFrequency([]);
            }
            if (doc.data().outsideFoodFrequency) {
              setOutsideFoodFrequency(doc.data().outsideFoodFrequency);
            } else {
              setOutsideFoodFrequency([]);
            }
            if (doc.data().outsideFoodPer) {
              setOutsideFoodPer(doc.data().outsideFoodPer);
            } else {
              setOutsideFoodPer([]);
            }
            setAvoidNonVeg(doc.data().avoidNonVeg);
            setSpecifyAllergies(doc.data().specifyAllergies);
            setDishesDisliked(doc.data().dishesDisliked);
            setFavDish(doc.data().favDish);
            setCuisine(doc.data().cuisine);
            setDiet(doc.data().diet);

            setAdditionalDetails(doc.data().additionalDetails);
            setSelectedAvoidNonvegDays(doc.data().selectedAvoidNonvegDays);
            daysList.map((item, idx) => {
              if (doc.data().selectedAvoidNonvegDays.includes(item)) {
                temp1.push(idx);
              }
            });
            setSelectedFastDays(doc.data().selectedFastDays);
            daysList.map((item, idx) => {
              if (doc.data().selectedFastDays.includes(item)) {
                console.log("selected item is ", item);

                temp2.push(idx);
              }
            });
            changeColor(temp1);
            changeColor1(temp2);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((e) => console.log(e));
    }
  }, [userData?.id]);

  useEffect(() => {
    daysList.map((item, idx) => {
      if (!selectedAvoidNonvegDays.includes(item)) {
        if (color.includes(idx)) {
          setSelectedAvoidNonvegDays([...selectedAvoidNonvegDays, item]);
        }
      }
    });
  }, [color]);

  useEffect(() => {
    daysList.map((item, idx) => {
      if (!selectedFastDays.includes(item)) {
        if (color1.includes(idx)) {
          setSelectedFastDays([...selectedFastDays, item]);
        }
      }
    });
  }, [color1]);

  const saveDetails = () => {
    if (route?.params?.setAddDetails) {
      route.params.setAddDetails(true);
    }
    db.collection("athletes")
      .doc(userData?.id)
      .collection("Lifestyle")
      .get()
      .then((snap) => {
        if (!snap.empty) {
          db.collection("athletes")
            .doc(userData.id)
            .collection("Lifestyle")
            .doc("lifestyle")
            .update({
              doSmoke,
              smokeFrequency,
              smokePer,
              consumeAlcohol,
              haveAllergies,
              fast,
              avoidNonVeg,
              specifyAllergies,
              dishesDisliked,
              favDish,
              cuisine,
              diet,
              alcoholFrequency,
              alcoholPer,
              outsideFoodFrequency,
              outsideFoodPer,
              additionalDetails,
              selectedFastDays,
              selectedAvoidNonvegDays,
            })
            .then((res) => {})
            .catch((e) => console.log(e));
        } else {
          db.collection("athletes")
            .doc(userData.id)
            .collection("Lifestyle")
            .doc("lifestyle")
            .set({
              doSmoke,
              smokeFrequency,
              smokePer,
              consumeAlcohol,
              haveAllergies,
              fast,
              avoidNonVeg,
              specifyAllergies,
              dishesDisliked,
              favDish,
              cuisine,
              diet,
              alcoholFrequency,
              alcoholPer,
              outsideFoodFrequency,
              outsideFoodPer,
              additionalDetails,
              selectedFastDays,
              selectedAvoidNonvegDays,
            })
            .then((res) => {})
            .catch((e) => console.log(e));
        }
      });

    setEditable(false);
  };
  const classes = useStyles();
  return (
    <div className="athleteFoodAndLifestyleAssessment">
      <div className="athleteProfile__leftContainer">
        <Header />
        <div className="athleteFoodAndLifestyleAssessment__container">
          <h2>Food and Lifestyle Assessment</h2>
          <h4>What is your diet?</h4>
          <FormControl className={classes.formControl}>
            <InputLabel id="meal-select-label">Select Diet</InputLabel>
            <Select
              labelId="meal-select-label"
              id="meal-select-label"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              disabled={!editable}
            >
              <MenuItem value={"Veg"}>Veg</MenuItem>
              <MenuItem value={"Non-Veg"}>Non-Veg</MenuItem>
              <MenuItem value={"Eggitarian"}>Eggitarian</MenuItem>
              <MenuItem value={"Pescetarian(Fish)"}>Pescetarian(Fish)</MenuItem>
              <MenuItem value={"Jain Food"}>Jain Food</MenuItem>
            </Select>
          </FormControl>
          <div className="athleteFoodAndLifestyleAssessment__smokeContent">
            <h4>Do you smoke?</h4>
            <FormControlLabelPlacement
              value={doSmoke}
              setValue={setDoSmoke}
              editable={editable}
            />
            <h4>Select frequency</h4>
            <div className="smokeContentFrequency">
              <Numbers
                value={smokeFrequency}
                setValue={setSmokeFrequency}
                editable={editable}
              />
              <Months
                value={smokePer}
                setValue={setSmokePer}
                editable={editable}
              />
            </div>
          </div>
          <div className="athleteFoodAndLifestyleAssessment__alcoholContent">
            <h4>Do you consume alcohol?</h4>
            <FormControlLabelPlacement
              value={consumeAlcohol}
              setValue={setConsumeAlcohol}
              editable={editable}
            />
            <div className="alcoholConsumptionFrequency">
              <Numbers
                value={alcoholFrequency}
                setValue={setAlcoholFrequency}
                editable={editable}
              />
              <Months
                value={alcoholPer}
                setValue={setAlcoholPer}
                editable={editable}
              />
            </div>
          </div>
          <div className="athleteFoodAndLifestyleAssessment__eatingContent">
            <h4>How frequently do you eat outside?</h4>
            <div className="eatingFrequency">
              <Numbers
                value={outsideFoodFrequency}
                setValue={setOutsideFoodFrequency}
                editable={editable}
              />
              <Months
                value={outsideFoodPer}
                setValue={setOutsideFoodPer}
                editable={editable}
              />
            </div>
          </div>
          <div className="athleteFoodAndLifestyleAssessment__foodContent">
            <h4>What do you preferred cuisine?</h4>
            <input
              readOnly={!editable}
              onChange={(e) => {
                setCuisine(e.target.value);
              }}
              value={cuisine}
              type="text"
              placeholder="Type your preferred cuisine"
            />
            <h4>What is your favourite dish?</h4>
            <input
              readOnly={!editable}
              onChange={(e) => {
                setFavDish(e.target.value);
              }}
              value={favDish}
              type="text"
              placeholder="Please specify"
            />
            <h4>Do you have any dishes you dislike?</h4>
            <input
              readOnly={!editable}
              onChange={(e) => {
                setDishesDisliked(e.target.value);
              }}
              value={dishesDisliked}
              type="text"
              placeholder="Please specify"
            />
            <h4>Do you have allergies?</h4>
            <FormControlLabelPlacement
              value={haveAllergies}
              setValue={setHaveAllergies}
              editable={editable}
            />
            <h4>Please specify</h4>
            <input
              readOnly={!editable}
              onChange={(e) => {
                setSpecifyAllergies(e.target.value);
              }}
              value={specifyAllergies}
              type="text"
              placeholder="Type your allergies"
            />
            <h4>Do you fast?</h4>
            <FormControlLabelPlacement
              value={fast}
              setValue={setFast}
              editable={editable}
            />
            <div className="athleteFoodAndLifestyleSelectdays__container">
              {" "}
              {daysList.map((day, idx) => (
                <div
                  className="athleteFoodAndLifestyleAssessment__days"
                  key={idx}
                  onClick={() => {
                    if (color1.includes(idx)) {
                      var array = [...color1];

                      var index = array.indexOf(idx);
                      if (index !== -1) {
                        array.splice(index, 1);

                        changeColor1(array);
                      }
                      var list = selectedFastDays.filter(
                        (t) => t !== daysList[idx]
                      );
                      setSelectedFastDays(list);
                    } else {
                      changeColor1([...color1, idx]);
                    }
                  }}
                  disabled={!editable}
                  style={
                    color1.includes(idx)
                      ? {
                          backgroundColor: "#fcd54a",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                          textAlign: "center",
                          borderRadius: 10,
                          marginRight: 8,
                          marginBottom: 5,
                          height: 30,
                          width: 60,
                          fontWeight: 600,
                        }
                      : {
                          backgroundColor: "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                          textAlign: "center",
                          borderRadius: 10,
                          marginRight: 8,
                          marginBottom: 5,
                          height: 30,
                          width: 60,
                          fontWeight: 600,
                        }
                  }
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          <h4>Do you avoid non-veg on specific days?</h4>
          <FormControlLabelPlacement
            value={avoidNonVeg}
            setValue={setAvoidNonVeg}
            editable={editable}
          />
          <div className="athleteFoodAndLifestyleSelectdays__container">
            {" "}
            {daysList.map((day, idx) => (
              <div
                className="athleteFoodAndLifestyleAssessment__days"
                key={idx}
                onClick={() => {
                  if (color.includes(idx)) {
                    var array = [...color];

                    var index = array.indexOf(idx);
                    if (index !== -1) {
                      array.splice(index, 1);

                      changeColor(array);
                    }
                    var list = selectedAvoidNonvegDays.filter(
                      (t) => t !== daysList[idx]
                    );
                    setSelectedAvoidNonvegDays(list);
                  } else {
                    changeColor([...color, idx]);
                  }
                }}
                disabled={!editable}
                style={
                  color.includes(idx)
                    ? {
                        backgroundColor: "#fcd54a",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        textAlign: "center",
                        borderRadius: 10,
                        marginRight: 8,
                        marginBottom: 5,
                        height: 30,
                        width: 60,
                        fontWeight: 600,
                      }
                    : {
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        textAlign: "center",
                        borderRadius: 10,
                        marginRight: 8,
                        marginBottom: 5,
                        height: 30,
                        width: 60,
                        fontWeight: 600,
                      }
                }
              >
                {day}
              </div>
            ))}
          </div>
          <h4>Additional Details</h4>
          <textarea
            className="athleteFoodAndLifestyleAssessment__textarea"
            readOnly={!editable}
            onChange={(e) => {
              setAdditionalDetails(e.target.value);
            }}
            value={additionalDetails}
            type="text"
            placeholder="Please provide additional details if any"
          />
          {userType !== "coach" &&
            (!editable ? (
              <div
                className="editProfileButton"
                onClick={() => setEditable(true)}
              >
                <h3>EDIT PROFILE</h3>
              </div>
            ) : (
              <div className="saveProfileButton" onClick={() => saveDetails()}>
                <h3>SAVE PROFILE</h3>
              </div>
            ))}{" "}
        </div>
      </div>
    </div>
  );
}

export default AthleteFoodAndLifestyleAssessment_coach;
