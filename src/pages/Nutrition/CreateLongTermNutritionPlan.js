import React ,{useEffect,useState} from 'react'
import NutritionScreenHeader from "./NutritionScreenHeader";
import {Dialog, DialogContent, Grid, Divider, DialogActions, FormControlLabel, Checkbox} from '@material-ui/core';
import {EventNoteOutlined, DashboardOutlined} from '@material-ui/icons';
import CoachAddMeal from './CoachAddMeal';
import ViewAllSavedNutrition from "./ViewAllSavedNutrition"
import { db } from "../../utils/firebase";
import { selectUserData } from "../../features/userSlice";
import { useSelector } from "react-redux";
import firebase from "firebase";
import Modal from "react-awesome-modal";
import styled from "styled-components";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Calendar,utils  } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import 'date-fns';


import moment from "moment"
const InputWrapper = styled("div")`
  width: 350px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 4%;

  &:hover {
    border-color: #40a9ff;
  }

  &.focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    font-size: 14px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`;

const Listbox = styled("ul")`
  width: 350px;
  margin: 2px 0 0;
  margin-left: 2.1%;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 150px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected="true"] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus="true"] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`;

const Tag = styled(({ label, onDelete, ...props }) => (
  <div {...props}>
    <span>{label}</span>
    <CloseIcon onClick={onDelete} />
  </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;

  line-height: 22px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`;

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
  margin-left: 4%;
  margin-top: 20px;
`;


const CreateLongTermNutritionPlan = () => {
  const userData = useSelector(selectUserData);
  const [weeks, setWeeks] = React.useState([
    { weeknum: 1, days: {monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''} }, 

    // { weeknum: 2, days: {monday: '', tuesday: ''} }, 
    // { weeknum: 3, days: {monday: '', tuesday: ''} }
  ]);

  const [checkBox, setCheckBox] = React.useState([
    {name: 'week2', checked: true},
    {name: 'week3', checked: true},
    {name: 'week4', checked: true},
    {name: 'week5', checked: true},
  ])

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogCopy, setOpenDialogCopy] = React.useState(false);
  const [openCreateNutrition, setOpenCreateNutrition] = React.useState(false);
  const [openSavedNutrition, setOpenSavedNutrition] = React.useState(false);
  const [openAssignNutrition, setOpenAssignNutrition] = React.useState(true);
  const [selectedWeekNum, setSelectedWeekNum] = React.useState(1);
  const [selectedDay, setSelectedDay] = React.useState("monday");
  const [modal, setModal] = React.useState(false);
  const [modal1, setModal1] = React.useState(false);
  const [selectedAthletes, setSelectedAthletes] = React.useState([]);
  const [athletes, setAthletes] = useState([]);
  const [weekIndex, setWeekIndex] = useState(0);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const defaultValue = {
    year: 2021,
    month: 4,
    day: 5,
  };
  const [selectedDate, setSelectedDate] = useState(defaultValue);
  const [disabledDays,setDisabledDays] = useState({
    year:2021,
    month:0,day:0
  })


  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    multiple: true,
    options: athletes,
    getOptionLabel: (option) => option.name,
  });

  useEffect(() => {
    if (userData?.id) {
      const data = [];
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((athlete) => {
            if (userData?.data.listOfAthletes.includes(athlete.id)) {
              let currentID = athlete.id;
              let appObj = { ...athlete.data(), ["id"]: currentID };
              data.push(appObj);
            }
          });
          setAthletes(data);
        });
    }
  }, [userData?.id]);

  useEffect(() => {
    value.map((v) => {
      v.selectedDays = [];
    });
    setSelectedAthletes(value);
  }, [value]);
 
  useEffect(()=>{
    let now = moment();
  
    let today_date = {
      year: now.get("year"),
      month: now.get("month") + 1,
      day: now.get("day"),
    };
    console.log(today_date)

    setSelectedDate(today_date);
    var temp = [];
    for(var i=0;i<90;i++){
      if(moment(new Date()).add(i + 1,"days").isoWeekday() != 1 ){
        temp.push({
          year:moment(new Date()).add(i + 1,"days").get("year"),
          month:moment(new Date()).add(i + 1,"days").get("month") + 1,
          day:moment(new Date()).add(i + 1,"days").get("date")
        })
        //console.log(moment(new Date()).add(i + 1,"days").get("day"))
      }
    }
    setDisabledDays(temp)
    const dayINeed = 1;
    const today = moment().isoWeekday();

    if (today <= dayINeed) { 
      //alert(moment().isoWeekday(dayINeed));
    } else {
      //alert(moment().add(1, 'weeks').isoWeekday(dayINeed))
    }
  },[])

  useEffect(()=>{
    if(weeks.length <= 1){
      setSelectedWeeks(weeks)
    }else{
      if(weeks.length >= weekIndex + 1){
        setSelectedWeeks(weeks.slice(weekIndex,weekIndex + 2))
      }
    }
  },[weekIndex,weeks])

  const handleClickOpenDialog = (week,day) => {
    setOpenDialog(true);
    setSelectedWeekNum(week);
    setSelectedDay(day)
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickOpenDialogCopy = () => {
    setOpenDialogCopy(true);
  };

  const handleCloseDialogCopy = () => {
    setOpenDialogCopy(false);
  };

  const handleCloseNutrition = () =>{
    setOpenCreateNutrition(false);
    setOpenSavedNutrition(false)
  }


  const handleChange = (event) => {
    setCheckBox({ ...checkBox, [event.target.name]: event.target.checked });
  };

  const saveLongTermMeal = () =>{
    setModal(true)
    /*
    db.collection("longTermMeal").add({
      weeks,
      completed:false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      assigned_to:[],
      assigned_by:userData?.id,
    })
    */
  }
  return (
    <div>
      <NutritionScreenHeader name="Create Long-Term Nutrition Plan" />
      <div style={{justifyContent:"flex-end",alignItems:"flex-end",width:"100%",display:"flex"}}>
      <div
          style={{
            backgroundColor:"#fcd13f",
            borderRadius:20,
            cursor: "pointer",
            padding:10,
            width:170,
            marginRight:20
          }}
          onClick={saveLongTermMeal}
        >
          <h5 style={{padding:0,margin:0,textAlign:"center"}}>SAVE LONG TERM MEAL</h5>
        </div>
      </div>

      <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20
      }}
      >
        <div onClick={()=>setWeekIndex(0)} style={{cursor:"pointer"}}>
          <img style={{objectFit: 'contain'}} src="/assets/left_arrow.png" alt="" width="15px" height="15px" />
          <img style={{objectFit: 'contain'}} src="/assets/left_arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
        <div onClick={()=>weekIndex >= 1 ? setWeekIndex(weekIndex - 1) : null} style={{marginLeft: 20,cursor:"pointer"}}>
          <img style={{objectFit: 'contain'}} src="/assets/left_arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
        <div style={{width: 200, marginTop: -22, justifyContent: 'center', display: 'flex', alignItems: 'baseline'}}>
          <p>Week</p> {weeks.map((i) => <p style={{padding: 5}}>{i.weeknum}</p>)}
        </div>
        <div style={{cursor:"pointer"}} onClick={()=>weeks.length == weekIndex + 1 ? null:setWeekIndex(weekIndex + 1)}>
          <img style={{objectFit: 'contain'}} src="/assets/right__arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
        <div onClick={()=>setWeekIndex(weeks.length - 1)} style={{marginLeft: 20,cursor:"pointer"}}>
          <img style={{objectFit: 'contain'}} src="/assets/right__arrow.png" alt="" width="15px" height="15px" />
          <img style={{objectFit: 'contain'}} src="/assets/right__arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
      </div>
      <div className="weeksContainer" style={{overflow: 'auto', width: '115vh', marginLeft: 20}}>
        <div className="eachWeek" style={{display: 'flex', flexDirection: 'row',justifyContent:"space-between"}}>
          {selectedWeeks.map((index,idx) => (
            <div style={{flexDirection: 'column',width:"48%",marginLeft:20}}>
              <p>Week {index.weeknum}</p>
              <div style={{backgroundColor: '#fff', borderRadius: 15, padding: 1}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <p style={{marginLeft: 20}}>Nutrition Plan</p>
                  {/*
                  <p onClick={()=>{
                   //alert(idx)
                   setWeekIndex(0)
                    var lweeks =[...weeks];
                    lweeks.splice(idx,1)
                    setWeeks(lweeks)
                  }} style={{marginRight:20,cursor:"pointer"}}>x</p>*/}
                </div>
                <div  style={{height: 130,cursor:"pointer",width: 350, margin: 15, border: "1px solid #727272",alignItems:"center",borderRadius: 15, flexDirection: 'column'}}>
                  {index.days.monday == "" ? 
                  <div onClick={()=>handleClickOpenDialog(index.weeknum,"monday")} style={{justifyContent:"center",height:"100%",display:"flex"}}><p style={{margin:0,textAlign:"center",justifyContent:"center",alignSelf:"center"}}>MONDAY</p></div>
                  :
                  <>
                  <p style={{marginLeft: 10, marginTop: 2, marginBottom: 4}}>MONDAY</p>
                  <Grid container>
                  <Grid item xs={4}>
                    <img
                      src="/assets/illustration.jpeg"
                      alt=""
                      width="80px"
                      height="80px"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>{index.days.monday.nutrition.nutritionName}</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                  </>}
                </div>
                <div  style={{height: 130,cursor:"pointer",width: 350, margin: 15, border: "1px solid #727272",alignItems:"center",borderRadius: 15, flexDirection: 'column'}}>
                  {index.days.tuesday == "" ? 
                  <div onClick={()=>handleClickOpenDialog(index.weeknum,"tuesday")} style={{justifyContent:"center",height:"100%",display:"flex"}}><p style={{margin:0,textAlign:"center",justifyContent:"center",alignSelf:"center"}}>TUESDAY</p></div>
                  :
                  <>
                  <p style={{marginLeft: 10, marginTop: 2, marginBottom: 4}}>TUESDAY</p>
                  <Grid container>
                  <Grid item xs={4}>
                    <img
                      src="/assets/illustration.jpeg"
                      alt=""
                      width="80px"
                      height="80px"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>{index.days.tuesday.nutrition.nutritionName}</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                  </>}
                </div>
                <div  style={{height: 130,cursor:"pointer",width: 350, margin: 15, border: "1px solid #727272",alignItems:"center",borderRadius: 15, flexDirection: 'column'}}>
                  {index.days.wednesday == "" ? 
                  <div onClick={()=>handleClickOpenDialog(index.weeknum,"wednesday")} style={{justifyContent:"center",height:"100%",display:"flex"}}><p style={{margin:0,textAlign:"center",justifyContent:"center",alignSelf:"center"}}>WEDNESDAY</p></div>
                  :
                  <>
                  <p style={{marginLeft: 10, marginTop: 2, marginBottom: 4}}>WEDNESDAY</p>
                  <Grid container>
                  <Grid item xs={4}>
                    <img
                      src="/assets/illustration.jpeg"
                      alt=""
                      width="80px"
                      height="80px"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>{index.days.wednesday.nutrition.nutritionName}</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                  </>}
                </div>
                <div  style={{height: 130,cursor:"pointer",width: 350, margin: 15, border: "1px solid #727272",alignItems:"center",borderRadius: 15, flexDirection: 'column'}}>
                  {index.days.thursday == "" ? 
                  <div onClick={()=>handleClickOpenDialog(index.weeknum,"thursday")} style={{justifyContent:"center",height:"100%",display:"flex"}}><p style={{margin:0,textAlign:"center",justifyContent:"center",alignSelf:"center"}}>THURSDAY</p></div>
                  :
                  <>
                  <p style={{marginLeft: 10, marginTop: 2, marginBottom: 4}}>THURSDAY</p>
                  <Grid container>
                  <Grid item xs={4}>
                    <img
                      src="/assets/illustration.jpeg"
                      alt=""
                      width="80px"
                      height="80px"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>{index.days.thursday.nutrition.nutritionName}</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                  </>}
                </div>
                <div  style={{height: 130,cursor:"pointer",width: 350, margin: 15, border: "1px solid #727272",alignItems:"center",borderRadius: 15, flexDirection: 'column'}}>
                  {index.days.friday == "" ? 
                  <div onClick={()=>handleClickOpenDialog(index.weeknum,"friday")} style={{justifyContent:"center",height:"100%",display:"flex"}}><p style={{margin:0,textAlign:"center",justifyContent:"center",alignSelf:"center"}}>FRIDAY</p></div>
                  :
                  <>
                  <p style={{marginLeft: 10, marginTop: 2, marginBottom: 4}}>FRIDAY</p>
                  <Grid container>
                  <Grid item xs={4}>
                    <img
                      src="/assets/illustration.jpeg"
                      alt=""
                      width="80px"
                      height="80px"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>{index.days.friday.nutrition.nutritionName}</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                  </>}
                </div>
                <div  style={{height: 130,cursor:"pointer",width: 350, margin: 15, border: "1px solid #727272",alignItems:"center",borderRadius: 15, flexDirection: 'column'}}>
                  {index.days.saturday == "" ? 
                  <div onClick={()=>handleClickOpenDialog(index.weeknum,"saturday")} style={{justifyContent:"center",height:"100%",display:"flex"}}><p style={{margin:0,textAlign:"center",justifyContent:"center",alignSelf:"center"}}>SATURDAY</p></div>
                  :
                  <>
                  <p style={{marginLeft: 10, marginTop: 2, marginBottom: 4}}>SATURDAY</p>
                  <Grid container>
                  <Grid item xs={4}>
                    <img
                      src="/assets/illustration.jpeg"
                      alt=""
                      width="80px"
                      height="80px"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>{index.days.saturday.nutrition.nutritionName}</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                  </>}
                </div>
                <div  style={{height: 130,cursor:"pointer",width: 350, margin: 15, border: "1px solid #727272",alignItems:"center",borderRadius: 15, flexDirection: 'column'}}>
                  {index.days.sunday == "" ? 
                  <div onClick={()=>handleClickOpenDialog(index.weeknum,"sunday")} style={{justifyContent:"center",height:"100%",display:"flex"}}><p style={{margin:0,textAlign:"center",justifyContent:"center",alignSelf:"center"}}>SUNDAY</p></div>
                  :
                  <>
                  <p style={{marginLeft: 10, marginTop: 2, marginBottom: 4}}>SUNDAY</p>
                  <Grid container>
                  <Grid item xs={4}>
                    <img
                      src="/assets/illustration.jpeg"
                      alt=""
                      width="80px"
                      height="80px"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>{index.days.sunday.nutrition.nutritionName}</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                  </>}
                </div>
              </div>
            </div>
          ))}
          {weeks.length <= 1 || weeks.length == weekIndex + 1 ?
          <div style={{flexDirection: 'column',width:"48%",padding:10,marginLeft:20}}>
            <p style={{cursor:"pointer"}} onClick={handleClickOpenDialogCopy}>Copy</p>
            <div onClick={()=>{setWeeks([...weeks,{ weeknum: weeks.length + 1, days: {monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''}}])}} style={{ borderRadius: 15, margin: 15, cursor:"pointer",border: "1px dashed #727272",height: 100, width: 350, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <img style={{objectFit: 'contain'}} src="/assets/plus_thin.png" alt="" width="25px" height="25px" />{" "}
            </div>
          </div>:null}
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid container style={{height: 300, width: 500, display: 'flex', alignItems: 'center'}}>
            <Grid item xs={6}>
              <div onClick={()=>{setOpenCreateNutrition(true); handleCloseDialog()}} style={{display: 'flex', flexDirection: 'column', alignItems: 'center',cursor:"pointer"}}>
                <EventNoteOutlined style={{backgroundColor: "#fcd13f", padding: 20, borderRadius: "50%"}} />
                <p>Create New Nutrition</p>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div onClick={()=>{setOpenSavedNutrition(true); handleCloseDialog(); }} style={{display: 'flex', flexDirection: 'column', alignItems: 'center',cursor:"pointer"}}>
                <DashboardOutlined style={{backgroundColor: "#fcd13f", padding: 20, borderRadius: "50%"}} />
                <p>Add From Saved Meals</p>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openDialogCopy}
        onClose={handleCloseDialogCopy}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid container style={{height: 450, width: "90vh", display: 'flex', padding: 20}}>
            <Grid item xs={4}>
              <p>Copy selected week to:</p>
            </Grid>
            <Divider orientation="vertical" />
            <Grid item xs={6}>
              {checkBox.map((index) => (
                <div  style={{flexDirection: 'column', marginLeft: 20}}>
                <FormControlLabel
                control={<Checkbox name={index.name} />}
                label={index.name}
                />
                </div>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <button style={{backgroundColor: '#fcd13f', border: 'none', outline: 'none', padding: "10px 30px", borderRadius: 25, fontSize: 16, fontWeight: '600'}}>Confirm</button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCreateNutrition}
        onClose={handleCloseNutrition}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <CoachAddMeal isLongTerm={true} handleCloseNutrition={handleCloseNutrition} setWeeks={setWeeks} weeks={weeks} selectedWeekNum={selectedWeekNum} selectedDay={selectedDay}  />
        </DialogContent>
      </Dialog>
      <Dialog
        open={openSavedNutrition}
        onClose={handleCloseNutrition}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <ViewAllSavedNutrition isLongTerm={true} handleCloseNutrition={handleCloseNutrition} setWeeks={setWeeks} weeks={weeks} selectedWeekNum={selectedWeekNum} selectedDay={selectedDay}  />
        </DialogContent>
      </Dialog>
      <Modal
        visible={modal}
        width="80%"
        height="300"
        effect="fadeInUp"
        onClickaway={() => setModal(false)}
      >
        <div className="createWorkout__modal">
          <h3>Do you want to save the meal?</h3>
          <div className="createWorkout__modalButtons">
            <div
              className="createWorkout__modalButton"
              onClick={() => {
                setModal(false);
                setModal1(true);
              }}
            >
              DON'T SAVE
            </div>
            <div
              className="createWorkout__modalButton"
              onClick={() => {
              db.collection("longTermMeal").add({
                weeks,
                completed:false,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                assigned_to:[],
                assigned_by:userData?.id,
                })
                setModal(false);
                setModal1(true);
              }}
            >
              SAVE
            </div>
          </div>
          <div
            className="createWorkout__modalButton"
            onClick={() => setModal(false)}
          >
            RETURN
          </div>
        </div>
      </Modal>
      <Modal
        visible={modal1}
        width="80%"
        height="350"
        effect="fadeInUp"
        onClickaway={() => setModal(false)}
      >
        <div className="createWorkout__modal">
          <h3>Would you like to assign this meal to your athletes?</h3>
          <h4>You can complete this step later from the meal screen</h4>
          <div className="createWorkout__modalButtons">
            <div
              className="createWorkout__modalButton"
              onClick={() => {
                setModal1(false);
              }}
            >
              NO
            </div>
            <div
              className="createWorkout__modalButton"
              onClick={() => {
                setModal1(false);
                setOpenAssignNutrition(true)
              }}
            >
              YES
            </div>
          </div>
          <div
            className="createWorkout__modalButton"
            onClick={() => setModal1(false)}
          >
            RETURN
          </div>
        </div>
      </Modal>
      <Dialog
        open={openAssignNutrition}
        onClose={()=>setOpenAssignNutrition(false)}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
        <div style={{width:600,height:500}}>
        <div style={{marginBottom:20}} {...getRootProps()}>
          <Label {...getInputLabelProps()}>Search for Athletes</Label>
          <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
            {value.map((option, index) => (
              <Tag label={option.name} {...getTagProps({ index })} />
            ))}

            <input {...getInputProps()} />
          </InputWrapper>
        </div>
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <li {...getOptionProps({ option, index })}>
                <span>{option.name}</span>
                <CheckIcon fontSize="small" />
              </li>
            ))}
          </Listbox>
        ) : null}
              {/*
              <FormControl style={{width:"60%",marginTop:40,marginLeft:25}}>
                <p style={{marginBottom:10}}>
                  Select the Meal start date
                </p>
                <Select
                  labelId="meal-select-label"
                  id="meal-select-label"
                  value={"gagan"}
                  onChange={(e) => {
                    //temp[idx].meal = e.target.value;
                    //setPlan(temp);
                  }}
                >
                  <MenuItem value={"Breakfast"}>Breakfast</MenuItem>
                  <MenuItem value={"Lunch"}>Lunch</MenuItem>
                  <MenuItem value={"Snack"}>Snack</MenuItem>
                  <MenuItem value={"Pre Workout"}>Pre Workout</MenuItem>
                  <MenuItem value={"Post Workout"}>Post Workout</MenuItem>
                  <MenuItem value={"Dinner"}>Dinner</MenuItem>
                </Select>
                </FormControl>*/}
                <div style={{marginLeft:25}}>
                <p>Select Start Date</p>
                <Calendar
                  value={selectedDate}
                  onChange={setSelectedDate}
                  colorPrimary="#fcd54a" // added this
                  colorPrimaryLight="blue"
                  calendarClassName="customcalendarScreen" // and this
                  calendarTodayClassName="custom-today-day" // also this
                  minimumDate={utils().getToday()}
                  maximumDate={{year:2021,month:9,day:17}}
                  disabledDays={disabledDays} 
                />
                </div>
      </div>

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateLongTermNutritionPlan
