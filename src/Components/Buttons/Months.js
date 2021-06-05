import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core";
import FormControlLabelPlacement from "../../Components/Buttons/YesNoButton";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function Months() {
  const classes = useStyles();
  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="meal-select-label">per</InputLabel>
        <Select labelId="meal-select-label" id="meal-select-label">
          <MenuItem value={"per"}>per</MenuItem>
          <MenuItem value={"day"}>day</MenuItem>
          <MenuItem value={"week"}>week</MenuItem>
          <MenuItem value={"month"}>month</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default Months;
