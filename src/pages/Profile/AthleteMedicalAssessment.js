import React, { useState, useEffect } from "react";
import "./Profile.css";
import FormControlLabelPlacement from "../../Components/Buttons/YesNoButton";
import { db } from "../../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTemperoryId,
  selectUser,
  selectUserType,
} from "../../features/userSlice";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import Notification from "../../Components/Notifications/Notification";
import CheckboxesGroups from "../../Components/Buttons/Checkboxs";

function AthleteMedicalAssessment({ route, navigation }) {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [heartCondition, setHeartCondition] = useState(false);
  const [chestPain, setChestPain] = useState(false);
  const [chestPain1, setChestPain1] = useState(false);
  const [dizziness, setDizziness] = useState(false);
  const [dizziness1, setDizziness1] = useState(false);
  const [jointProblem, setJointProblem] = useState(false);
  const [medicationForHeartProblem, setMedicationForHeartProblem] =
    useState(false);
  const [knowReason, setKnowReason] = useState(false);

  const [hadPain, setHadPain] = useState(false);
  const [applicableAreas, setApplicableAreas] = useState([
    "Ankle",
    "Knee",
    "Hip",
    "Back",
    "Shoulders",
    "Other",
  ]);
  const [selectedApplicableAreas, setSelectedApplicableAreas] = useState([]);
  const [hadSurgeries, setHadSurgeries] = useState(false);
  const [surgery, setSurgery] = useState("");
  const [chronicDisease, setChronicDisease] = useState(false);
  const [otherAilments, setOtherAilments] = useState("");
  const [otherPainAreas, setOtherPainAreas] = useState("");
  const [applicableAilments, setApplicableAilments] = useState([
    "Diabetes",
    "Hepatitis",
    "Pneumonia",
    "High Blood Pressure",
    "Low Blood Pressure",
    "Back/joint pains",
    "Kidney infection",
    "Heart murmur",
    "Heart Disease",
    "Other",
  ]);
  const [selectedApplicableAilments, setSelectedApplicableAilments] = useState(
    []
  );

  const [takingMedication, setTakingMedication] = useState(false);
  const [medicationDetails, setMedicationDetails] = useState("");

  const dispatch = useDispatch();

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
          console.log("23");
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
      db.collection("athletes")
        .doc(userData?.id)
        .collection("Medical")
        .doc("medical")
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            if (doc.data().heartCondition === "yes") {
              setHeartCondition("yes");
            } else {
              setHeartCondition("no");
            }
            if (doc.data().chestPain === "yes") {
              setChestPain("yes");
            } else {
              setChestPain("no");
            }
            if (doc.data().chestPain1 === "yes") {
              setChestPain1("yes");
            } else {
              setChestPain1("no");
            }
            if (doc.data().selectedApplicableAilments) {
              setSelectedApplicableAilments(
                doc.data().selectedApplicableAilments
              );
            } else {
              setSelectedApplicableAilments([]);
            }
            if (doc.data().selectedApplicableAreas) {
              setSelectedApplicableAreas(doc.data().selectedApplicableAreas);
            } else {
              setSelectedApplicableAreas([]);
            }

            if (doc.data().dizziness === "yes") {
              setDizziness("yes");
            } else {
              setDizziness("no");
            }
            if (doc.data().dizziness1 === "yes") {
              setDizziness1("yes");
            } else {
              setDizziness1("no");
            }
            if (doc.data().jointProblem === "yes") {
              setJointProblem("yes");
            } else {
              setJointProblem("no");
            }
            if (doc.data().medicationForHeartProblem === "yes") {
              setMedicationForHeartProblem("yes");
            } else {
              setMedicationForHeartProblem("no");
            }
            if (doc.data().knowReason === "yes") {
              setKnowReason("yes");
            } else {
              setKnowReason("no");
            }
            if (doc.data().hadPain === "yes") {
              setHadPain("yes");
            } else {
              setHadPain("no");
            }
            if (doc.data().hadSurgeries === "yes") {
              setHadSurgeries("yes");
            } else {
              setHadSurgeries("no");
            }
            setSurgery(doc.data().surgery);
            if (doc.data().chronicDisease === "yes") {
              setChronicDisease("yes");
            } else {
              setChronicDisease("no");
            }
            if (doc.data().takingMedication === "yes") {
              setTakingMedication("yes");
            } else {
              setTakingMedication("no");
            }
            setMedicationDetails(doc.data().medicationDetails);
            setOtherAilments(
              doc.data().otherAilments ? doc.data().otherAilments : ""
            );

            setOtherPainAreas(
              doc.data().otherPainAreas ? doc.data().otherPainAreas : ""
            );
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((e) => console.log(e));
    }
  }, [userData?.id]);

  const isItemChecked = (abilityName) => {
    return selectedApplicableAreas.indexOf(abilityName) > -1;
  };

  const isAilmentChecked = (abilityName) => {
    return selectedApplicableAilments.indexOf(abilityName) > -1;
  };

  const handleCheckBoxChange = (evt, abilityName) => {
    if (isItemChecked(abilityName)) {
      setSelectedApplicableAreas(
        selectedApplicableAreas.filter((i) => i !== abilityName)
      );
    } else {
      setSelectedApplicableAreas([...selectedApplicableAreas, abilityName]);
    }
  };

  const handleAilmentsCheckBoxChange = (evt, abilityName) => {
    if (isAilmentChecked(abilityName)) {
      setSelectedApplicableAilments(
        selectedApplicableAilments.filter((i) => i !== abilityName)
      );
    } else {
      setSelectedApplicableAilments([
        ...selectedApplicableAilments,
        abilityName,
      ]);
    }
  };

  const saveDetails = () => {
    if (route?.params?.setAddDetails) {
      route.params.setAddDetails(true);
    }
    db.collection("athletes")
      .doc(userData?.id)
      .collection("Medical")
      .get()
      .then((snap) => {
        if (!snap.empty) {
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Medical")
            .doc("medical")
            .update({
              heartCondition,
              chestPain,
              chestPain1,
              dizziness,
              dizziness1,
              jointProblem,
              medicationForHeartProblem,
              knowReason,
              hadPain,
              hadSurgeries,
              surgery,
              chronicDisease,
              otherAilments,
              otherPainAreas,
              takingMedication,
              medicationDetails,
              selectedApplicableAilments,
              selectedApplicableAreas,
            })
            .then((res) => {})
            .catch((e) => console.log(e));
        } else {
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Medical")
            .doc("medical")
            .set({
              heartCondition,
              chestPain,
              chestPain1,
              dizziness,
              dizziness1,
              jointProblem,
              medicationForHeartProblem,
              knowReason,
              hadPain,
              hadSurgeries,
              otherAilments,
              otherPainAreas,
              surgery,
              chronicDisease,
              takingMedication,
              medicationDetails,
              selectedApplicableAilments,
              selectedApplicableAreas,
            })
            .then((res) => {})
            .catch((e) => console.log(e));
        }
      });

    setEditable(false);
  };

  console.log(selectedApplicableAilments);

  return (
    <div className="AthleteMedicalAssessment">
      <div className="athleteProfile__container">
        <div className="athleteProfile__leftContainer">
          <Header Id={temperoryId} />
          <h2>Medical Assessment</h2>
          <div className="athleteMedicalAssessment__container">
            <form className="athleteMedicalAssessment__form">
              <p>
                Has your doctor ever said that you have a heart condition and
                that you should only perform physical activity recommended by a
                doctor?
              </p>
              <FormControlLabelPlacement
                value={heartCondition}
                setValue={setHeartCondition}
                editable={editable}
              />
              <p>
                Do you feel pain in your chest when you perform physical
                activity?
              </p>
              <FormControlLabelPlacement
                value={chestPain}
                setValue={setChestPain}
                editable={editable}
              />
              <p>
                {" "}
                In the past month, have you had chest pain when you were not
                performing any physical activity?
              </p>
              <FormControlLabelPlacement
                value={chestPain1}
                setValue={setChestPain1}
                editable={editable}
              />
              <p>
                Do you lose your balance because of dizziness or do you ever
                lose consciousness?
              </p>
              <FormControlLabelPlacement
                value={dizziness}
                setValue={setDizziness}
                editable={editable}
              />
              <p>
                Do you have a bone or joint problem that could be made worse by
                a change in your physical activity?
              </p>
              <FormControlLabelPlacement
                value={jointProblem}
                setValue={setJointProblem}
                editable={editable}
              />
              <p>
                Is your doctor currently prescribing any medication for your
                blood pressure or for a heart condition?
              </p>
              <FormControlLabelPlacement
                value={medicationForHeartProblem}
                setValue={setMedicationForHeartProblem}
                editable={editable}
              />
              <p>
                Do you know of any other reason why you should not engage in
                physical activity?
              </p>
              <FormControlLabelPlacement
                value={knowReason}
                setValue={setKnowReason}
                editable={editable}
              />
              <p>
                If you have answered “Yes” to one or more of the above
                questions, consult your physician before engaging in physical
                activity. Tell your physician which questions you answered “Yes”
                to. After a medical evaluation, seek advice from your physician
                on what type of activity is suitable for your current condition.
              </p>
              <p>Have you ever had any pain or injuries?</p>
              <FormControlLabelPlacement
                value={hadPain}
                setValue={setHadPain}
                editable={editable}
              />
              <p>Please select applicable areas</p>
              <div className="athleteMedicalAssessment__checkbox1">
                <CheckboxesGroups
                  label1="Ankle"
                  label2="Knee"
                  state={selectedApplicableAreas}
                  setState={setSelectedApplicableAreas}
                  editable={editable}
                />
                <CheckboxesGroups
                  label1="Shoulder"
                  label2="Hip"
                  state={selectedApplicableAreas}
                  setState={setSelectedApplicableAreas}
                  editable={editable}
                />
                <CheckboxesGroups
                  label1="Back"
                  label2="Other"
                  state={selectedApplicableAreas}
                  setState={setSelectedApplicableAreas}
                  editable={editable}
                />
              </div>
              <p>Have you ever had any surgeries?</p>
              <FormControlLabelPlacement
                value={hadSurgeries}
                setValue={setHadSurgeries}
                editable={editable}
              />
              <h4>Please Explain.</h4>
              <textarea
                readOnly={!editable}
                onChange={(e) => {
                  setSurgery(e.target.value);
                }}
                value={surgery}
                type="text"
                placeholder="Please provide additional details of your surgery."
              />
              <p>
                Has a medical doctor ever diagnosed you with a chronic disease?
              </p>
              <FormControlLabelPlacement
                value={chronicDisease}
                setValue={setChronicDisease}
                editable={editable}
              />
              <p>Please select applicable ailments</p>
              <div className="athleteMedicalAssessment__checkbox2">
                <CheckboxesGroups
                  label1="Diabetes"
                  label2="Pneumonia"
                  state={selectedApplicableAilments}
                  setState={setSelectedApplicableAilments}
                  editable={editable}
                />
                <CheckboxesGroups
                  state={selectedApplicableAilments}
                  setState={setSelectedApplicableAilments}
                  label1="Back/Joint pains"
                  label2="Hepatitis"
                  editable={editable}
                />
                <CheckboxesGroups
                  state={selectedApplicableAilments}
                  setState={setSelectedApplicableAilments}
                  label1="High Blood Pressure"
                  label2="Heart murmur"
                  editable={editable}
                />
                <CheckboxesGroups
                  state={selectedApplicableAilments}
                  setState={setSelectedApplicableAilments}
                  label1="Low Blood Pressure"
                  label2="Kidney Infection"
                  editable={editable}
                />
                <CheckboxesGroups
                  label1="Heart disease"
                  label2="Other"
                  state={selectedApplicableAilments}
                  setState={setSelectedApplicableAilments}
                  editable={editable}
                />
              </div>
              ;<p>Are you currently taking any medication?</p>
              <FormControlLabelPlacement
                value={takingMedication}
                setValue={setTakingMedication}
                editable={editable}
              />
              <p>Please Explain.</p>
              <textarea
                readOnly={!editable}
                onChange={(e) => {
                  setMedicationDetails(e.target.value);
                }}
                value={medicationDetails}
                type="text"
                placeholder="Please list any medication you are currently taking."
              />
              {userType !== "coach" &&
                (!editable ? (
                  <div
                    className="editProfileButton"
                    onClick={() => setEditable(true)}
                  >
                    <h3>EDIT PROFILE</h3>
                  </div>
                ) : (
                  <div
                    className="saveProfileButton"
                    onClick={() => saveDetails()}
                  >
                    <h3>SAVE PROFILE</h3>
                  </div>
                ))}{" "}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AthleteMedicalAssessment;
