import React from 'react'
import WorkoutScreenHeader from "./WorkoutScreenHeader";
import {Dialog, DialogContent, Grid, Divider, DialogActions, FormControlLabel, Checkbox} from '@material-ui/core';
import {EventNoteOutlined, DashboardOutlined} from '@material-ui/icons';

const CreateLongTermTrainingPlan = () => {
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

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
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

  const handleChange = (event) => {
    setCheckBox({ ...checkBox, [event.target.name]: event.target.checked });
  };
  return (
    <div>
      <WorkoutScreenHeader name="Create Long-Term Training Plan" />
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
          {weeks.map((index) => (
            <div style={{flexDirection: 'column', margin: 10}}>
              <p>Week {index.weeknum}</p>
              <div style={{backgroundColor: '#fff', borderRadius: 15, padding: 1}}>
                <p style={{marginLeft: 20}}>Workouts</p>
                <div style={{height: 130, width: 350, margin: 15, border: "1px solid #727272", borderRadius: 15, flexDirection: 'column' }}>
                  {index.days.monday}
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
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>S&C Circuit</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                </div>
                <div style={{height: 130, width: 350, margin: 15, border: "1px solid #727272", borderRadius: 15, flexDirection: 'column'}}>
                  {index.days.tuesday}
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
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>S&C Circuit</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                </div>
                <div style={{height: 130, width: 350, margin: 15, border: "1px solid #727272", borderRadius: 15, flexDirection: 'column'}}>
                  {index.days.wednesday}
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
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>S&C Circuit</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                </div>
                <div style={{height: 130, width: 350, margin: 15, border: "1px solid #727272", borderRadius: 15, flexDirection: 'column'}}>
                  {index.days.thursday}
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
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>S&C Circuit</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                </div>
                <div style={{height: 130, width: 350, margin: 15, border: "1px solid #727272", borderRadius: 15, flexDirection: 'column'}}>
                  {index.days.friday}
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
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>S&C Circuit</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                </div>
                <div style={{height: 130, width: 350, margin: 15, border: "1px solid #727272", borderRadius: 15, flexDirection: 'column'}}>
                  {index.days.saturday}
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
                    <p style={{margin: 0, fontSize: 16, fontWeight: '600'}}>S&C Circuit</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Calories</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Difficulty</p>
                    <p style={{margin: 0, fontSize: 13, fontWeight: '600'}}>Duration</p>
                  </Grid>
                  </Grid>
                </div>
                <div style={{height: 130, width: 350, margin: 15, border: "1px solid #727272", borderRadius: 15, flexDirection: 'column', textAlign: 'center'}}>
                  {index.days.sunday}
                  <p style={{marginLeft: 10, marginTop: 50, marginBottom: 4}}>SUNDAY</p>
                  
                </div>
              </div>
            </div>
          ))}
          <div style={{flexDirection: 'column', margin: 10}}>
            <p onClick={handleClickOpenDialogCopy}>Copy</p>
            <div onClick={handleClickOpenDialog} style={{ borderRadius: 15, margin: 15, border: "1px dashed #727272", height: 100, width: 350, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <img style={{objectFit: 'contain'}} src="/assets/plus_thin.png" alt="" width="25px" height="25px" />{" "}
            </div>
          </div>
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
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <EventNoteOutlined style={{backgroundColor: "#fcd13f", padding: 20, borderRadius: "50%"}} />
                <p>Create New Workout</p>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <DashboardOutlined style={{backgroundColor: "#fcd13f", padding: 20, borderRadius: "50%"}} />
                <p>Add From Saved Workouts</p>
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
    </div>
  )
}

export default CreateLongTermTrainingPlan
