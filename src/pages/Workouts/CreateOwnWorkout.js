import React from 'react'
import WorkoutScreenHeader from "./WorkoutScreenHeader";
import { db } from "../../utils/firebase";
import { selectUserData } from "../../features/userSlice";
import { useSelector } from "react-redux";
import { TextField, Button } from '@material-ui/core'
const CreateOwnWorkout = () => {
  const [workoutName, setWorkoutName] = React.useState('');
  const [videoLink, setVideoLink] = React.useState('');
  const userData = useSelector(selectUserData);
  return (
    <div style={{minHeight: "99.7vh"}}>
      <WorkoutScreenHeader name="Add Own Workouts" />
      <div style={{display: 'flex', flexDirection: 'column', marginLeft: 20}}>
        <TextField 
          style={{marginTop: 30, width: 300}}
          variant="filled"
          label="Workout Name"
          value={workoutName}
          onChange={(event) => setWorkoutName(event.target.value)}
        />
        <TextField 
          style={{marginTop: 30, width: 300}}
          variant="filled"
          label="Video URL"
          value={videoLink}
          onChange={(event) => setVideoLink(event.target.value)}
        />
        <Button 
          onClick={() => {
            if(workoutName !== '' && videoLink !== '') {
              db.collection("coaches").doc(userData?.id).collection("ownWorkout")
              .add({
                workoutName: workoutName,
                videoURL: videoLink
              })
              .then(() => {
                console.log("successfully added own workout");
                setWorkoutName('')
                setVideoLink('')
              })
            } else {
              console.log("can't be empty")
            }}}
          style={{width: 300, marginTop: 30, backgroundColor:"#FAD647"}}
        >Add own workout</Button>
      </div>
    </div>
  )
}

export default CreateOwnWorkout
