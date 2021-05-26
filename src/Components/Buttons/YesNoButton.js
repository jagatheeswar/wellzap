import React from 'react'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';





export default function FormControlLabelPlacement() {
           return (
             <FormControl component="fieldset">
                <RadioGroup row aria-label="position" name="position" defaultValue="top">
               <FormControlLabel value="Yes" control={<Radio color="primary" />} label="Yes" />
               <FormControlLabel value="No" control={<Radio color="primary" />} label="No" />
               </RadioGroup>
             </FormControl>
           );
         }
         