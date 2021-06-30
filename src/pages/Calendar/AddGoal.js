import React,{useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from '@material-ui/core/TextField';
import {withStyles,makeStyles} from '@material-ui/core/styles';
import { Calendar,utils  } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";

import {
    selectUser,
    selectUserData,
    selectUserType,
    setUserData,
  } from "../../features/userSlice";
  import { db } from "../../utils/firebase";
  import firebase from "firebase";
import moment from "moment";
import { PinDropSharp } from "@material-ui/icons";
moment.locale("en-in");      

const useStyles = makeStyles({
    root: {
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "black"
      },
      "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "black"
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black"
      },
      "& .MuiOutlinedInput-input": {
        color: "black"
      },
      "&:hover .MuiOutlinedInput-input": {
        color: "black"
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
        color: "black"
      },
      "& .MuiInputLabel-outlined": {
        color: "black"
      },
      "&:hover .MuiInputLabel-outlined": {
        color: "black"
      },
      "& .MuiInputLabel-outlined.Mui-focused": {
        color: "black"
      },
      width:"100%"
    }
  });



export default function AddGoal({route,setsidebarfunc}){
    const classes = useStyles();
  const [goalName,SetGoalName] = useState(null)
  const [description,SetDescription] = useState(null)
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const defaultValue = {
    year: 2021,
    month: 4,
    day: 5,
  };
  const [selectedDay, setSelectedDay] = useState(defaultValue);


  useEffect(()=>{
    let now = moment();
  
    let today_date = {
      year: now.get("year"),
      month: now.get("month") + 1,
      day: now.get("day"),
    };
  
    setSelectedDay(today_date);
  },[])



  const AddGoalHandler = async () => {
    if(goalName && description && selectedDay){
    var array = [];
    if (userData.data.goals) {
      array = [...userData.data.goals];
    }
    array.push({
      name: goalName,
      date: firebase.firestore.Timestamp.fromDate(new Date(moment([selectedDay.year, selectedDay.month - 1, selectedDay.day]))),
      description: description,
    });
    db.collection("athletes")
      .doc(userData.id)
      .update({ goals: array })
      .catch((err) => console.log(err));
    dispatch(
      setUserData({
        id: userData.id,
        data: { ...userData.data, goals: array },
      })
    );
    setsidebarfunc("goals");
    }else{
        alert("Please Enter all fields")
    }
  };


    return (
      <div
        style={{ flex: 1,width:"90%" }}
      >
          <TextField label="Goal Name" variant="outlined" 
              color="black"
              value={goalName}
              required
              onChange={event => {
                const { value } = event.target;
                SetGoalName(value)
              }}
              className={classes.root}
          />

          <p style={{ fontSize:18, marginTop: 20 }}>Goal Date *</p>   
          <Calendar
            value={selectedDay}
            onChange={setSelectedDay}
            colorPrimary="#fcd54a" // added this
            colorPrimaryLight="blue"
            calendarClassName="customcalendarAddGoal" // and this
            calendarTodayClassName="custom-today-day" // also this
            minimumDate={utils().getToday()}
        />
            <TextField label="Goal Description" variant="outlined" 
              color="black"
              value={description}
              required
              multiline
              rows={4}
              style={{marginTop:20}}
              className={classes.root}
              onChange={event => {
                const { value } = event.target;
                SetDescription(value)
              }}
          />
          <div
            onClick={() => AddGoalHandler()}
            style={{
              backgroundColor: "#fcd54a",
              borderRadius: 10,
              padding: 10,
              marginTop: 20,
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "black",
                alignSelf: "center",
                margin:0,
                padding:0,
                textAlign:"center",
                cursor:"pointer"
              }}
            >
              Add Goal
            </p>
          </div>
      </div>
    );
  
}
