import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Notification from "../../Components/Notifications/Notification";
import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
} from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { Icon } from "@material-ui/core";
import CoachAssessment from "./AthleteAssessment";
import CoachProfileForm from "./CoachProfileForm";
import Header from "../../Components/Header/Header";
import "./Profile.css";
import firebase from "firebase";
import { useHistory, useLocation } from "react-router-dom";
import moment from "moment";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import DatePicker from "react-datepicker";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginBottom: 0,
//     padding: 20,
//     minHeight: "99vh",
//   },
//   athlete_card: {
//     width: 200,
//     height: 20,
//     backgroundColor: "#2E2E2E",
//     // borderWidth: 1,
//     // borderColor: "white",
//     borderRadius: 20,
//     marginVertical: 20,
//     padding: 20,
//   },
//   athlete_cardHeader: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 20,
//     marginVertical: 20,
//   },
//   athlete_img: {
//     marginHorizontal: 20,
//     width: 50,
//     height: 50,
//     borderRadius: 100,
//     backgroundColor: "white",
//     marginRight: 20,
//     marginTop: 0,
//   },
//   athlete_name: {
//     fontSize: 20,
//     color: "white",
//     margin: 20,
//     marginBottom: 20,
//   },
//   athlete__cardBody: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginHorizontal: 20,
//   },
//   share: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//   },
// });

