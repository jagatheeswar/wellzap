import React, { useState, useEffect, useCallback } from "react";

import { auth, db } from "../../utils/firebase";
import firebase from "firebase";

import { useDispatch, useSelector } from "react-redux";
import {
  setDbID,
  selectDbId,
  selectUser,
  setUserDetails,
  selectShowData,
  logout,
  setUserData,
  selectUserData,
} from "../../features/userSlice";
import "./vod.css";
//import Notification from "../components/Notification";
import VideocamIcon from "@material-ui/icons/Videocam";
import { Formik } from "formik";

import { Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import VODScreenHeader from "./VODScreenHeader";
function VODHome({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);
  const [athleteDetails, setAthleteDetails] = useState([]);
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [listOfAthletes, setListOfAthletes] = useState(null);
  const [videoId, setVideoId] = useState(["576142998", "576142998"]);
  const [title, settitle] = useState("");
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);

  const [verifiedModal, setVerifiedModal] = useState(false);
  const [onboardModal, setOnboardModal] = useState(false);

  const [SearchList, setSearchList] = React.useState(null);
  const [SearchLoading, SetSearhLoading] = React.useState(false);

  const [filterAsc, setFilterAsc] = useState(false);
  const [sorting, setsorting] = React.useState("desc");
  const history = useHistory();
  const [videoData, setVideoData] = useState([
    {
      videoId: 576142998,
      title: "a",
    },
    {
      videoId: 576142998,
      title: "b",
    },
  ]);
  const [AssignedVideos, setAssignedVideos] = useState([]);
  useEffect(() => {
    var temp = [];
    const data = [];

    if (userData?.id) {
      db.collection("coaches")
        .doc(userData?.id)
        .collection("videos")
        .orderBy("timestamp")
        .limit(4)
        .get()

        .then((snapshot) => {
          snapshot.forEach((dat) => {
            console.log("a", dat.data());
            data.push(dat.data());
          });
          setVideoData(data);
        });

      db.collection("WorkoutVideo")
        .where("AssignedById", "==", userData?.id)
        .orderBy("timestamp")
        .limit(4)
        .get()

        .then((snap) => {
          let data = [];
          snap.forEach((s) => {
            console.log("sss", s.data());
            data.push(s.data());
          });

          setAssignedVideos(data);
        });
    }
  }, [user, userData?.id]);

  React.useEffect(() => {
    setSearchList(videoData);
    console.log(videoData);
  }, [videoData]);

  React.useEffect(() => {
    console.log(search);
    (async () => {
      if (search?.length > 0 && videoData) {
        const names = await videoData?.filter((data) => {
          return data.title.toLowerCase().includes(search.toLowerCase());
        });

        setSearchList(names);
        SetSearhLoading(false);
      } else {
        setSearchList(videoData);
        SetSearhLoading(false);
      }
    })();
  }, [search, videoData]);

  const fetchUsers = (search) => {
    var temp = [];
    const data = [];
    console.log(userData);
    if (userData?.id) {
    }
  };

  return (
    <div>
      <VODScreenHeader name="Video on Demand" />

      <div
        style={{
          boxSizing: "border-box",
          minHeight: "100vh",
          margin: 10,
        }}
      >
        <Grid
          container
          spacing={2}
          style={{}}
          className="workouts__homeContainer"
        >
          <Grid item xs={6} className="workouts__homeLeftContainer">
            <div
              style={{ width: "90%", paddingLeft: 10 }}
              className="workoutHeading__row"
            >
              <h1>Assigned Videos</h1>
              <div onClick={() => history.push("/assigned-videos")}>
                View All
              </div>
            </div>

            {AssignedVideos?.length > 0 ? (
              AssignedVideos?.map((video, idx) => (
                <div style={{}}>
                  {video?.Video?.map((Id, idx) => (
                    <div class="iframe_container">
                      <iframe
                        style={{ borderRadius: 10 }}
                        src={
                          "https://player.vimeo.com/video/" + `${Id?.videoId}`
                        }
                        width="400px"
                        height="200px"
                        frameborder="0"
                        webkitallowfullscreen
                        mozallowfullscreen
                        allowfullscreen
                      ></iframe>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div
                style={{
                  fontSize: "13px",
                  backgroundColor: "#fff",
                  width: "90%",
                  padding: "10px 20px",
                  textAlign: "center",
                  borderRadius: "5px",
                  fontWeight: "normal",
                  marginLeft: 10,
                  boxSizing: "border-box",
                }}
              >
                <h5> There are no assigned videos for now </h5>
              </div>
            )}
          </Grid>
          <Grid item xs={6} className="workouts__homeLeftContainer">
            <div
              style={{ width: "90%", paddingLeft: 10 }}
              className="workoutHeading__row"
            >
              <h1>Uploaded Videos</h1>

              <div onClick={() => history.push("/uploaded-videos")}>
                View All
              </div>
            </div>

            {console.log("b", videoData)}

            {videoData?.length > 0 ? (
              videoData?.map((video, idx) => (
                <div>
                  <div class="iframe_container">
                    {console.log("vi", videoData)}
                    <iframe
                      style={{ borderRadius: 10 }}
                      src={
                        "https://player.vimeo.com/video/" + `${video?.videoId}`
                      }
                      width="400px"
                      height="200px"
                      frameborder="0"
                      webkitallowfullscreen
                      mozallowfullscreen
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  fontSize: "13px",
                  backgroundColor: "#fff",
                  width: "90%",
                  padding: "10px 20px",
                  textAlign: "center",
                  borderRadius: "5px",
                  fontWeight: "normal",
                  marginLeft: 10,
                  boxSizing: "border-box",
                }}
              >
                <h5> There are no uploaded videos for now </h5>
              </div>
            )}
          </Grid>
        </Grid>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </div>
    </div>
  );
}

export default VODHome;
