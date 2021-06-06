import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
    height: "30px",
    width: "200px",
  },
}));

export default function CheckboxesGroups({
  label1,
  label2,
  state,
  setState,
  editable,
}) {
  const classes = useStyles();
  const [label1state, setLabel1state] = useState(false);
  const [label2state, setLabel2state] = useState(false);

  useEffect(() => {
    if (state) {
      if (label1 && state.includes(label1)) {
        setLabel1state(true);
      }

      if (label2 && state.includes(label2)) {
        setLabel2state(true);
      }
    }
  }, [state]);

  const handleChange = (event) => {
    setState([...state, event.target.name]);
  };

  return (
    <div className={classes.root}>
      <FormControl
        component="fieldset"
        className={classes.formControl}
        onChange={handleChange}
      >
        <FormGroup>
          <FormControlLabel
            checked={label1state}
            control={<Checkbox />}
            label={label1}
            name={label1}
            disabled={!editable}
          />
          <FormControlLabel
            checked={label2state}
            control={<Checkbox />}
            label={label2}
            name={label2}
            disabled={!editable}
          />
        </FormGroup>
      </FormControl>
    </div>
  );
}
