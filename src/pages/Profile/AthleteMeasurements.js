import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header/Header";
import Notification from "../../Components/Notifications/Notification";
import Sidebar from "../../Components/Sidebar/Sidebar";
import {
  selectTemperoryId,
  selectUser,
  selectUserType,
} from "../../features/userSlice";
import { db } from "../../utils/firebase";
import "./Profile.css";

function AthleteMeasurements({ route, navigation }) {
  const user = useSelector(selectUser);
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fat, setFat] = useState("");
  const [muscle, setMuscle] = useState("");

  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      setHeight(userData?.data?.height);
      setWeight(userData?.data?.weight);
    }
  }, [userData]);

  useEffect(() => {
    if (userType === "coach") {
      db.collection("athletes")
        .doc(temperoryId)
        .get()
        .then(function (snap) {
          setUserData({
            id: temperoryId,
            data: snap.data(),
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } else {
      setEditable(true);
      db.collection("athletes")
        .where("email", "==", user)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            setUserData({
              id: doc.id,
              data: doc.data(),
            });
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  }, [user, temperoryId]);

  useEffect(() => {
    if (userData) {
      db.collection("athletes")
        .doc(userData?.id)
        .collection("Anthropometric")
        .doc("anthropometric")
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            setHeight(doc.data().height);
            setWeight(doc.data().weight);
            setFat(doc.data().fat);
            setMuscle(doc.data().muscle);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((e) => console.log(e));
    }
  }, [userData?.id]);

  const saveDetails = () => {
    if (route?.params?.setAddDetails) {
      route.params.setAddDetails(true);
    }
    db.collection("athletes")
      .doc(userData?.id)
      .collection("Anthropometric")
      .get()
      .then((snap) => {
        if (!snap.empty) {
          console.log("1");
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Anthropometric")
            .doc("anthropometric")
            .update({
              height,
              weight,
              fat,
              muscle,
            })
            .then((res) => {})
            .catch((e) => console.log(e));
        } else {
          console.log("2");
          console.log(height + " " + weight);
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Anthropometric")
            .doc("anthropometric")
            .set({
              height,
              weight,
              fat,
              muscle,
            })
            .then((res) => {})
            .catch((e) => console.log(e));
        }
      });
    console.log(height, weight, fat, muscle);
    setEditable(false);
  };
  return (
    <div
      className="athleteMeasurements"
      style={{
        minHeight: "99.99vh",
      }}
    >
      <div className="athleteProfile__leftContainer">
        <Header Id={temperoryId} />
        <h2>Anthropometric Measurements</h2>
        <div className="athleteMeasurements__container">
          <form>
            <h4>Height*</h4>
            <input
              readOnly={!editable}
              defaultValue={userData?.data?.height}
              value={height}
              onChange={(e) => {
                setHeight(e.target.value);
              }}
              type="text"
              placeholder="Enter Height"
            />
            <h4>Weight*</h4>
            <input
              readOnly={!editable}
              defaultValue={userData?.data?.weight}
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
              }}
              type="text"
              placeholder="Enter Weight"
            />
            <h4>Fat Percentage</h4>
            <input
              readOnly={!editable}
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
              readOnly={!editable}
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
          {userType !== "coach" &&
            (!editable ? (
              <div
                className="editProfileButton"
                onClick={() => setEditable(true)}
              >
                <h3>EDIT PROFILE</h3>
              </div>
            ) : (
              <div className="saveProfileButton" onClick={() => saveDetails()}>
                <h3>SAVE PROFILE</h3>
              </div>
            ))}{" "}
        </div>
      </div>
    </div>
  );
}

export default AthleteMeasurements;
