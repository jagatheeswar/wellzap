import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import {Typography, Avatar} from "@material-ui/core";
import { useHistory } from "react-router";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Pdf from "react-to-pdf"
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  inHeader: {
    minHeight: 130,
    backgroundColor: "#fcd54a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30
  },
  outHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "space-between"
  },
  button: {
    outline: "none",
    border: "none",
    backgroundColor: "#fcd54a",
    padding: "8px 30px",
    marginRight: 30,
    borderRadius: 10,
    fontWeight: "600",
    cursor: "pointer"
  }
}));

const ref = React.createRef();

function PrintPreview() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div style={{minHeight: "99.7vh"}}>
      <div className={classes.outHeader}>
        <div onClick={() => history.goBack()} style={{display: "flex", alignItems: "center",}}>
          <ArrowBackIosRoundedIcon style={{height: 18, width: 18, padding: 5, cursor: "pointer"}} />
          <Typography variant="h6" style={{fontSize: 25, marginLeft: 5}}>Print Preview</Typography>
        </div>
        <Pdf targetRef={ref} filename="history.pdf">
          {({toPdf}) => <button onClick={toPdf} className={classes.button}>Print</button>}
        </Pdf>
      </div>
      <div ref={ref}>
        <div className={classes.inHeader}>
          <div style={{display: "flex", alignItems: 'center', marginLeft: 30}}>
            <Typography variant="h6">30 Day Strength</Typography>
            <FiberManualRecordIcon style={{height: 8, width: 8, padding: "0px 20px", color: "#464646"}} />
            <Typography style={{color: "#464646"}}>Week 1</Typography>
          </div>
          <div style={{display: 'flex', flexDirection: "column", alignItems: 'center', marginRight: 30}}>
            <Avatar>A</Avatar>
            <Typography>Athlete Name</Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintPreview
