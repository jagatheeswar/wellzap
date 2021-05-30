import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
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

  const userData = useSelector(selectUserData);
  const [athletes, setAthletes] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [currentStartWeek, setCurrentStartWeek] = useState(null);
  const [currentEndWeek, setCurrentEndWeek] = useState(null);
  const [daysList, setDaysList] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  const [specificDates, setSpecificDates] = useState([]);
  const [type, setType] = useState("");
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

  return (
    <div className="createNutrition">
      <NutritionScreenHeader name="Create Nutrition" />
      <img src="/assets/nutrition.jpeg" alt="" />
      <div className="createNutrition__input">
        <h4>Nutrition Plan Name</h4>
        <input type="text" placeholder="Enter Nutrition Plan Name" />
      </div>

      <div>
        <div {...getRootProps()}>
          <Label {...getInputLabelProps()}>Search for Athletes</Label>
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

      <div>
        {selectedAthletes.map((athlete, index) => (
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
                backgroundColor: "#fcd54a",
                borderRadius: "10px",
                height: "45px",
                width: "49%",
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
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "10px",
                width: "45%",
              }}
            >
              <div
                style={{
                  marginLeft: "3%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50%",
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
                            setSelectedAthletes([...selectedAthletes]);
                          }
                        }
                      }
                    }}
                    style={
                      athlete?.selectedDays?.includes(specificDates[idx])
                        ? {
                            backgroundColor: "#fcd54a",
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
                          color: athlete?.selectedDays?.includes(
                            specificDates[idx]
                          )
                            ? "black"
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
                  marginLeft: "45px",
                  cursor: "pointer",
                }}
              >
                {specificDates?.map((tempDate, idx) => (
                  <div
                    style={{
                      width: "43px",
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
  );
}

export default CreateNutrition;
