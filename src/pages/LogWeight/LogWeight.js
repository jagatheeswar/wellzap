import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header/Header";
import {
  selectTemperoryId,
  selectUser,
  selectUserType,
  selectUserData,
} from "../../features/userSlice";
import { db } from "../../utils/firebase";
import "./profile.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import moment from "moment";
import firebase from "firebase";

function LogWeight({ route, navigation }) {
  const user = useSelector(selectUser);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fat, setFat] = useState("");
  const [muscle, setMuscle] = useState("");
  const [image, setImage] = useState("");
  const defaultValue = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: 10,
  };
  const [selectedDay, setSelectedDay] = useState(defaultValue);
  const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const userData = useSelector(selectUserData);
  const [backUrl, setBackUrl] = useState(null);
  const [frontUrl, setFrontUrl] = useState(null);
  const [backImageUrl, setBackImageUrl] = useState(null);
  const [frontImageUrl, setFrontImageUrl] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    let now = moment();

    let today_date = {
      year: now.get("year"),
      month: now.get("month") + 1,
      day: now.get("date"),
    };

    setSelectedDay(today_date);
    if (userData) {
      setHeight(userData?.data?.height);
      setWeight(userData?.data?.weight);
    }
  }, [userData]);

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  useEffect(() => {
    if (date && userData?.id && userData?.data.metrics) {
      if (userData?.data?.metrics[date] !== undefined) {
        if (userData?.data.metrics[date].weight !== undefined) {
          setWeight(userData?.data.metrics[date].weight);
        }
        if (userData?.data.metrics[date].height !== undefined) {
          setHeight(userData?.data.metrics[date].height);
        }
        if (userData?.data.metrics[date].fat !== undefined) {
          setFat(userData?.data.metrics[date].fat);
        }
        if (userData?.data.metrics[date].muscle !== undefined) {
          setMuscle(userData?.data.metrics[date].muscle);
        }
      }
    }
  }, [date]);

  useEffect(() => {
    var local_date =
      selectedDay.year +
      "-" +
      (selectedDay.month <= 9
        ? "0" + String(selectedDay.month)
        : selectedDay.month) +
      "-" +
      (selectedDay.day <= 9 ? "0" + selectedDay.day : selectedDay.day);
    setDate(local_date);
  }, [selectedDay]);

  const AddDetails = async () => {
    if (weight) {
      let temp = { ...userData?.data?.metrics };
      if (temp[date]) {
        let t = { ...temp[date] };
        t.weight = weight;
        t.height = height;
        t.fat = fat;
        t.muscle = muscle;
        temp[date] = t;
        t.frontImageUrl = frontUrl ? frontUrl : "";
        t.backImageUrl = backUrl ? backUrl : "";
      } else {
        temp[date] = {
          weight,
          height,
          fat,
          muscle,
          frontImageUrl: frontUrl,
          backImageUrl: backUrl,
        };
      }

      db.collection("athletes").doc(userData?.id).update({
        metrics: temp,
      });

      if (fat || muscle || height || weight) {
        db.collection("athletes")
          .doc(userData?.id)
          .collection("Anthropometric")
          .get()
          .then((snap) => {
            if (!snap.empty) {
              db.collection("athletes")
                .doc(userData?.id)
                .collection("Anthropometric")
                .doc("anthropometric")
                .update({
                  height,
                  weight,
                  fat,
                  muscle,
                  backImageUrl: backUrl,
                  frontImageUrl: frontUrl,
                })
                .then((res) => {
                  alert("Logged Metrics Sucessfully!");

                  db.collection("CoachNotifications")
                    .doc(userData.data.listOfCoaches[0])
                    .collection("notifications")
                    .add(
                      {
                        message: `${
                          userData?.data?.name
                        } has logged metrics on ${formatDate()} `,
                        seen: false,
                        timestamp:
                          firebase.firestore.FieldValue.serverTimestamp(),
                        athlete_id: userData?.id,
                      },
                      { merge: true }
                    );
                })
                .catch((e) => {
                  console.log(e);
                });
            } else {
              db.collection("athletes")
                .doc(userData?.id)
                .collection("Anthropometric")
                .doc("anthropometric")
                .set({
                  height,
                  weight,
                  fat,
                  muscle,
                  backImageUrl: backUrl,
                  frontImageUrl: frontUrl,
                })
                .then((res) => {
                  alert("Logged Metrics Sucessfully!");
                })
                .catch((e) => console.log(e));
            }
          });
      }
    } else {
      alert("Please enter the weight.");
    }
  };

  useEffect(() => {
    if (userData) {
      db.collection("athletes")
        .doc(userData?.id)
        .collection("Anthropometric")
        .doc("anthropometric")
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setHeight(doc.data().height);
            setWeight(doc.data().weight);
            setFat(doc.data().fat);
            setMuscle(doc.data().muscle);
          } else {
            console.log("No such document!");
          }
        })
        .catch((e) => console.log(e));
    }
  }, [userData?.id]);

  useEffect(() => {
    const uploadImage = async () => {
      if (backImageUrl) {
        const response = await fetch(backImageUrl);
        const blob = await response.blob();
        const childPath = `images/${userData.data.email}/${date}/backImage`;

        const task = firebase.storage().ref().child(childPath).put(blob);

        const taskProgress = (snapshot) => {
          console.log(`transferred: ${snapshot.bytesTransferred}`);
        };

        const taskCompleted = () => {
          task.snapshot.ref.getDownloadURL().then((snapshot) => {
            setBackUrl(snapshot);
          });
        };

        const taskError = (snapshot) => {
          console.log(snapshot);
        };

        task.on("state_changed", taskProgress, taskError, taskCompleted);
      }
      if (frontImageUrl) {
        const response = await fetch(frontImageUrl);
        const blob = await response.blob();
        const childPath = `images/${userData.data.email}/${date}/frontImage`;

        const task = firebase.storage().ref().child(childPath).put(blob);

        const taskProgress = (snapshot) => {
          console.log(`transferred: ${snapshot.bytesTransferred}`);
        };

        const taskCompleted = () => {
          task.snapshot.ref.getDownloadURL().then((snapshot) => {
            setFrontUrl(snapshot);
            console.log(snapshot);
          });
        };

        const taskError = (snapshot) => {};

        task.on("state_changed", taskProgress, taskError, taskCompleted);
      }
    };
    uploadImage();
  }, [backImageUrl, frontImageUrl]);

  return (
    <div className="athleteMeasurements">
      <div style={{ width: "98%" }} className="athleteProfile__leftContainer">
        <Header />
        <h2>Log Weight</h2>
        <div
          style={{
            display: "flex",
            flex: 1,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "50%" }}>
            <Calendar
              value={selectedDay}
              onChange={setSelectedDay}
              colorPrimary="#ffe486" // added this
              colorPrimaryLight="blue"
              calendarClassName="customcalendarScreen" // and this
              calendarTodayClassName="custom-today-day" // also this
            />
          </div>

          <div
            style={{ width: "47%" }}
            className="athleteMeasurements__container"
          >
            <form style={{ width: "80%" }}>
              <h4>Weight*</h4>
              <input
                style={{ width: "100%" }}
                defaultValue={userData?.data?.weight}
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                }}
                type="text"
                placeholder="Enter Weight"
              />
              <hr style={{ width: "90%", marginTop: 20 }}></hr>
              <h4>Height*</h4>
              <input
                style={{ width: "100%" }}
                defaultValue={userData?.data?.height}
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                }}
                type="text"
                placeholder="Enter Height"
              />
              <h4>Fat Percentage</h4>
              <input
                style={{ width: "100%" }}
                defaultValue={userData?.data?.fat}
                value={fat}
                onChange={(e) => {
                  setFat(e.target.value);
                }}
                type="text"
                placeholder="Enter Fat Percentage"
              />
              <h4>Muscle Percentage</h4>
              <input
                style={{ width: "100%" }}
                placeholder="Enter Muscle Percentage"
                defaultValue={userData?.data?.muscle}
                value={muscle}
                onChange={(e) => {
                  setMuscle(e.target.value);
                }}
                type="text"
                placeholder="Enter Muscle Percentage"
              />
              <h6>*Compulsory Fields</h6>
            </form>
            <form>
              <p style={{ margin: 0, padding: 0 }}>Front Image</p>
              <input
                style={{ width: "80%" }}
                type="file"
                name="user[image]"
                multiple="true"
                onChange={(event) =>
                  setFrontImageUrl(URL.createObjectURL(event.target.files[0]))
                }
              />
            </form>
            <form>
              <p style={{ margin: 0, padding: 0, marginTop: 10 }}>Back Image</p>
              <input
                style={{ width: "80%" }}
                type="file"
                name="user[image]"
                multiple="true"
                onChange={(event) =>
                  setBackImageUrl(URL.createObjectURL(event.target.files[0]))
                }
              />
            </form>

            <div className="saveProfileButton" onClick={() => AddDetails()}>
              <h3>Log Details</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogWeight;
