import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import NutritionScreenHeader from "./NutritionScreenHeader";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import NoSsr from "@material-ui/core/NoSsr";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import formatSpecificDate from "../../functions/formatSpecificDate";
import { formatDate } from "../../functions/formatDate";
import incr_date from "../../functions/incr_date";
import formatSpecificDate1 from "../../functions/formatSpecificDate1";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import { useHistory, useLocation } from "react-router";
import firebase from "firebase";
import "./CoachNutrition.css";
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

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
  margin-left: 4%;
  margin-top: 20px;
`;

const InputWrapper = styled("div")`
  width: 350px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 4%;

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
  width: 350px;
  margin: 2px 0 0;
  margin-left: 2.1%;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 150px;
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

function CreateNutrition() {
  const classes = useStyles();
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [nutritionId, setNutritionId] = useState("");
  const [nutritionName, setNutritionName] = useState("");
  const [plan, setPlan] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [currentStartWeek, setCurrentStartWeek] = useState(null);
  const [currentEndWeek, setCurrentEndWeek] = useState(null);
  const [Nutrition, setNutrition] = useState(null);
  const [daysList, setDaysList] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
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

  //const [nutrition, setNutrition] = useState(null);

  const [serverData, setServerData] = useState([]);
  const [addFood, setAddFood] = useState(false);
  const [selectedAthletes1, setSelectedAthletes1] = useState([]);
  const [athlete_selecteddays, setathlete_selecteddays] = useState({});
  const [specificDates, setSpecificDates] = useState([]);
  const [type, setType] = useState("");
  const location = useLocation();
  const history = useHistory();
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
    options: athletes,
    getOptionLabel: (option) => option.name,
  });

  useEffect(() => {
    value.map((v) => {
      v.selectedDays = [];
    });
    setSelectedAthletes(value);
  }, [value]);

  useEffect(() => {
    if (location.state?.nutrition) {
      console.log(location.state);
      setNutritionName(location.state?.nutrition?.nutritionName);
      if (location.state?.type === "update") {
        setType(location.state?.type);
        setNutrition(location.state?.nutrition.data.nutrition);
        setNutritionId(location.state.nutrition.id);
        setEntireFood(location.state?.nutrition.data.nutrition?.entireFood);
        setAddFood(
          location.state?.nutrition.data.nutrition?.entireFood[0]?.food
        );
        setSelectedAthletes(location.state?.nutrition.data.selectedAthletes);
      } else if (location.state?.type === "create") {
        setType(location.state?.type);
        setNutrition(location.state?.nutrition.data.nutrition);
        setNutritionId(location.state.nutrition.id);
        setEntireFood(location.state?.nutrition.data.nutrition?.entireFood);
        setAddFood(
          location.state?.nutrition.data.nutrition?.entireFood[0]?.food
        );
      } else if (location.state?.type === "view") {
        setType(location.state?.type);
        setNutrition(location.state?.nutrition.data.nutrition);
        setNutritionId(location.state.nutrition.id);
        setEntireFood(location.state?.nutrition.data.nutrition?.entireFood);
        setAddFood(
          location.state?.nutrition.data.nutrition?.entireFood[0]?.food
        );
        setSelectedAthletes(location.state?.nutrition.data.selectedAthletes);
      } else {
        setNutrition(location.state?.nutrition);
        setEntireFood(location.state?.nutrition?.entireFood);
        setAddFood(location.state?.nutrition?.entireFood[0]?.food);
      }
    }
  }, [location.state?.nutrition]);

  useEffect(() => {
    if (type === "non-editable") {
      var curr = new Date(); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

      setCurrentStartWeek(formatSpecificDate(firstday));
      setCurrentEndWeek(formatSpecificDate(lastday));
    } else {
      var curr = new Date(); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

      setCurrentStartWeek(formatSpecificDate(firstday));
      setCurrentEndWeek(formatSpecificDate(lastday));
    }
  }, []);

  useEffect(() => {
    if (currentStartWeek) {
      let temp = currentStartWeek;
      let datesCollection = [];

      for (var i = 0; i < 7; i++) {
        datesCollection.push(temp);
        temp = incr_date(temp);
      }

      setSpecificDates(datesCollection);
    }
  }, [currentStartWeek]);

  // useEffect(() => {
  //   fetch("https://rongoeirnet.herokuapp.com/getFood")
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       //Successful response from the API Call
  //       setServerData(responseJson.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  function incr_date(date_str) {
    var parts = date_str.split("-");
    var dt = new Date(
      parseInt(parts[0], 10), // year
      parseInt(parts[1], 10) - 1, // month (starts with 0)
      parseInt(parts[2], 10) // date
    );
    dt.setDate(dt.getDate() + 1);
    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);
    if (parts[1].length < 2) {
      parts[1] = "0" + parts[1];
    }
    parts[2] = "" + dt.getDate();
    if (parts[2].length < 2) {
      parts[2] = "0" + parts[2];
    }
    return parts.join("-");
  }

  useEffect(() => {
    if (userData?.id) {
      const data = [];
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((athlete) => {
            if (userData?.data.listOfAthletes.includes(athlete.id)) {
              let currentID = athlete.id;
              let appObj = { ...athlete.data(), ["id"]: currentID };
              data.push(appObj);
            }
          });
          setAthletes(data);
        });
    }
  }, [userData?.id]);

  useEffect(() => {
    console.log(athlete_selecteddays);
    let temp = [...selectedAthletes];
    selectedAthletes.map((athlete, idx) => {
      if (athlete_selecteddays[athlete.id]) {
        temp[idx].selectedDays = athlete_selecteddays[athlete.id];
      }
      if (temp.length == selectedAthletes.length) {
        setSelectedAthletes1(temp);
      }
    });
  }, [selectedAthletes]);

  return (
    <div className="createNutrition">
      <NutritionScreenHeader name="Create Nutrition" />
      <img src="/assets/nutrition.jpeg" alt="" />

      <div>
        <div {...getRootProps()}>
          {/* <Label {...getInputLabelProps()}>Search for Athletes</Label> */}
          <h3 style={{ marginLeft: 30 }}>Search For Athletes</h3>

          <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
            {value.map((option, index) => (
              <Tag label={option.name} {...getTagProps({ index })} />
            ))}

            <input {...getInputProps()} />
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
      {console.log(selectedAthletes1)}
      <div>
        {selectedAthletes1?.map((athlete, index) => (
          <div
            key={index}
            style={{
              marginLeft: "4%",
              marginTop: "25px",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#ffe486",
                borderRadius: "10px",
                height: "45px",
                width: "350px",
              }}
            >
              <img
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "10px",
                  marginLeft: "20px",
                  marginRight: "20px",
                }}
                src={athlete.imageUrl ? athlete.imageUrl : null}
              />
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  lineHeight: "28px",
                  color: "black",
                  marginLeft: "15%",
                }}
              >
                {athlete.name}
              </h2>
            </div>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "600",
                marginTop: "10px",
                lineHeight: "28px",
                marginLeft: "1%",
              }}
            >
              Select days
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                marginBottom: "10px",
                width: "300px",
              }}
            >
              <div
                style={{
                  marginLeft: "3%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "300px",
                }}
              >
                <IconButton
                  style={{
                    marginRight: "10px",
                    marginLeft: "25%",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    var curr = new Date(currentStartWeek); // get current date
                    var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

                    var firstday = new Date(curr.setDate(first)).toUTCString();
                    var lastday = new Date(
                      curr.setDate(curr.getDate() + 6)
                    ).toUTCString();
                    if (new Date(currentStartWeek) > new Date()) {
                      setCurrentStartWeek(formatSpecificDate(firstday));
                      setCurrentEndWeek(formatSpecificDate(lastday));
                    }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                {daysList.map((day, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (type !== "view") {
                        if (
                          athlete?.selectedDays?.includes(specificDates[idx])
                        ) {
                          let selected = selectedAthletes[index].selectedDays;
                          var index1 = selected.indexOf(specificDates[idx]);
                          if (index1 !== -1) {
                            selected.splice(index1, 1);
                            selectedAthletes[index] = {
                              ...selectedAthletes[index],
                              selected,
                            };
                            setSelectedAthletes([...selectedAthletes]);
                          }
                        } else {
                          if (
                            new Date(specificDates[idx]) > new Date() ||
                            specificDates[idx] === formatDate()
                          ) {
                            let selectedDays =
                              selectedAthletes[index].selectedDays;
                            selectedAthletes[index] = {
                              ...selectedAthletes[index],
                              selectedDays: [
                                ...selectedDays,
                                specificDates[idx],
                              ],
                            };
                            let temp = athlete_selecteddays;
                            temp[selectedAthletes[index].id] =
                              selectedAthletes[index].selectedDays;

                            setathlete_selecteddays(temp);
                            setSelectedAthletes([...selectedAthletes]);
                          }
                        }
                      }
                    }}
                    style={
                      athlete?.selectedDays?.includes(specificDates[idx])
                        ? {
                            backgroundColor: "#ffe486",
                            color: "#fff",
                            width: "85px",
                            height: "25px",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: "8px",
                            marginRight: "2px",
                            marginBottom: "5px",
                            padding: "5px",
                            cursor: "pointer",
                          }
                        : {
                            width: "85px",
                            height: "25px",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: "8px",
                            marginRight: "2px",
                            marginBottom: "5px",
                            padding: "5px",
                            cursor: "pointer",
                          }
                    }
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          lineHeight: "20px",
                          width: "80%",
                          textAlign: "center",
                          padding: "5px",
                          color:
                            new Date(specificDates[idx]) <
                            new Date(formatDate())
                              ? "grey"
                              : "black",
                        }}
                      >
                        {day}
                      </div>
                    </div>
                  </div>
                ))}

                <IconButton
                  style={{
                    marginLeft: "10%",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    var curr = new Date(currentStartWeek); // get current date
                    var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

                    var firstday = new Date(curr.setDate(first)).toUTCString();
                    var lastday = new Date(
                      curr.setDate(curr.getDate() + 6)
                    ).toUTCString();

                    setCurrentStartWeek(formatSpecificDate(firstday));
                    setCurrentEndWeek(formatSpecificDate(lastday));
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </div>

              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  lineHeight: "18px",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: "100%",
                  height: "25px",
                  marginLeft: "35px",
                  cursor: "pointer",
                }}
              >
                {specificDates?.map((tempDate, idx) => (
                  <div
                    style={{
                      width: "45px",
                      height: "30px",
                    }}
                    key={idx}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: "500",
                        lineHeight: "18px",
                        width: "100%",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                        paddingBottom: "5px",
                        textAlign: "center",
                        color:
                          new Date(specificDates[idx]) < new Date(formatDate())
                            ? "grey"
                            : "black",
                      }}
                    >
                      {formatSpecificDate1(tempDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="createNutrition__input">
        <h4>Nutrition Plan Name</h4>
        <input
          type="text"
          placeholder="Enter Nutrition Plan Name"
          value={nutritionName}
          onChange={(e) => {
            setNutritionName(e.target.value);
          }}
        />
      </div>
      <div className="coachAddMeal__form">
        <div className="athleteAddMeal__typeOfMeal">
          {entireFood?.map((item, idx) => (
            <div className="athleteAddMealfood__container">
              <FormControl className={classes.formControl}>
                <h4>Select the type of meal</h4>
                <Select
                  labelId="meal-select-label"
                  id="meal-select-label"
                  value={item.meal}
                  onChange={(e) => {
                    let temp = [...entireFood];
                    temp[idx].meal = e.target.value;
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
                  {/* {props.isLongTerm ? null : (
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
                  )} */}
                </div>
              ) : (
                <div className="coachAddMeal__textArea">
                  <h4 style={{ margin: 0, marginBottom: 10 }}>Description</h4>
                  <textarea
                    type="text"
                    placeholder="Enter Meal Description"
                    value={item.description}
                    readOnly={type === "view" ? true : false}
                    onChange={(e) => {
                      let temp = [...entireFood];
                      temp[idx].description = e.target.value;
                      setEntireFood(temp);
                    }}
                  />
                </div>
              )}
              <div className="coachAddMeal__textArea">
                <h4>Description</h4>
                <textarea
                  type="text"
                  placeholder="Enter Meal Description"
                  value={item.description}
                  onChange={(e) => {
                    let temp = [...entireFood];
                    temp[0].addFood = !addFood;
                    temp[idx].description = e.target.value;
                    setEntireFood(temp);
                    setAddFood(!addFood);
                  }}
                />
              </div>
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
                if (type === "view") {
                  history.goBack();
                } else {
                  if (type === "update") {
                    db.collection("Food")
                      .doc(nutritionId)
                      .update({
                        nutrition: {
                          nutritionName: nutritionName,
                          entireFood,
                        },
                        saved: false,
                      });
                    if (type === "update") {
                      history.goBack();
                    } else {
                      history.push("/post-add-screen");
                    }
                  } else {
                    let tempDate1 = [];
                    selectedAthletes.map((athlete) => {
                      athlete.selectedDays.map((d) => {
                        tempDate1.push(d);
                      });
                    });

                    if (
                      selectedAthletes &&
                      tempDate1.length > 0 &&
                      nutritionName
                    ) {
                      selectedAthletes.map((athlete, idx) => {
                        // sendPushNotification(
                        //   athlete.token,
                        //   "new Nutrition Plan assigned"
                        // );
                        console.log(plan);
                        db.collection("Food").add({
                          from_id: userData?.id,
                          assignedTo_id: athlete.id,
                          selectedDays: athlete.selectedDays,
                          nutrition: {
                            nutritionName: nutritionName,
                            entireFood,
                          },
                          saved: false,
                          selectedAthletes,
                          date: firebase.firestore.FieldValue.serverTimestamp(),
                          timestamp:
                            firebase.firestore.FieldValue.serverTimestamp(),
                        });
                      });

                      selectedAthletes.forEach((id) => {
                        db.collection("AthleteNotifications")
                          .doc(id.id)
                          .collection("notifications")
                          .add({
                            message: "New Nutrition plan assigned",
                            seen: false,
                            timestamp:
                              firebase.firestore.FieldValue.serverTimestamp(),
                            coach_id: userData.id,
                          });
                      });
                      history.push({
                        pathname: "/nutrition",
                      });
                    } else {
                      alert("Please select an athlete and assign a date");
                    }
                  }
                }
              }}
            >
              <h3>
                {" "}
                {type === "view"
                  ? "Return"
                  : type === "update"
                  ? "Update Plan"
                  : "Complete Nutrition"}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateNutrition;
