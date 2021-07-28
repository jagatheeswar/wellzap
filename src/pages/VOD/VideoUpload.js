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
import Modal from "react-awesome-modal";
import { useHistory } from "react-router-dom";

//const defaultimg = require("../../../public/assets/illustration.jpeg");

function VideoUpload({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);
  const [athleteDetails, setAthleteDetails] = useState([]);
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [listOfAthletes, setListOfAthletes] = useState(null);
  const [videoId, setVideoId] = useState(["576142998", "575857316"]);
  const [videoData, setVideoData] = useState([]);
  const [modal, setModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setisUploading] = useState(false);
  const [isError, setiserror] = useState(false);
  const history = useHistory();

  useEffect(() => {
    var temp = [];
    const data = [];
    console.log(userData);
    if (userData?.id) {
    }
  }, [user, userData?.id]);

  const fetchUsers = (search) => {
    var temp = [];
    const data = [];
    console.log(userData);
    if (userData?.id) {
    }
  };

  // useEffect(() => {
  //   const uploadImage = async () => {
  //     if (imageUrl) {
  //       const response = await fetch(imageUrl);
  //       const blob = await response.blob();
  //       const childPath = `images/${userData.data.email}/chat`;

  //       const task = firebase.storage().ref().child(childPath).put(blob);

  //       const taskProgress = (snapshot) => {
  //         console.log(`transferred: ${snapshot.bytesTransferred}`);
  //       };

  //       const taskCompleted = () => {
  //         task.snapshot.ref.getDownloadURL().then((snapshot) => {
  //           db.collection("chat")
  //             .where("from_id", "==", from_id)
  //             .where("to_id", "==", to_id)
  //             .get()
  //             .then(function (querySnapshot) {
  //               querySnapshot.forEach(function (doc) {
  //                 setDoc_id(doc.id);

  //                 if (type === "coach") {
  //                   if (doc.id) {
  //                     db.collection("chat")
  //                       .doc(doc.id)
  //                       .collection("messages")
  //                       .add({
  //                         timestamp:
  //                           firebase.firestore.FieldValue.serverTimestamp(),
  //                         from_id: to_id,
  //                         from_name: to_name,
  //                         format: "image",
  //                       })
  //                       .catch((e) => console.log(e));
  //                   }
  //                 } else if (type === "athlete") {
  //                   if (doc.id) {
  //                     db.collection("chat")
  //                       .doc(doc.id)
  //                       .collection("messages")
  //                       .add({
  //                         timestamp:
  //                           firebase.firestore.FieldValue.serverTimestamp(),
  //                         message: snapshot,
  //                         from_id: from_id,
  //                         from_name: from_name,
  //                         format: "image",
  //                       })
  //                       .catch((e) => console.log(e));
  //                   }
  //                 }
  //               });
  //               setImageUrl(null);
  //             })
  //             .catch(function (error) {
  //               console.log("Error getting documents: ", error);
  //             });

  //           setInputMessage("");
  //         });
  //       };

  //       const taskError = (snapshot) => {
  //         console.log(snapshot);
  //       };

  //       task.on("state_changed", taskProgress, taskError, taskCompleted);
  //     }
  //   };
  //   uploadImage();
  // }, [imageUrl]);

  const sendvideo = () => {
    let data = [...videoData];

    if (!data || data?.length == 0) {
      alert("please fill all details");
    }
    console.log(data);
    data?.forEach((vid) => {
      if (vid.video && vid.title) {
        setisUploading(true);
        setiserror(false);
        setModal(true);
        console.log(vid);
        var formData = new FormData();
        formData.append("title", vid.title);
        formData.append("description", vid.description);
        formData.append(
          "video",
          vid["video"],

          vid.video.name
        );
        // formData.append("video", {
        //   uri: vid?.thumbnail?.uri ? vid?.thumbnail?.uri : null,
        //   type: vid?.thumbnail?.type ? vid?.thumbnail?.type : null,
        //   name: vid?.thumbnail?.name ? vid?.thumbnail?.name : null,
        // });
        let headers = {
          // this is a imp line
        };
        let obj = {
          method: "POST",
          headers: headers,
          body: formData,
        };

        let url1 = "http://localhost:3001/api/upload/video";
        console.log(formData);
        setTimeout(() => {
          fetch(url1, obj) // put your API URL here
            .then((resp) => {
              console.log(1);
              let json = null;

              console.log("r", resp);
              json = resp.json();
              console.log(" Response", json);
              if (resp.ok) {
                return json;
              }
              return json.then((err) => {
                console.log("error :", err);
                throw err;
              });
            })
            .then((json) => {
              if (json.success) {
                setisUploading(false);

                console.log(
                  json,
                  firebase.firestore.FieldValue.serverTimestamp(),
                  vid.title,
                  vid.description,
                  userData?.id
                );

                db.collection("coaches")
                  .doc(userData?.id)
                  .collection("videos")
                  .add({
                    videoId: json.uri,
                    thumbnail: "",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    title: vid.title ? vid.title : "",
                    description: vid.description ? vid.description : "",
                    UploadedById: userData?.id,
                  });
                console.log("wt", json);
              } else {
                setisUploading(false);

                setiserror(true);
              }
            })
            .catch((err) => {
              setisUploading(false);
              setiserror(true);

              console.log("c", err);
            });
        }, 2000);
      } else {
        alert("please fill the required feilds");
        //setisUploading(false);
      }
    });

    // var formData = new FormData();
    // formData.append("title", "title");
    // formData.append("description", "description");
    // formData.append("video", {
    //   uri: res.uri,
    //   type: res.type,

    //   name: res.name,
    // });

    // let headers = {
    //   "Content-Type": "multipart/form-data", // this is a imp line
    //   Accept: "application/json",
    // };
    // let obj = {
    //   method: "POST",
    //   headers: headers,
    //   body: formData,
    // };
    // console.log("err");
    // let url1 = "http://192.168.55.101:3000/api/upload/video";

    // setTimeout(() => {
    //   fetch(url1, obj) // put your API URL here
    //     .then((resp) => {
    //       console.log(resp);
    //       let json = null;
    //       json = resp.json();
    //       console.log(" Response", json);
    //       if (resp.ok) {
    //         return json;
    //       }
    //       return json.then((err) => {
    //         console.log("error :", err);
    //         throw err;
    //       });
    //     })
    //     .then((json) => json)
    //     .catch((err) => {
    //       console.log("c", err);
    //     });
    // }, 3000);
  };

  return (
    <div
      style={{
        margin: 20,
        boxSizing: "border-box",
        minHeight: "100vh",
      }}
    >
      <div>
        <h3 style={{ fontSize: 17, color: "black" }}>Enter Video Details</h3>
        <div>
          <h3 style={{ fontSize: 15, color: "black", marginTop: 20 }}>
            Upload Video
          </h3>

          <div
            class="videoupload"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {videoData[0]?.thumbnail ? (
              ""
            ) : (
              <img src="/assets/illustration.jpeg" width="120" height="100" />
            )}
            <label
              for="file"
              style={{
                marginLeft: 20,
              }}
              id="filelabel"
            >
              {videoData[0]?.video
                ? videoData[0]?.video.name +
                  " - " +
                  (videoData[0]?.video.size / 1000000).toFixed(2) +
                  "MB"
                : "Click to upload a video"}
            </label>
            <input
              type="file"
              class="file"
              id="file"
              style={{
                outline: "none",
                border: "none",
              }}
              onChange={(event) => {
                let temp = [...videoData];
                if (!temp[0]) {
                  temp[0] = {};
                }
                temp[0]["video"] = event.target.files[0];
                console.log(event.target.files[0]);
                setVideoData(temp);
              }}
              name="video"
            />
          </div>
          <div>
            <h3 style={{ fontSize: 15, color: "black" }}>Video Name</h3>
            <input
              type="text"
              class="vod_input"
              placeholder="Enter Video Name"
              onChange={(val) => {
                let temp = [...videoData];
                if (!temp[0]) {
                  temp[0] = {};
                }
                temp[0]["title"] = val.target.value;
                setVideoData(temp);
              }}
              style={{
                borderWidth: 0.5,
                marginTop: 10,
                backgroundColor: "white",
              }}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 15, color: "black" }}>Video Description</h3>
            <input
              type="text"
              class="vod_input"
              onChange={(val) => {
                let temp = [...videoData];
                if (!temp[0]) {
                  temp[0] = {};
                }
                temp[0]["description"] = val.target.value;
                setVideoData(temp);
              }}
              placeholder="Enter Video Description"
              style={{
                borderWidth: 0.5,
                marginTop: 10,

                backgroundColor: "white",
              }}
            />
          </div>
          <h3 style={{ marginTop: 30, fontSize: 15, color: "black" }}>
            Upload Video Thumbnail
          </h3>
          {/* <button
            onPress={() => pickDocument("images")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              margin: 20,
            }}
          >
            <div
              style={{
                padding: 10,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              {console.log("smj", videoData[0]?.thumbnail?.uri)}
              {videoData[0]?.thumbnail ? (
                <Image
                  style={{ width: 100, height: 70 }}
                  source={{ uri: videoData[0].thumbnail.uri }}
                />
              ) : (
                <Icon
                  name="video"
                  type="font-awesome-5"
                  color="black"
                  size={30}
                />
              )}
            </div>
            <h3 style={{ marginLeft: 30 }}>Select Image from Gallery</h3>
          </button> */}

          <div
            class="videoupload"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <VideocamIcon size={50} style={{ width: 40, height: 40 }} />
            <label
              for="file"
              style={{
                marginLeft: 20,
              }}
              id="filelabel"
            >
              Click to upload a thumbnail
            </label>
            <input
              type="file"
              class="file"
              id="file"
              style={{
                outline: "none",
                border: "none",
              }}
              onChange={(event) => {
                let temp = [...videoData];
                if (!temp[0]) {
                  temp[0] = {};
                }
                temp[0]["video"] = event.target.files[0];
                console.log(event.target.files[0]);
                setVideoData(temp);
              }}
              name="video"
            />
          </div>
          {console.log(videoData[0])}
          <div style={{ padding: 10 }}>
            <button
              color="transparent"
              style={{
                backgroundColor: "#fcd13f",
                boxShadow: "2px 4px #e6e6e6",
                border: "none",
                padding: 10,
                borderRadius: 10,
                width: 150,
              }}
              onClick={() => {
                sendvideo();
              }}
            >
              Upload Video
            </button>
          </div>
        </div>
        {/* 
        <Formik
          initialValues={{ title: "", description: "" }}
          onSubmit={(values) => {
            console.log(values);
            if (values.title && values.description) {
            } else {
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <div>
              <h3Input
                name="title"
                onChangeh3={handleChange("title")}
                onBlur={handleBlur("title")}
                value={values.title}
              />
              <h3Input
                name="description"
                onChangeh3={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
              />

              <Button
                title="Upload Video"
                onPress={() => pickDocument("video")}
              />
              <Button onPress={handleSubmit} title="Submit" />
            </div>
          )}
        </Formik> */}
      </div>
      <Modal
        width="450px"
        height="200"
        effect="fadeInUp"
        onClickaway={() => setModal(false)}
        visible={modal}
      >
        <div
          style={{
            backgroundColor: "white",
            width: "70%",
            height: "20%",
            borderRadius: 10,
            width: "100%",
            marginTop: 20,
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isUploading && <h3 style={{ fontSize: 20 }}>Uploading</h3>}
          {isError && <h3 style={{ fontSize: 20 }}>Error uploading Video</h3>}
          {!isError && !isUploading && (
            <div>
              <h3 style={{ fontSize: 20 }}>Video succesfully uploaded</h3>
              <h3 style={{ fontSize: 20 }}>Do you want to assign the video</h3>
            </div>
          )}
        </div>
        {!isError && !isUploading ? (
          <div
            style={{
              display: "flex",
              marginTop: 80,
              justifyContent: "space-between",
              padding: "0 40px 0 40px",
            }}
          >
            <div
              onClick={() => {
                setModal(false);
              }}
              style={{
                backgroundColor: "rgb(252, 209, 63)",
                fontWeight: 600,

                bottom: 30,
                textAlign: "center",

                borderRadius: 10,
                padding: "5px 20px",
              }}
            >
              CLOSE
            </div>

            <div
              onClick={() => {
                setModal(false);
                history.push({
                  pathname: "/assignvideo",
                  state: { videoData: videoData },
                });
              }}
              style={{
                backgroundColor: "rgb(252, 209, 63)",
                fontWeight: 600,

                textAlign: "center",

                borderRadius: 10,
                padding: "5px 20px",
              }}
            >
              ASSIGN VIDEO
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              setModal(false);
            }}
            style={{
              backgroundColor: "rgb(252, 209, 63)",
              fontWeight: 600,
              position: "absolute",
              bottom: 30,
              textAlign: "center",
              left: "40%",
              borderRadius: 10,
              padding: "5px 20px",
            }}
          >
            CLOSE
          </div>
        )}
      </Modal>
    </div>
  );
}

export default VideoUpload;