function InviteScreen({ route, navigation }) {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(null);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("DD-MM-YYYY")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(30, "days").format("DD-MM-YYYY")
  );
  const [frequency, setFrequency] = useState("once in a week");
  const [followUpFrequency, setFollowUpFrequency] = useState("once in a week");
  const [diet, setDiet] = useState("");
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [protein, setProtein] = useState(0);
  const [calories, setCalories] = useState(0);
  const [weight, setWeight] = useState(0);
  const [athleteData, setAtheleteData] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const [data, setdata] = useState(location?.state?.data);

  useEffect(() => {
    if (data) {
      db.collection("athletes")
        .doc(data.athlete)
        .get()
        .then((snap) => {
          if (snap.data().diet) {
            setDiet(snap.data().diet.name);
            setCarbs(snap.data().diet.carbs);
            setFat(snap.data().diet.fat);
            setProtein(snap.data().diet.protein);
            setCalories(snap.data().diet.calories);
            setWeight(snap.data().weight);
            setAtheleteData(snap.data());
          }
        });
    }
  }, [data]);

  const decline = () => {
    if (window.confirm("Confirm decline request")) {
      db.collection("declinedInvites")
        .add(data)
        .then((id) => {
          db.collection("invites")
            .doc(location?.state.id)
            .delete()
            .catch(function (error) {
              console.log("Error getting documents: ", error);
            });
          history.push("/all-athletes");
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });

      history.push("/all-athletes");
    }

    // alert(
    //   "Wellzap",
    //   "Confirm decline request",
    //   [
    //     {
    //       text: "yes",
    //       onClick: () => {
    //         db.collection("declinedInvites")
    //           .add(data)
    //           .then((id) => {
    //             db.collection("invites")
    //               .doc(location?.state.id)
    //               .delete()
    //               .catch(function (error) {
    //                 console.log("Error getting documents: ", error);
    //               });
    //             navigation.navigate("Athletes");
    //           })
    //           .catch(function (error) {
    //             console.log("Error getting documents: ", error);
    //           });
    //       },
    //     },
    //     {
    //       text: "no",
    //       onClick: () => {},
    //     },
    //   ],
    //   { cancelable: false }
    // );
  };

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
    if (protein != 0 && carbs != 0 && fat != 0) {
      setCalories(
        String(4 * Number(protein) + 4 * Number(carbs) + 9 * Number(fat))
      );
    }
  }, [fat, protein, carbs]);

  const accept = async () => {
    if (!amount) {
      alert("Wellzap Please enter the amount!");
    } else {
      db.collection("athletes")
        .doc(data.athlete)
        .update({
          listOfCoaches: [data.coach],
          payments: {
            amount: amount,
            frequency: frequency,
          },
          startDate,
          endDate,
          followUpFrequency,
          verified: true,
          diet: {
            name: diet,
            carbs,
            protein,
            fat,
            calories,
          },
        })
        .then((id) => {
          db.collection("coaches")
            .doc(data.coach)
            .update({
              listOfAthletes: firebase.firestore.FieldValue.arrayUnion(
                data.athlete
              ),
            })
            .then(async () => {
              navigation.navigate("Athletes");
              dispatch(
                setUserData({
                  data: {
                    ...userData.data,
                    listOfAthletes: [
                      ...userData.data.listOfAthletes,
                      data.athlete,
                    ],
                  },
                  id: userData?.id,
                })
              );

              var days;
              if (followUpFrequency == "once in a week") {
                days = 7;
              } else if (followUpFrequency == "once in 2 weeks") {
                days = 14;
              } else if (followUpFrequency == "once in a month") {
                days = 30;
              } else {
                days = 90;
              }
              var Difference_In_Time =
                moment(endDate, "DD-MM-YYYY").valueOf() -
                moment(startDate, "DD-MM-YYYY").valueOf();
              var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
              for (var i = days; i < Difference_In_Days; i = i + days) {
                var temp_date = new Date(moment(new Date()).add(i, "days"));
                temp_date = new Date(
                  temp_date.getFullYear(),
                  temp_date.getMonth(),
                  temp_date.getDate(),
                  17,
                  0,
                  0,
                  0
                );
                const newCityRef = db.collection("events").doc();
                const res = await newCityRef.set({
                  name: "Follow up with " + data.name,
                  date: firebase.firestore.Timestamp.fromDate(
                    new Date(temp_date)
                  ),
                  description: "routine followup",
                  athletes: [data.athlete],
                  coachID: userData?.id,
                  showVideoLink: true,
                  videolink: userData?.data?.videolink,
                });
              }

              if (frequency == "once in a week") {
                days = 7;
              } else if (frequency == "once in 2 weeks") {
                days = 14;
              } else if (frequency == "once in a month") {
                days = 30;
              } else {
                days = 90;
              }
              Difference_In_Time =
                moment(endDate, "DD-MM-YYYY").valueOf() -
                moment(startDate, "DD-MM-YYYY").valueOf();
              Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
              for (var i = days; i < Difference_In_Days; i = i + days) {
                var temp_date = new Date(moment(new Date()).add(i, "days"));
                temp_date = new Date(
                  temp_date.getFullYear(),
                  temp_date.getMonth(),
                  temp_date.getDate(),
                  17,
                  0,
                  0,
                  0
                );
                const newCityRef = db.collection("payments").doc();
                const res = await newCityRef.set({
                  athleteName: athleteData.name,
                  date: firebase.firestore.Timestamp.fromDate(
                    new Date(temp_date)
                  ),
                  athlete: data.athlete,
                  coach: userData?.id,
                  amt: amount,
                  status: "not paid",
                });
              }
            })
            .catch(function (error) {
              console.log("Error getting documents: ", error);
            });

          db.collection("invites")
            .doc(location?.state.id)
            .delete()
            .catch(function (error) {
              console.log("Error getting documents: ", error);
            });
          alert("done");
          history.push("/all-athletes");
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  };

  return (
    <div
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: "#F6F6F6",
        padding: 0,
        backgroundColor: "#F6F6F6",
        paddingBottom: 20,
      }}
      contentContainerStyle={{}}
    >
      <div
        style={{
          flexDirection: "row",
          padding: 20,
          paddingBottom: 0,
          display: "flex",
        }}
      >
        <div onClick={() => navigation.goBack()}>
          <Icon
            name="chevron-left"
            size={24}
            style={{ marginRight: 20 }}
            type="font-awesome-5"
          />
        </div>
        <Icon
          name="bars"
          type="font-awesome-5"
          size={24}
          onClick={() => navigation.toggleDrawer()}
        />
      </div>

      <div
        style={{
          padding: 20,
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <img
            url={data?.imgUrl}
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
              alignSelf: "center",
            }}
          />
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "black",
              marginTop: 10,
            }}
          >
            {data.name}
            <br />
            <div
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "black",
                marginTop: 5,
              }}
            >
              Athlete
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          paddingLeft: 20,
          borderRadius: 20,
          marginTop: 20,

          marginHorizontal: 20,
        }}
      >
        <div
          style={{
            fontSize: 20,
            marginBottom: 20,
            color: "black",
          }}
        >
          Mobile Number
        </div>
        <input
          style={{
            backgroundColor: "white",
            borderRadius: 5,
            paddingLeft: 20,
            borderWidth: 1,
            borderColor: "black",
            padding: "5px 10px",
            fontSize: 17,
            width: "97%",
            backgroundColor: "white",
          }}
          value={data.phone}
          placeholder="Phone Numer"
          editable={false}
        />
      </div>

      <div
        style={{
          paddingLeft: 20,
          borderRadius: 20,
          marginTop: 20,
          paddingBottom: 20,
          marginHorizontal: 20,
        }}
      >
        <div
          style={{
            fontSize: 20,
            marginBottom: 20,
            color: "black",
          }}
        >
          Email ID
        </div>
        <input
          style={{
            backgroundColor: "white",
            borderRadius: 5,
            paddingLeft: 20,
            borderWidth: 1,
            borderColor: "black",
            padding: "5px 10px",
            width: "97%",
            fontSize: 17,
            backgroundColor: "white",
          }}
          value={data.email}
          placeholder="Email ID"
          editable={false}
        />
      </div>

      <div
        style={{
          padding: 20,
          borderRadius: 20,
          marginTop: 20,
          paddingBottom: 20,
          marginHorizontal: 20,
        }}
      >
        <div style={{ color: "black", marginBottom: 20, fontSize: 18 }}>
          Diet Options
        </div>

        <div
          style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
        >
          {/* {Platform.OS === "ios" ? (
            <RNPickerSelect
              value={diet}
              style={{ paddingVertical: 5 }}
              onValueChange={(itemValue, itemIndex) => {
                setDiet(itemValue);
                ChangeDiet(itemValue);
              }}
              items={[
                { label: "Weight Maintainance", value: "Weight Maintainance" },
                { label: "High Performance", value: "High Performance" },
                { label: "Fat loss", value: "Fat loss" },
              ]}
            />
          ) : (
            <Picker
              selectedValue={diet}
              style={{
                marginBottom: 20,
                width: "100%",
              }}
              onValueChange={(itemValue, itemIndex) => {
                setDiet(itemValue);
                ChangeDiet(itemValue);
              }}
            >
              <Picker.Item
                label="Weight Maintainance"
                value="weight maintainance"
              />
              <Picker.Item label="High Performance" value="high performance" />
              <Picker.Item label="Fat loss" value="fat loss" />
            </Picker>
          )} */}
        </div>

        <div
          style={{
            display: "flex",

            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <label> Carbs</label>
          <input
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              borderWidth: 1,
              fontSize: 17,
              width: "40%",
              padding: "5px 10px",
            }}
            theme={{
              colors: {
                primary: "rgba(0,0,0,0.7)",
                underlineColor: "transparent",
              },
            }}
            label="Carbs"
            mode={"outlined"}
            value={String(carbs)}
            onChange={(text) => {
              setCarbs(text.target.value);
            }}
          />
          <label> Protein</label>

          <input
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              fontSize: 17,
              width: "40%",
              padding: "5px 10px",
            }}
            theme={{
              colors: {
                primary: "rgba(0,0,0,0.7)",
                underlineColor: "transparent",
              },
            }}
            label="Protein"
            mode={"outlined"}
            value={String(protein)}
            onChange={(text) => {
              setProtein(text.target.value);
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 15,
          }}
        >
          <label> Fats</label>

          <input
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              fontSize: 17,
              width: "40%",
              padding: "5px 10px",
            }}
            theme={{
              colors: {
                primary: "rgba(0,0,0,0.7)",
                underlineColor: "transparent",
              },
            }}
            label="Fats"
            mode={"outlined"}
            value={String(fat)}
            onChange={(text) => {
              setFat(text.target.value);
            }}
          />
          <label> Calories</label>

          <input
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              fontSize: 17,
              width: "40%",
              padding: "5px 10px",
            }}
            theme={{
              colors: {
                primary: "rgba(0,0,0,0)",
                underlineColor: "transparent",
                text: "#C7C7CD",
              },
            }}
            label="Calories"
            mode={"outlined"}
            value={String(calories)}
            editable={false}
          />
        </div>
      </div>

      <div
        style={{
          padding: 20,
          borderRadius: 20,
          marginTop: 20,
          paddingBottom: 20,
          marginHorizontal: 20,
        }}
      >
        <div
          style={{
            fontSize: 17,
            marginBottom: 20,
            fontWeight: "bold",
            color: "black",
          }}
        >
          Payment
        </div>
        <div
          style={{
            fontSize: 17,
            marginBottom: 20,
            color: "black",
          }}
        >
          Amount
        </div>
        <input
          style={{
            backgroundColor: "white",
            borderRadius: 5,
            paddingLeft: 20,
            borderWidth: 0.5,
            borderColor: "black",
            padding: "5px 10px",
            fontSize: 17,
          }}
          value={amount}
          placeholder="Enter Amount"
          onChange={(text) => {
            setAmount(text.target.value);
          }}
          keyboardType={"numeric"}
        />

        <div
          style={{
            fontSize: 17,
            marginBottom: 20,
            marginTop: 20,
            color: "black",
          }}
        >
          Frequency of Payment
        </div>

        <div style={{}}>
          <Dropdown
            options={[
              { label: "Once in a week", value: "Once in a week" },
              { label: "Once in 2 weeks", value: "Once in 2 weeks" },
              { label: "Once in a month", value: "Once in a month" },
              { label: "Once in 3 month", value: "Once in 3 month" },
            ]}
            placeholder="Select frequency of payment"
            onChange={(item) => {
              setFrequency(item);
            }}
            value={frequency}
          />
        </div>
        {/* {Platform.OS === "ios" ? (
          <RNPickerSelect
            value={frequency}
            style={{ paddingVertical: 5 }}
            onValueChange={(itemValue, itemIndex) => {
              setFrequency(itemValue);
            }}
            items={[
              { label: "Once in a week", value: "Once in a week" },
              { label: "Once in 2 weeks", value: "Once in 2 weeks" },
              { label: "Once in a month", value: "Once in a month" },
              { label: "Once in 3 month", value: "Once in 3 month" },
            ]}
          />
        ) : (
          <Picker
            selectedValue={frequency}
            onValueChange={(itemValue, itemIndex) => {
              setFrequency(itemValue);
            }}
          >
            <Picker.Item label="Once in a week" value="once in a week" />
            <Picker.Item label="Once in 2 weeks" value="once in 2 weeks" />
            <Picker.Item label="Once in a month" value="once in a month" />
            <Picker.Item label="Once in 3 months" value="once in 3 months" />
          </Picker>
        )} */}
      </div>

      <div
        style={{
          borderRadius: 20,

          paddingBottom: 20,
          marginHorizontal: 20,
          marginLeft: 20,
        }}
      >
        <div
          style={{
            fontSize: 17,
            marginBottom: 20,

            color: "black",
          }}
        >
          Frequency of Followup
        </div>

        {/* {Platform.OS === "ios" ? (
          <RNPickerSelect
            style={{ paddingVertical: 5 }}
            value={followUpFrequency}
            onValueChange={(itemValue, itemIndex) => {
              setFollowUpFrequency(itemValue);
            }}
            items={[
              { label: "Once in a week", value: "Once in a week" },
              { label: "Once in 2 weeks", value: "Once in 2 weeks" },
              { label: "Once in a month", value: "Once in a month" },
              { label: "Once in 3 month", value: "Once in 3 month" },
            ]}
          />
        ) : (
          <Picker
            selectedValue={followUpFrequency}
            onValueChange={(itemValue, itemIndex) => {
              setFollowUpFrequency(itemValue);
            }}
          >
            <Picker.Item label="Once in a week" value="once in a week" />
            <Picker.Item label="Once in 2 weeks" value="once in 2 weeks" />
            <Picker.Item label="Once in a month" value="once in a month" />
            <Picker.Item label="Once in 3 months" value="once in 3 months" />
          </Picker>
        )} */}

        <div style={{}}>
          <Dropdown
            options={[
              { label: "Once in a week", value: "Once in a week" },
              { label: "Once in 2 weeks", value: "Once in 2 weeks" },
              { label: "Once in a month", value: "Once in a month" },
              { label: "Once in 3 month", value: "Once in 3 month" },
            ]}
            placeholder="Select frequency of Followup"
            onChange={(item) => {
              setFollowUpFrequency(item);
            }}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 15,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>

        <div
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            display: "flex",
          }}
        >
          <div style={{ width: "40%", alignItems: "center", display: "flex" }}>
            <div
              style={{
                fontSize: 20,
                color: "black",
              }}
            >
              Start Date
            </div>
            <DatePicker
              style={{
                padding: 20,
              }}
              selected={new Date(moment(startDate, "DD-MM-YYYY"))}
              onChange={(date) => setStartDate(date)}
            />
          </div>

          <div style={{ width: "40%", alignItems: "center", display: "flex" }}>
            <div
              style={{
                fontSize: 20,

                color: "black",
              }}
            >
              End Date
            </div>
            <DatePicker
              selected={new Date(moment(endDate, "DD-MM-YYYY"))}
              minDate={new Date(moment(startDate, "DD-MM-YYYY"))}
              onChange={(date) => setEndDate(date)}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          marginBottom: 40,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
            marginTop: 20,
            marginLeft: 20,
          }}
        >
          Invite Request
        </div>
        <div
          style={{
            flexDirection: "row",
            marginTop: 20,
            marginLeft: 20,
            display: "flex",
          }}
        >
          <div
            onClick={() => decline()}
            style={{
              backgroundColor: "#808080",
              borderRadius: 10,
              padding: 10,
              width: 120,
              textAlign: "center",
            }}
          >
            <div style={{ color: "black", fontWeight: "bold" }}>DECLINE</div>
          </div>
          <div
            onClick={() => accept()}
            style={{
              backgroundColor: "#ffe486",
              borderRadius: 10,
              padding: 10,
              width: 120,
              textAlign: "center",
              marginLeft: 100,
            }}
          >
            <div style={{ color: "black", fontWeight: "bold" }}>ACCEPT</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InviteScreen;
