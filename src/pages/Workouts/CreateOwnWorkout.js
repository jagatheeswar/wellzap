import React from "react";
import WorkoutScreenHeader from "./WorkoutScreenHeader";
import { db } from "../../utils/firebase";
import { selectUserData } from "../../features/userSlice";
import { useSelector } from "react-redux";
import { TextField, Button } from "@material-ui/core";
import VideoUpload from "../VOD/VideoUpload";
import { useHistory } from "react-router-dom";
import "./CoachAddWorkout.css";

const CreateOwnWorkout = () => {
  const [workoutName, setWorkoutName] = React.useState("");
  const [videoLink, setVideoLink] = React.useState("");
  const userData = useSelector(selectUserData);
  const [uploadVideo, setUploadVideo] = React.useState(false);
  const [Uploaded, SetUploaded] = React.useState(false);
  const history = useHistory();
  React.useEffect(() => {
    if (Uploaded) {
      setUploadVideo(false);
    }
  }, [Uploaded, videoLink]);
  return (
    <div style={{ minHeight: "99.7vh" }}>
      <WorkoutScreenHeader name="Add Own Workouts" />
      <div style={{ display: "flex", flexDirection: "column", marginLeft: 20 }}>
        <input
          style={{
            width: "50%",
            padding: "10px",
            boxSizing: "border-box",
            border: "none",
            boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.4)",
            borderRadius: 5,
            marginTop: 30,
          }}
          variant="filled"
          placeholder="Workout Name"
          value={workoutName}
          onChange={(event) => setWorkoutName(event.target.value)}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {!uploadVideo && (
            <input
              style={{
                width: "50%",
                padding: "10px",
                boxSizing: "border-box",
                border: "none",
                boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.4)",
                borderRadius: 5,
                marginTop: 30,
              }}
              variant="filled"
              placeholder="Video URL"
              value={videoLink}
              onChange={(event) => setVideoLink(event.target.value)}
            />
          )}
          {videoLink == "" && (
            <Button
              style={{ marginTop: 30 }}
              onClick={() => {
                setUploadVideo(!uploadVideo);
              }}
            >
              Upload a video
            </Button>
          )}
        </div>

        {uploadVideo && (
          <VideoUpload videoStatus={SetUploaded} videoLink={setVideoLink} />
        )}
        <button
          onClick={() => {
            if (workoutName !== "" && videoLink !== "") {
              db.collection("coaches")
                .doc(userData?.id)
                .collection("ownWorkout")
                .add({
                  workoutName: workoutName,
                  videoURL: videoLink,
                })
                .then(() => {
                  console.log("successfully added own workout");
                  setWorkoutName("");
                  setVideoLink("");
                });
            } else {
              console.log("can't be empty");
            }
          }}
          style={{
            border: "none",
            outline: "none",
            width: 200,
            height: 40,
            backgroundColor: "#ffe486",
            borderRadius: 7,
            marginTop: 30,
            boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.2)",
          }}
        >
          Add Own Workout
        </button>
      </div>
    </div>
  );
};

export default CreateOwnWorkout;
