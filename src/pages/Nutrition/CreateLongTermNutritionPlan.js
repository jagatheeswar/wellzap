import React from 'react'
import NutritionScreenHeader from "./NutritionScreenHeader";
import {Dialog, DialogContent, Grid, Divider, DialogActions, FormControlLabel, Checkbox} from '@material-ui/core';
import {EventNoteOutlined, DashboardOutlined} from '@material-ui/icons';
import CoachAddMeal from './CoachAddMeal';
import ViewAllSavedNutrition from "./ViewAllSavedNutrition"
const CreateLongTermNutritionPlan = () => {
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
  const [selectedWeekNum, setSelectedWeekNum] = React.useState(1);
  const [selectedDay, setSelectedDay] = React.useState("monday");
 

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
  return (
    <div>
      <NutritionScreenHeader name="Create Long-Term Nutrition Plan" />
      <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20
      }}
      >
        <div>
          <img style={{objectFit: 'contain'}} src="/assets/left_arrow.png" alt="" width="15px" height="15px" />
          <img style={{objectFit: 'contain'}} src="/assets/left_arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
        <div style={{marginLeft: 20}}>
          <img style={{objectFit: 'contain'}} src="/assets/left_arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
        <div style={{width: 200, marginTop: -22, justifyContent: 'center', display: 'flex', alignItems: 'baseline'}}>
          <p>Week</p> {weeks.map((i) => <p style={{padding: 5}}>{i.weeknum}</p>)}
        </div>
        <div>
          <img style={{objectFit: 'contain'}} src="/assets/right__arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
        <div style={{marginLeft: 20}}>
          <img style={{objectFit: 'contain'}} src="/assets/right__arrow.png" alt="" width="15px" height="15px" />
          <img style={{objectFit: 'contain'}} src="/assets/right__arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
      </div>
      <div className="weeksContainer" style={{overflow: 'auto', width: '105vh', marginLeft: 20}}>
        <div className="eachWeek" style={{display: 'flex', flexDirection: 'row'}}>
          {weeks.length > 1 ?
        <div style={{ flexDirection: "column"}}>
          <p style={{marginTop:300,cursor:"pointer"}}><img style={{objectFit: 'contain'}} src="/assets/left_arrow.png" alt="" width="15px" height="15px" /></p>
        </div>:null}
          {weeks.map((index,idx) => (
            <div style={{flexDirection: 'column', margin: 10}}>
              <p>Week {index.weeknum}</p>
              <div style={{backgroundColor: '#fff', borderRadius: 15, padding: 1}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <p style={{marginLeft: 20}}>Nutrition Plan</p>
                  <p onClick={()=>{
                   //alert(idx)
                    var lweeks =[...weeks];
                    lweeks.splice(idx,1)
                    setWeeks(lweeks)
                  }} style={{marginRight:20,cursor:"pointer"}}>x</p>
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
          <div style={{flexDirection: 'column', margin: 10}}>
            <p style={{cursor:"pointer"}} onClick={handleClickOpenDialogCopy}>Copy</p>
            <div onClick={()=>{setWeeks([...weeks,{ weeknum: weeks.length + 1, days: {monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''}}])}} style={{ borderRadius: 15, margin: 15, cursor:"pointer",border: "1px dashed #727272",height: 100, width: 350, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <img style={{objectFit: 'contain'}} src="/assets/plus_thin.png" alt="" width="25px" height="25px" />{" "}
            </div>
          </div>
          {weeks.length > 1 ?
          <div style={{ flexDirection: "column"}}>
            <p style={{marginTop:300,cursor:"pointer"}}><img style={{objectFit: 'contain'}} src="/assets/right__arrow.png" alt="" width="15px" height="15px" /></p>
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
    </div>
  )
}

export default CreateLongTermNutritionPlan
