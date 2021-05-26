import React from 'react'
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
      height: "30px",
      width: "200px",
     
    },
  }));
  
  export default function CheckboxesGroup({ label }) {
    const classes = useStyles();
  
  
    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label={label}
          />
          </FormGroup>
        </FormControl>
      </div>
    );
  }
  
  
