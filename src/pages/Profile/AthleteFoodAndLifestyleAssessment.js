import React from "react";
import Header from "../../Components/Header/Header";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core";
import FormControlLabelPlacement from "../../Components/Buttons/YesNoButton";
import Months from "../../Components/Buttons/Months";
import Numbers from "../../Components/Buttons/Numbers";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function AthleteFoodAndLifestyleAssessment() {
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
            <Select labelId="meal-select-label" id="meal-select-label">
              <MenuItem value={"Veg"}>Veg</MenuItem>
              <MenuItem value={"Non-Veg"}>Non-Veg</MenuItem>
              <MenuItem value={"Eggitarian"}>Eggitarian</MenuItem>
              <MenuItem value={"Pescetarian(Fish)"}>Pescetarian(Fish)</MenuItem>
              <MenuItem value={"Jain Food"}>Jain Food</MenuItem>
            </Select>
          </FormControl>
          <div className="athleteFoodAndLifestyleAssessment__smokeContent">
            <h4>Do you smoke?</h4>
            <FormControlLabelPlacement />
            <h4>Select frequency</h4>
            <div className="smokeContentFrequency">
              <Numbers />
              <Months />
            </div>
          </div>
          <div className="athleteFoodAndLifestyleAssessment__alcoholContent">
            <h4>Do you consume alcohol?</h4>
            <FormControlLabelPlacement />
            <div className="alcoholConsumptionFrequency">
              <Numbers />
              <Months />
            </div>
          </div>
          <div className="athleteFoodAndLifestyleAssessment__eatingContent">
            <h4>How frequently do you eat outside?</h4>
            <FormControlLabelPlacement />
            <div className="eatingFrequency">
              <Numbers />
              <Months />
            </div>
          </div>
          <div className="athleteFoodAndLifestyleAssessment__foodContent">
            <h4>What do you preferred cuisine?</h4>
            <input type="text" placeholder="Type your preferred cuisine" />
            <h4>What is your favourite dish?</h4>
            <input type="text" placeholder="Please specify" />
            <h4>Do you have any dishes you dislike?</h4>
            <input type="text" placeholder="Please specify" />
            <h4>Do you have allergies?</h4>
            <FormControlLabelPlacement />
            <h4>Please specify</h4>
            <input type="text" placeholder="Type your allergies" />
            <h4>Do you fast?</h4>
            <FormControlLabelPlacement />
          </div>
          <div className="athleteFoodAndLifestyleAssessment__completeForm">
            Complete Form
          </div>
        </div>
      </div>
    </div>
  );
}

export default AthleteFoodAndLifestyleAssessment;
