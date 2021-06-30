import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTemperoryId,
  selectUser,
  selectUserType,
  setTemperoryData,
} from "../../features/userSlice";
import { db } from "../../utils/firebase";
import "./Profile.css";

function AthleteProfileForm() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");
  const [gender, setgender] = useState("");
  const [address, setaddress] = useState("");
  const [dob, setdob] = useState("");
  const [editable, seteditable] = useState(false);
  const [userData, setUserData] = useState(null);
  const [nutrition, setNutrition] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [pastWorkouts, setPastWorkouts] = useState([]);
  const [diet, setDiet] = useState("");
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [protein, setProtein] = useState(0);
  const [calories, setCalories] = useState(0);
  const [weight, setWeight] = useState(0);
  const [mealHistory, setMealHistory] = useState([]);

  useEffect(() => {
    if (protein != 0 && carbs != 0 && fat != 0) {
      setCalories(
        String(4 * Number(protein) + 4 * Number(carbs) + 9 * Number(fat))
      );
    }
  }, [fat, protein, carbs]);

  const ChangeDiet = (diet) => {
    if (weight && weight != 0) {
      if (diet == "weight maintainance") {
        setCalories(
          String(4 * 1.5 * weight + 4 * 3.5 * weight + 9 * 1 * weight)
        );
        setCarbs(String(3.5 * weight));
        setFat(String(1 * weight));
        setProtein(String(1.5 * weight));
      } else if (diet == "high performance") {
        setCalories(
          String(4 * 1.5 * weight + 4 * 6 * weight + 0.8 * 9 * weight)
        );
        setCarbs(String(6 * weight));
        setFat(String(0.8 * weight));
        setProtein(String(1.5 * weight));
      } else if (diet == "fat loss") {
        setCalories(String(4 * 2 * weight + 4 * 3 * weight + 1 * 9 * weight));
        setCarbs(String(2 * weight));
        setFat(String(1 * weight));
        setProtein(String(2 * weight));
      }
    }
  };

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
          setphone(snap.data().phone);
          setemail(snap.data().email);
          setgender(snap.data().gender);
          setaddress(snap.data().address);
          setDiet(
            snap.data()?.diet ? snap.data().diet.name : "weight maintainance"
          );
          setCarbs(snap?.data()?.diet ? snap.data().diet.carbs : "300");
          setFat(snap.data()?.diet ? snap.data().diet.fat : "50");
          setProtein(snap.data()?.diet ? snap.data().diet.protein : "70");
          setCalories(snap?.data()?.diet ? snap.data().diet.calories : "1930");
          setWeight(snap?.data()?.weight ? snap.data().weight : "80");
          dispatch(
            setTemperoryData({
              id: temperoryId,
              data: snap.data(),
            })
          );

          ChangeDiet();
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } else {
      db.collection("athletes")
        .where("email", "==", user)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            setUserData({
              id: doc.id,
              data: doc.data(),
            });
            setphone(doc.data().phone);
            setemail(doc.data().email);
            setgender(doc.data().gender);
            setaddress(doc.data().address);
            setDiet(
              doc.data()?.diet?.name
                ? doc.data().diet.name
                : "weight maintainance"
            );
            setCarbs(doc?.data()?.diet?.carbs ? doc.data().diet.carbs : "300");
            setFat(doc.data()?.diet?.fat ? doc.data().diet.fat : "60");
            setProtein(
              doc.data()?.diet?.protein ? doc.data().diet.protein : "100"
            );
            setCalories(
              doc?.data()?.diet?.calories ? doc.data().diet.calories : "2140"
            );
            setWeight(doc?.data()?.weight ? doc.data().weight : "80");
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  }, [user, temperoryId]);

  useEffect(() => {
    let temp = [];

    if (temperoryId) {
      db.collection("AthleteNutrition")
        .doc(temperoryId)
        .collection("nutrition")
        .limit(1)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.data().entireFood) {
              let tempCal = 0;
              let tempCarbs = 0;
              let tempFat = 0;
              let tempProtein = 0;
              //setEntireFood(doc.data().entireFood);
              doc.data().entireFood.map((foodContainer) => {
                foodContainer.food.map((f) => {
                  tempCal = tempCal + f.calories;
                  tempCarbs = tempCarbs + f.carbs;
                  tempFat = tempFat + f.fat;
                  tempProtein = tempProtein + f.proteins;
                });
              });
              let t = { ...doc.data() };
              t.calories = tempCal;
              t.carbs = tempCarbs;
              t.fat = tempFat;
              t.proteins = tempProtein;
              temp.push({ id: doc.id, data: t });
            }
          });
          setMealHistory(temp);
        });
    }
  }, [temperoryId]);

  const saveprofile = () => {
    const dob1 = dob.split("-").reverse().join("-");
    db.collection("athletes")
      .doc(userData?.id)
      .update({
        phone,
        email,
        gender,
        address,
        dob: dob1,
        diet: {
          name: diet,
          carbs,
          fat,
          calories,
          protein,
        },
      })
      .then((res) => seteditable(false))
      .catch((e) => console.log(e));
  };

  console.log(editable);
  return (
    <div className="coachProfileForm">
      <div className="coachProfile__info">
        <div className="coachProfile__heading">
          <h2>Profile</h2>
        </div>
        {userType !== "coach" &&
          (!editable ? (
            <div
              className="editProfileButton"
              onClick={() => seteditable(true)}
            >
              <h3>EDIT PROFILE</h3>
            </div>
          ) : (
            <div className="saveProfileButton" onClick={() => saveprofile()}>
              <h3>SAVE PROFILE</h3>
            </div>
          ))}{" "}
      </div>
      <form>
        <h4>Mobile Number</h4>
        <input
          readOnly={!editable}
          onChange={(e) => {
            setphone(e.target.value);
          }}
          value={phone}
          type="text"
          placeholder="+91 56985 45955"
        />
        <h4>Email ID</h4>
        <input
          readOnly={!editable}
          onChange={(e) => {
            setemail(e.target.value);
          }}
          value={email}
          type="email"
          placeholder="anishchandra@gmail.com"
        />
        <h4>Gender</h4>
        <input
          readOnly={!editable}
          onChange={(e) => {
            setgender(e.target.value);
          }}
          value={gender}
          type="text"
          placeholder="Enter Gender"
        />
        <h4>Date of Birth</h4>
        <input
          onChange={(e) => {
            setdob(e.target.value);
          }}
          readOnly={!editable}
          type="date"
          placeholder="Enter Date of Birth"
        />
        <h4>Billing Address</h4>
        <textarea
          readOnly={!editable}
          onChange={(e) => {
            setaddress(e.target.value);
          }}
          value={address}
          type="text"
          placeholder="300, Baneerghatta Main Rd, opp to Apollo Hospitals, Sundar Ram Shetty Nagar, Bilekahali, Bengaluru, Karnataka - 560076"
        />
      </form>
      <div className="coachProfileForm__Button">Upload File</div>
    </div>
  );
}
export default AthleteProfileForm;
