import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function CheckboxesGroup() {
  const classes = useStyles();
//   const [state, setState] = React.useState({
//         Ankle: true
//    });

//   const handleChange = (event) => {
//     setState({ ...state, [event.target.name]: event.target.checked });
//   };

//   const { gilad, jason, antoine } = state;
//   const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox  name="Ankle" />}
            label="Ankle"
          />
          <FormControlLabel
            control={<Checkbox   name="Hip" />}
            label="Hip"
          />
          <FormControlLabel
            control={<Checkbox   name="Knee" />}
            label="Knee"
          />
          <FormControlLabel
          control={<Checkbox   name="Back" />}
          label="Back"
        />
        <FormControlLabel
          control={<Checkbox   name="Shoulders" />}
          label="Shoulders"
        />
        <FormControlLabel
          control={<Checkbox  name="Other" />}
          label="Other"
        />
        </FormGroup>
      </FormControl>
    </div>
  );
}

