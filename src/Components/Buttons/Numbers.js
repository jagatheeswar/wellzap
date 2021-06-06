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

function Numbers({ value, setValue, editable }) {
  const classes = useStyles();
  return (
    <div className="numbers">
      <FormControl className={classes.formControl}>
        <InputLabel id="meal-select-label">Number of times</InputLabel>
        <Select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          labelId="meal-select-label"
          id="meal-select-label"
          disabled={!editable}
        >
          <MenuItem value={"1"}>1</MenuItem>
          <MenuItem value={"2"}>2</MenuItem>
          <MenuItem value={"3"}>3</MenuItem>
          <MenuItem value={"4"}>4</MenuItem>
          <MenuItem value={"5"}>5</MenuItem>
          <MenuItem value={"6"}>6</MenuItem>
          <MenuItem value={"7"}>7</MenuItem>
          <MenuItem value={"8"}>8</MenuItem>
          <MenuItem value={"9"}>9</MenuItem>
          <MenuItem value={"10"}>10</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default Numbers;
