import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

export default function FormControlLabelPlacement({
  value,
  setValue,
  editable,
}) {
  return (
    <FormControl component="fieldset">
      <RadioGroup
        row
        aria-label="position"
        name="position"
        defaultValue="top"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        <FormControlLabel
          value="yes"
          control={<Radio color="primary" />}
          label="Yes"
          disabled={!editable}
        />
        <FormControlLabel
          value="no"
          control={<Radio color="primary" />}
          label="No"
          disabled={!editable}
        />
      </RadioGroup>
    </FormControl>
  );
}
