import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CheckboxesGroups from "../../Components/Buttons/Checkboxs";
import Header from "../../Components/Header/Header";
import {
  selectTemperoryId,
  selectUser,
  selectUserType,
} from "../../features/userSlice";
import { db } from "../../utils/firebase";
import "./Profile.css";

function AthleteTrainingAssessment_coach({ route, navigation }) {
  const user = useSelector(selectUser);
  const [userData, setUserData] = useState(null);
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);
  const [editable, setEditable] = useState(false);
  const [trainingHours, setTrainingHours] = useState("");
  const [otherEquipments, setOtherEquipments] = useState("");
  var params = useParams();

  var Id = params.AthleteId;
  window.history.pushState(null, "", "/Athlete/training-assessment");

  const dispatch = useDispatch();

  const [daysList, setDaysList] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  const [color, changeColor] = useState([]);
  const [selectedDaysOfTraining, setSelectedDaysOfTraining] = useState([]);

  const [checkboxValues, setCheckboxValues] = useState([
    "Gym",
    "Kettlebells",
    "Cycle",
    "Weights",
    "Dumbells",
    "Resistance Bands",
    "Swimming Pool",
    "Other",
  ]);
  const [selected, setSelected] = useState([]);

  const isItemChecked = (abilityName) => {
    return selected.indexOf(abilityName) > -1;
  };

  const handleCheckBoxChange = (evt, abilityName) => {
    if (editable) {
      if (isItemChecked(abilityName)) {
        setSelected(selected.filter((i) => i !== abilityName));
      } else {
        setSelected([...selected, abilityName]);
      }
    }
  };

  useEffect(() => {
    if (userType === "coach") {
      db.collection("athletes")
        .doc(Id ? Id : 1)
        .get()
        .then(function (snap) {
          setUserData({
            id: Id,
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
  }, [user]);

  useEffect(() => {
    if (userData) {
      let temp1 = [];
      db.collection("athletes")
        .doc(userData?.id)
        .collection("Training")
        .doc("training")
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setTrainingHours(doc.data().trainingHours);
            setOtherEquipments(doc.data().equipments);
            setOtherEquipments(
              doc.data()?.otherEquipments ? doc.data().otherEquipments : ""
            );
            setSelectedDaysOfTraining(doc.data().selectedDaysOfTraining);
            daysList.map((item, idx) => {
              if (doc.data().selectedDaysOfTraining.includes(item)) {
                temp1.push(idx);
              }
            });
            changeColor(temp1);
          } else {
            console.log("No such document!");
          }
        })
        .catch((e) => console.log(e));
    }
  }, [userData?.id]);

  useEffect(() => {
    daysList.map((item, idx) => {
      if (!selectedDaysOfTraining.includes(item)) {
        if (color.includes(idx)) {
          console.log("Adding...");
          setSelectedDaysOfTraining([...selectedDaysOfTraining, item]);
        }
      }
    });
  }, [color]);
  console.log({ selectedDaysOfTraining, color });

  const saveDetails = () => {
    if (route?.params?.setAddDetails) {
      route.params.setAddDetails(true);
    }
    db.collection("athletes")
      .doc(userData?.id)
      .collection("Training")
      .get()
      .then((snap) => {
        if (!snap.empty) {
          db.collection("athletes")
            .doc(userData.id)
            .collection("Training")
            .doc("training")
            .update({
              trainingHours,
              selectedDaysOfTraining,
              equipments: selected,
              otherEquipments,
            })
            .then((res) => {})
            .catch((e) => console.log(e));
        } else {
          db.collection("athletes")
            .doc(userData.id)
            .collection("Training")
            .doc("training")
            .set({
              trainingHours,
              selectedDaysOfTraining,
              equipments: selected,
              otherEquipments,
            })
            .then((res) => {})
            .catch((e) => console.log(e));
        }
      });

    setEditable(false);
  };

  return (
    <div className="athleteTrainingAssessment">
      <Header Id={Id} />
      <h2>Training Assessment</h2>
      <h4>Select Days you wish to train</h4>
      <h5>Select days</h5>
      <div className="athleteTrainingAssessment__container">
        {daysList.map((day, idx) => (
          <div
            className="athleteTrainingAssessment__days"
            key={idx}
            onClick={() => {
              if (editable) {
                if (color.includes(idx)) {
                  var array = [...color];

                  var index = array.indexOf(idx);
                  if (index !== -1) {
                    array.splice(index, 1);

                    changeColor(array);
                  }
                  var list = selectedDaysOfTraining.filter(
                    (t) => t !== daysList[idx]
                  );
                  setSelectedDaysOfTraining(list);
                } else {
                  changeColor([...color, idx]);
                }
              }
            }}
            disabled={!editable}
            style={
              color.includes(idx)
                ? {
                    backgroundColor: "#fcd54a",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    textAlign: "center",
                    borderRadius: 10,
                    marginRight: 8,
                    marginBottom: 5,
                    height: 30,
                    width: 60,
                    fontWeight: 600,
                  }
                : {
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    textAlign: "center",
                    borderRadius: 10,
                    marginRight: 8,
                    marginBottom: 5,
                    height: 30,
                    width: 60,
                    fontWeight: 600,
                  }
            }
          >
            {day}
          </div>
        ))}
      </div>
      <h4>Training Hours per day</h4>
      <input
        style={
          editable
            ? {
                borderWidth: 1,
                borderColor: "grey",
                width: "97%",
                borderRadius: 5,
                padding: 15,
                marginLeft: 10,
              }
            : {
                borderColor: "grey",
                borderWidth: 0,
                width: "97%",
                borderRadius: 5,
                padding: 15,
                marginLeft: 10,
              }
        }
        readOnly={!editable}
        type="text"
        placeholder="No. of hours you wish to train per day"
        defaultValue={userData?.data?.trainingHours}
        value={trainingHours}
        onChange={(e) => setTrainingHours(e.target.value)}
      />
      <h4>Select equipment you have access to</h4>
      <div className="athleteTrainingAssessment__form">
        <div className="athleteTrainingAssessment__checkBox">
          <CheckboxesGroups
            label1="Gym"
            label2="Kettlebells"
            state={otherEquipments}
            setState={setOtherEquipments}
            editable={editable}
          />
          <CheckboxesGroups
            label1="Cycle"
            label2="Weights"
            state={otherEquipments}
            setState={setOtherEquipments}
            editable={editable}
          />
          <CheckboxesGroups
            label1="Dumbells"
            label2="Resistance Bands"
            state={otherEquipments}
            setState={setOtherEquipments}
            editable={editable}
          />
          <CheckboxesGroups
            label1="Swimming Pool"
            label2="Other"
            state={otherEquipments}
            setState={setOtherEquipments}
            editable={editable}
          />
        </div>
      </div>
      {userType !== "coach" &&
        (!editable ? (
          <div
            className="athleteTrainingAssessment__editProfileButton"
            onClick={() => setEditable(true)}
          >
            <h3>EDIT PROFILE</h3>
          </div>
        ) : (
          <div
            className="athleteTrainingAssessment__saveProfileButton"
            onClick={() => saveDetails()}
          >
            <h3>SAVE PROFILE</h3>
          </div>
        ))}{" "}
    </div>
  );
}

export default AthleteTrainingAssessment_coach;
