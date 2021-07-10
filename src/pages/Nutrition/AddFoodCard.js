import React, { useState, useEffect } from "react";
import { selectUserData } from "../../features/userSlice";
import { useSelector } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const AddFoodCard = (props) => {
  const classes = useStyles();
  const userData = useSelector(selectUserData);
  const [open, setOpen] = useState(props.item.foodName ? false : true);
  //const [entireFood, setEntireFood] = useState(props.entireFood);
  const [index, setIndex] = useState(props.index);
  const [item, setItem] = useState(props.item);
  const [idx, setIdx] = useState(props.idx);

  useEffect(() => {
    setIndex(props.index);
    setIdx(props.idx);
    setItem(props.item);
    console.log("s", props.item.foodName);
    setOpen(props.item.foodName ? false : true);
  }, [props.index, props.item, props.idx]);

  return (
    <div className="athleteFoodCard">
      {open ? (
        <div className="athleteFoodCard__open">
          <div>
            <div className="athleteFoodCard__openContainer">
              <h4>
                {props.type === "non-editable"
                  ? "Food Name"
                  : "Search Food Name"}
              </h4>
              {props.type !== "non-editable" && (
                <div
                  onClick={() => {
                    let temp = [...props.entireFood[index].food];
                    let temp1 = [...props.entireFood];
                    temp.splice(idx, 1);
                    temp1[index].food = temp;
                    props.setEntireFood(temp1);
                  }}
                >
                  {/* <Icon
              name="times"
              type="font-awesome-5"
              size={15}
            /> */}{" "}
                  <CloseOutlinedIcon style={{ cursor: "pointer" }} />
                </div>
              )}
            </div>
            {props.type === "non-editable" ? (
              <h4>{props.item.foodName}</h4>
            ) : (
              <div className="athleteAddMealfood__searchableDropdown">
                <Autocomplete
                  id="combo-box-demo"
                  options={props.serverData}
                  getOptionLabel={(option) => option.name}
                  style={{ width: 300 }}
                  inputValue={props.item.foodName}
                  onChange={(e, item) => {
                    let foodData = [...props.entireFood];
                    let temp = [...props.ent.food];
                    temp[idx].foodName = item.name;
                    temp[idx].proteins = item.protein * temp[idx].quantity || 0;
                    temp[idx].carbs = item.carbs * temp[idx].quantity || 0;
                    temp[idx].fat = item.fats * temp[idx].quantity || 0;
                    // temp[idx].fibre = item.fibres;
                    temp[idx].calories =
                      item.calories * temp[idx].quantity || 0;
                    temp[idx].foodDetails = item;
                    temp[idx].serving = "";
                    temp[idx].units = "";
                    temp[idx].quantity = 1;

                    foodData[index].food = temp;
                    props.setEntireFood(foodData);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Combo box"
                      onChange={({ target }) => {
                        let foodData = [...props.entireFood];
                        let temp = [...props.ent.food];
                        temp[idx].foodName = target.value;
                        foodData[index].food = temp;
                        props.setEntireFood(foodData);
                      }}
                      variant="outlined"
                    />
                  )}
                />
              </div>
            )}
          </div>

          <div className="quantity-servings__container">
            <div
              style={{
                alignItems: "flex-start",
              }}
            >
              <h4>
                {props.type === "non-editable" ? "Quantity" : "Enter Quantity"}
              </h4>
              <input
                className="foodCard__quantInput"
                value={String(props.item.quantity)}
                onChange={(e) => {
                  let foodData = [...props.entireFood];
                  let temp = [...props.ent.food];
                  if (e.target.value) {
                    temp[idx].quantity = parseFloat(e.target.value);
                  } else {
                    temp[idx].quantity = "";
                  }

                  if (temp[idx].units === props.item.foodDetails?.units) {
                    temp[idx].calories =
                      (temp[idx].quantity * temp[idx].foodDetails?.calories) /
                      temp[idx].foodDetails?.servings;
                    temp[idx].proteins =
                      (temp[idx].quantity * temp[idx].foodDetails?.protein) /
                      temp[idx].foodDetails?.servings;
                    temp[idx].carbs =
                      (temp[idx].quantity * temp[idx].foodDetails?.carbs) /
                      temp[idx].foodDetails?.servings;
                    temp[idx].fat =
                      (temp[idx].quantity * temp[idx].foodDetails?.fats) /
                      temp[idx].foodDetails?.servings;
                  } else if (
                    temp[idx].units === props.item.foodDetails?.units2
                  ) {
                    temp[idx].calories =
                      (temp[idx].quantity * temp[idx].foodDetails?.calories) /
                      temp[idx].foodDetails?.servings2;
                    temp[idx].proteins =
                      (temp[idx].quantity * temp[idx].foodDetails?.protein) /
                      temp[idx].foodDetails?.servings2;
                    temp[idx].carbs =
                      (temp[idx].quantity * temp[idx].foodDetails?.carbs) /
                      temp[idx].foodDetails?.servings2;
                    temp[idx].fat =
                      (temp[idx].quantity * temp[idx].foodDetails?.fats) /
                      temp[idx].foodDetails?.servings2;
                  } else {
                    temp[idx].proteins =
                      temp[idx].foodDetails?.protein *
                      (temp[idx].quantity || 0);
                    temp[idx].carbs =
                      temp[idx].foodDetails?.carbs * (temp[idx].quantity || 0);
                    temp[idx].fat =
                      temp[idx].foodDetails?.fats * (temp[idx].quantity || 0);
                    temp[idx].calories =
                      temp[idx].foodDetails?.calories *
                      (temp[idx].quantity || 0);
                  }
                  foodData[index].food = temp;
                  props.setEntireFood(foodData);
                }}
                placeholder={"Enter Quantity"}
                editable={props.type === "non-editable" ? false : true}
              />
            </div>
            <div className="foodCard__servingsInputContainer">
              <FormControl className={classes.formControl}>
                <InputLabel id="servings-select-label">
                  Select Servings
                </InputLabel>
                <Select
                  labelId="servings-select-label"
                  id="servings-select-label"
                  value={String(props.item.units)}
                  onChange={(e) => {
                    let foodData = [...props.entireFood];
                    let temp = [...props.ent.food];
                    temp[idx].units = e.target.value;
                    if (temp[idx].units === props.item.foodDetails?.units) {
                      temp[idx].calories =
                        (temp[idx].quantity * temp[idx].foodDetails?.calories) /
                        temp[idx].foodDetails?.servings;
                      temp[idx].proteins =
                        (temp[idx].quantity * temp[idx].foodDetails?.protein) /
                        temp[idx].foodDetails?.servings;
                      temp[idx].carbs =
                        (temp[idx].quantity * temp[idx].foodDetails?.carbs) /
                        temp[idx].foodDetails?.servings;
                      temp[idx].fat =
                        (temp[idx].quantity * temp[idx].foodDetails?.fats) /
                        temp[idx].foodDetails?.servings;
                    } else if (
                      temp[idx].units === props.item.foodDetails?.units2
                    ) {
                      temp[idx].calories =
                        (temp[idx].quantity * temp[idx].foodDetails?.calories) /
                        temp[idx].foodDetails?.servings2;
                      temp[idx].proteins =
                        (temp[idx].quantity * temp[idx].foodDetails?.protein) /
                        temp[idx].foodDetails?.servings2;
                      temp[idx].carbs =
                        (temp[idx].quantity * temp[idx].foodDetails?.carbs) /
                        temp[idx].foodDetails?.servings2;
                      temp[idx].fat =
                        (temp[idx].quantity * temp[idx].foodDetails?.fats) /
                        temp[idx].foodDetails?.servings2;
                    } else {
                      console.log("Nothing is selected");
                    }
                    foodData[index].food = temp;
                    props.setEntireFood(foodData);
                  }}
                >
                  {props.item?.foodDetails && (
                    <MenuItem value={props.item?.foodDetails?.units}>
                      {props.item?.foodDetails?.units}
                    </MenuItem>
                  )}
                  {props.item?.foodDetails && (
                    <MenuItem value={props.item?.foodDetails?.units2}>
                      {props.item?.foodDetails?.units2}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="foodCard__macroNutrients">
            <h4>Macro Nutrients</h4>
            <div className="foodCard__macroNutrientsContainer">
              <div className="foodCard__macroNutrient">
                <h4>Proteins</h4>
                <input
                  editable={false}
                  readOnly={true}
                  className="foodCard__macroNutrientsInput"
                  value={
                    item.proteins
                      ? String(Math.round(item.proteins * 10) / 10)
                      : String(0)
                  }
                  editable={false}
                />
                <h5 style={{ marginHorizontal: 5, color: "black" }}>g</h5>
              </div>
              <div className="foodCard__macroNutrient">
                <h4
                  style={{
                    width: 110,
                  }}
                >
                  Carbs
                </h4>
                <input
                  editable={false}
                  readOnly={true}
                  className="foodCard__macroNutrientsInput"
                  value={
                    item.carbs
                      ? String(Math.round(item.carbs * 10) / 10)
                      : String(0)
                  }
                  editable={false}
                />
                <h5 style={{ marginHorizontal: 5, color: "black" }}>g</h5>
              </div>
            </div>

            <div className="foodCard__macroNutrientsContainer">
              <div className="foodCard__macroNutrient">
                <h4>Fat</h4>
                <input
                  editable={false}
                  readOnly={true}
                  className="foodCard__macroNutrientsInput"
                  value={
                    item.fat
                      ? String(Math.round(item.fat * 10) / 10)
                      : String(0)
                  }
                  editable={false}
                />
                <h5 style={{ marginHorizontal: 5 }}>g</h5>
              </div>
              <div className="foodCard__caloriesContainer">
                <h4
                  style={{
                    width: 110,
                  }}
                >
                  Total Calories
                </h4>
                <input
                  editable={false}
                  readOnly={true}
                  style={{
                    width: 80,
                    marginRight: 5,
                  }}
                  className="foodCard__caloriesInput"
                  value={
                    item.calories
                      ? String(Math.round(item.calories * 10) / 10)
                      : String(0)
                  }
                  editable={false}
                />
                <h5 style={{ marginLeft: "5px" }}>kcal</h5>
              </div>
            </div>

            <CheckBoxOutlinedIcon
              onClick={() => {
                setOpen(false);
              }}
              style={{
                cursor: "pointer",
                marginLeft: "98%",
                height: "30px",
                width: "30px",
              }}
            />
          </div>

          <div
            className="foodCard__check"
            onClick={() => {
              if (item.foodName && item.foodName != "") {
                setOpen(false);
              } else {
                let temp = [...props.entireFood[index].food];
                let temp1 = [...props.entireFood];
                temp.splice(idx, 1);
                temp1[index].food = temp;
                props.setEntireFood(temp1);
              }
            }}
          >
            {" "}
            {/* <Icon
              name="check"
              type="font-awesome-5"
              size={20}
            /> */}
          </div>
        </div>
      ) : (
        <div
          className="foodCard__checkAlternative"
          style={{
            height: 30,

            backgroundColor: "white",
          }}
        >
          <div
            style={{
              display: "flex",

              width: "100%",
            }}
            onClick={() => setOpen(true)}
          >
            <div>{item.foodName}</div>
            {/* <Icon
              name="chevron-down"
              type="font-awesome-5"
              size={20}
            /> */}
            <div>
              {item.units === "Grams"
                ? item.quantity + " Grams"
                : item.quantity + " " + item.units}{" "}
              , Total Calories: {item.calories}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFoodCard;
