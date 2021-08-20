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
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

import { Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import VODScreenHeader from "./VODScreenHeader";
function ViewAllUploadedVideos({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);
  const [athleteDetails, setAthleteDetails] = useState([]);
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [search, setsearch] = useState("");
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
  const [showFilter, setShowFilter] = React.useState(false);

  document.addEventListener("mouseup", function (e) {
    if (showFilter) {
      setShowFilter(false);
    }
  });

  useEffect(() => {
    var temp = [];
    const data = [];

    if (userData?.id) {
      db.collection("coaches")
        .doc(userData?.id)
        .collection("videos")
        .orderBy("timestamp", sorting)
        .get()

        .then((snapshot) => {
          snapshot.forEach((dat) => {
            console.log("a", dat.data());
            data.push(dat.data());
          });
          setVideoData(data);
        });

      //   db.collection("WorkoutVideo")
      //     .where("AssignedById", "==", userData?.id)
      //     .orderBy("timestamp")
      //     .limit(4)
      //     .get()

      //     .then((snap) => {
      //       let data = [];
      //       snap.forEach((s) => {
      //         console.log("sss", s.data());
      //         data.push(s.data());
      //       });

      //       setAssignedVideos(data);
      //     });
    }
  }, [user, sorting, userData?.id]);

  React.useEffect(() => {
    setSearchList(videoData);
    console.log(videoData);
  }, [videoData]);

  React.useEffect(() => {
    console.log(search);
    (async () => {
      if (search?.length > 0 && videoData) {
        const names = await videoData?.filter((data) => {
          console.log(data);
          return data?.title.toLowerCase().includes(search.toLowerCase());
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
    <div
      style={{
        boxSizing: "border-box",
        minHeight: "100vh",
      }}
    >
      <VODScreenHeader name="Uploaded Videos" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            margin: 20,
            backgroundColor: "white",
            padding: 5,
            display: "flex",
            alignItems: "center",
            border: "1px solid black",
            width: "500px",
            borderRadius: 10,
          }}
        >
          <input
            value={search}
            placeholder="Video Name"
            style={{
              width: "100%",

              fontSize: 20,
              outline: "none",
              border: "none",
            }}
            onChange={(e) => {
              setsearch(e.target.value);
            }}
          />
          {search?.length == 0 ? (
            <SearchIcon
              style={{
                width: 30,
                height: 30,
              }}
            />
          ) : (
            <div
              onClick={() => {
                setsearch("");
              }}
            >
              <ClearIcon
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div className="filter_icon">
            <img
              onClick={() => {
                setShowFilter(!showFilter);
              }}
              src="/assets/filter.png"
              width="35px"
              height="35px"
            />
          </div>
          <div
            className="filter"
            style={{
              position: "absolute",
              marginTop: 40,
              display: showFilter ? "block" : "none",
              border: "1px solid black",
              fontSize: 12,
              borderRadius: 10,
            }}
          >
            <div
              onClick={() => {
                setsorting("desc");
                setShowFilter(false);
              }}
              style={{
                padding: 10,
                borderBottom: "1px solid black",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                backgroundColor: sorting == "desc" ? "#fcd11c" : "white",
              }}
            >
              Recent
            </div>
            <div
              onClick={() => {
                setsorting("asc");
                setShowFilter(false);
              }}
              style={{
                padding: 10,
                backgroundColor: sorting == "asc" ? "#fcd11c" : "white",

                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              oldest to new
            </div>
          </div>
        </div>
        <div
          style={{
            width: 150,
            marginLeft: "auto",
          }}
        >
          {/* <Dropdown
            options={options}
            placeholder="Order By"
            onChange={(s) => {
              setsorting(s.value);
            }}
          /> */}
        </div>
      </div>
      <Grid container spacing={2} className="workouts__homeContainer">
        {/* <Grid item xs={6} className="workouts__homeLeftContainer">
          <div
            style={{
              width: "90%",
              paddingLeft: 10,
              display: "flex",
              alignItems: "center",
            }}
            className="workoutHeading__row"
          >
            <h1>Assigned Videos</h1>
            <p
              style={{ cursor: "pointer" }}
              onClick={() => history.push("/view-all-workouts")}
            >
              View All
            </p>
          </div>
          {AssignedVideos?.map((video, idx) => (
            <div style={{}}>
              {video?.Video?.map((Id, idx) => (
                <div class="iframe_container">
                  <iframe
                    style={{ borderRadius: 10 }}
                    src={"https://player.vimeo.com/video/" + `${Id?.videoId}`}
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
          ))}
        </Grid> */}
        <Grid item xs={6} className="workouts__homeLeftContainer">
          {console.log("b", videoData)}
          {SearchList?.length > 0 ? (
            SearchList?.map((video, idx) => (
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
                width: "510px",
                padding: "10px 20px",
                textAlign: "center",
                borderRadius: "5px",
                fontWeight: "normal",
                margin: 20,
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
  );
}

export default ViewAllUploadedVideos;
