import React,{useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from '@material-ui/core/TextField';
import {withStyles,makeStyles} from '@material-ui/core/styles';
import { Calendar,utils  } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import 'date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import SearchableDropdown from "./SearchableDropdown";


import {
    selectUser,
    selectUserData,
    selectUserType,
    setUserData,
  } from "../../features/userSlice";
  import { db } from "../../utils/firebase";
  import firebase from "firebase";
import moment from "moment";

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



export default function CreateEvent(props){
    const classes = useStyles();
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const defaultValue = {
    year: 2021,
    month: 4,
    day: 5,
  };
  const [selectedDay, setSelectedDay] = useState(defaultValue);

  const [athletes, setAthletes] = useState([]);
  const [eventName, setEventName] = useState(null);
  const [description, setDescription] = useState(null);
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState("17:00");
  const [showVideoLink, setShowVideoLink] = useState(false);
  const [selectedAthletes, setSelectedAthletes] = useState([]);


  useState(() => {
    if (userData?.id ) {
      const data = [];
      var temp= [];
      db.collection("athletes")
      .orderBy("name", "asc")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach((athlete) => {
          if(userData?.data.listOfAthletes.includes(athlete.id)){
            let currentID = athlete.id;
            let appObj = { ...athlete.data(), ["id"]: currentID };
            data.push(appObj);
          }
          if(props.athletes && props.athletes.length>0 && props.athletes.includes(athlete.id)){
            temp.push({ ...athlete.data(), ["id"]: athlete.id })
          }
        })
        if(temp.length>0){
          setSelectedAthletes(temp)
          console.log(temp)
        }
        setAthletes(data);
      })
    }
  }, [userData?.id]);

  useEffect(()=>{
    if(props.id && athletes.length>0){
      setDescription(props.data[props.id].description)
      setEventName(props.data[props.id].eventName)
      let now = moment((new Date(props.data[props.id].eventDate)));
      let today_date = {
        year: now.get("year"),
        month: now.get("month") + 1,
        day: now.get("day"),
      };
      setSelectedDay(today_date);
      setEventTime(moment(new Date(props.data[props.id].eventDate)).format("HH:mm"))
      setShowVideoLink(props.data[props.id].showVideoLink)
    }
  },[props?.id,athletes])



  const handler = async () => {

    
    if (eventName && selectedAthletes != []) {
      var local_athletes = [];
      var local_token = [];
      selectedAthletes.forEach((id)=>{
        local_athletes.push(id.id)
        if(id?.token && id.token != ""){
          local_token.push(id?.token)
        }
      })

      if(props?.id){
        db.collection("events").doc(props.data[props.id].id)
          .update({
            eventName,
            date:firebase.firestore.Timestamp.fromDate(new Date(selectedDay.year,selectedDay.month - 1,selectedDay.day, eventTime.substring(0,2),eventTime.substring(3,5),0,0)),
            description,
            athletes:local_athletes,
            coachID:userData.id,
            showVideoLink,
            videolink:userData?.data?.videolink,
          })
      }else{
        const newCityRef = db.collection("events").doc();
        const res = await newCityRef.set({
          name:eventName,
          date:firebase.firestore.Timestamp.fromDate(new Date(selectedDay.year,selectedDay.month - 1,selectedDay.day, eventTime.substring(0,2),eventTime.substring(3,5),0,0)),
          description:description,
          athletes:local_athletes,
          coachID:userData.id,
          showVideoLink:showVideoLink,
          videolink:userData?.data?.videolink,
        });
        props.setsidebarfunc();
        alert("Event Added");
        setEventName(null)
        setEventTime("17:30")
        setAthletes([])
        setDescription(null)

      }
    } else {
      alert("Pls enter all fields");
    }
    
  };


  useEffect(()=>{
    let now = moment();
    let today_date = {
      year: now.get("year"),
      month: now.get("month") + 1,
      day: now.get("day"),
    };
    setSelectedDay(today_date);
  },[])


    return (
      <div
        style={{ flex: 1,width:"90%" }}
      >
          <p>{props?.id ? "Edit Event" : "Create Event"}</p>
          <TextField label="Event Name" variant="outlined" 
              color="black"
              value={eventName}
              required
              onChange={event => {
                const { value } = event.target;
                setEventName(value)
              }}
              className={classes.root}
          />

          <p style={{ fontSize:18, marginTop: 20 }}>Event Date *</p>   
          <Calendar
            value={selectedDay}
            onChange={setSelectedDay}
            colorPrimary="#fcd54a" // added this
            colorPrimaryLight="blue"
            calendarClassName="customcalendarAddGoal" // and this
            minimumDate={utils().getToday()}
        />
            <TextField
                id="time"
                label="Select Time"
                type="time"
                defaultValue="07:30"
                style={{width:"100%"}}
                inputProps={{
                    step: 300, // 5 min
                }}
                value={eventTime}
                onChange={event => {
                    const { value } = event.target;
                    setEventTime(value)
                  }}
            />

            
            <div style={{marginTop:20,width:"100%"}}>
            <SearchableDropdown
            name="Select Athletes"
            list={athletes}
            state={selectedAthletes}
            setState={setSelectedAthletes}
          />
            </div>


            <TextField label="Event Description" variant="outlined" 
              color="black"
              value={description}
              required
              multiline
              rows={4}
              style={{marginTop:20}}
              className={classes.root}
              onChange={event => {
                const { value } = event.target;
                setDescription(value)
              }}
          />
            <button
            onClick={() => setShowVideoLink(!showVideoLink)}
            style={{
              borderRadius: 5,
              marginTop: 20,
              alignItems:"center",
              borderWidth:1,
              borderColor:"black",
              padding:10,
              width:"100%",
              backgroundColor:"white",
              cursor:"pointer"
            }}
          >
            <p
              style={{
                fontSize: 18,
                color: "black",
                textAlign:"center",
                margin:0,
                padding:0
              }}
            >
             {!showVideoLink ? "Add Video Conferencing" : "Remove Video Conferencing"}
            </p>
          </button>
          {showVideoLink ?
            <div
            onClick={() => {}}
            style={{marginTop:0}}
          >
            <p
              style={{
                fontSize:16,
                color: "#006D77",
                margin:0,
                padding:0
              }}
            >
              https://meet.jit.si/wellzap-{userData.data.pin}
            </p>
          </div>
          :null}


          <div
            onClick={() => handler()}
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
              {props?.id ? "Edit Event" :"Add Event"}
            </p>
          </div>
      </div>
    );
  
}
