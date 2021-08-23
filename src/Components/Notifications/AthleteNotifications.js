import React from "react";
import "./Notification.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
} from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { ChevronRightRounded } from "@material-ui/icons";

function AthleteNotifications({ route }) {
  const userData = useSelector(selectUserData);
  const [readMessages, setReadMessages] = React.useState([]);
  const [unreadMessages, setUnreadMessages] = React.useState([]);
  const [switchScreen, setSwitchScreen] = React.useState(false);
  const [show, setshow] = React.useState(false);

  React.useEffect(() => {
    if (userData) {
      let temp1 = [];
      let temp2 = [];
      db.collection("AthleteNotifications")
        .doc(userData.id)
        .collection("notifications")
        .where("seen", "==", false)
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            let currentID = doc.id;
            let appObj = { ...doc.data(), ["id"]: currentID };
            temp1.push(appObj);
          });
          setUnreadMessages(temp1);
        });
      db.collection("AthleteNotifications")
        .doc(userData.id)
        .collection("notifications")
        .where("seen", "==", true)
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            let currentID = doc.id;
            let appObj = { ...doc.data(), ["id"]: currentID };
            temp2.push(appObj);
          });
          setReadMessages(temp2);
        });
    }
  }, [userData?.id]);

  const getData = () => {
    let temp1 = [];
    let temp2 = [];
    db.collection("AthleteNotifications")
      .doc(userData.id)
      .collection("notifications")
      .where("seen", "==", false)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          let currentID = doc.id;
          let appObj = { ...doc.data(), ["id"]: currentID };
          temp1.push(appObj);
        });
        setUnreadMessages(temp1);
      });
    db.collection("AthleteNotifications")
      .doc(userData.id)
      .collection("notifications")
      .where("seen", "==", true)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          let currentID = doc.id;
          let appObj = { ...doc.data(), ["id"]: currentID };
          temp2.push(appObj);
        });
        setReadMessages(temp2);
      });
  };
  return (
    <div style={{ flex: 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          justifyContent: "space-between",
          marginLeft: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <h3>Notifications</h3>
          <div
            onClick={() => {
              setshow(!show);
            }}
            style={{
              transform: show ? "rotate(90deg)" : "rotate(180deg)",
              transition: "transform 0.2s",
              marginTop: 5,
              position: "absolute",
              right: 10,
            }}
            // class="arrow-right"
          >
            <ChevronRightRounded style={{ height: 30, width: 30 }} />
          </div>
        </div>
        {switchScreen === false && (
          <div
            style={{
              borderColor: "#d3d3d3",
              borderwidth: 1,
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={() => {
              db.collection("AthleteNotifications")
                .doc(userData.id)
                .collection("notifications")
                .get()
                .then(function (querySnapshot) {
                  var batch = db.batch();

                  querySnapshot.forEach(function (doc) {
                    // For each doc, add a delete operation to the batch
                    batch.update(doc.ref, "seen", true);
                    // batch.update(doc.ref);
                  });

                  // Commit the batch
                  return batch.commit();
                })
                .then(function () {
                  // Delete completed!
                  // ...
                  getData();
                });

              // const batch = db.batch()

              // .onSnapshot(function(querySnapshot) {
              //     querySnapshot.forEach(function(doc) {
              //         doc.ref.update({
              //             seen: true
              //         });
              //     });
              // });
            }}
          >
            {show ? (
              <h3
                style={{
                  textAlign: "left",
                  marginRight: 30,
                  transition: "all 0.1s",
                  width: 150,
                  fontWeight: "normal",
                  fontSize: 15,
                  transition: "all 0.1s",
                  padding: 5,
                  marginTop: 20,
                }}
              >
                Mark All as Read
              </h3>
            ) : (
              <h3
                style={{
                  textAlign: "center",
                  marginRight: 30,
                  transition: "all 0.1s",
                  padding: 5,
                  borderRadius: 10,
                  marginTop: 20,
                  display: unreadMessages.length > 0 ? "block" : "none",
                  fontWeight: "normal",
                  transition: "all 0.1s",

                  fontSize: 15,
                  width: 150,
                }}
              >
                {unreadMessages.length > 0 && `${unreadMessages.length} unread`}
              </h3>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          overflow: "hidden",
          height: show ? 300 : 0,
          transition: "all 0.5s",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <div
            style={{
              backgroundColor: switchScreen === false ? "#ffe486" : "#fff",
              borderRadius: 5,
              paddingHorizontal: 4,
              paddingVertical: 8,
              cursor: "pointer",
            }}
            onClick={() => setSwitchScreen(false)}
          >
            <p style={{ fontWeight: "700", margin: 0, padding: 5 }}>
              Unread Notifications
            </p>
          </div>
          <div
            style={{
              backgroundColor: switchScreen === true ? "#ffe486" : "#fff",
              borderRadius: 5,
              paddingHorizontal: 4,
              paddingVertical: 8,
              cursor: "pointer",
            }}
            onClick={() => setSwitchScreen(true)}
          >
            <p style={{ fontWeight: "700", margin: 0, padding: 5 }}>
              Read Notifications
            </p>
          </div>
        </div>
        <div
          style={{
            margin: 10,
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "auto",
            height: 300,
          }}
        >
          {switchScreen === false
            ? unreadMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    margin: 10,
                    marginLeft: 10,
                    borderRadius: 5,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 14 }}>{msg.message}</p>
                  <p style={{ textAlign: "right", margin: 0, fontSize: 13 }}>
                    {msg.timestamp.toDate().toDateString() +
                      " at " +
                      msg.timestamp.toDate().toLocaleTimeString()}
                  </p>
                </div>
              ))
            : readMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    width: "95%",
                    margin: 10,
                    marginLeft: -5,
                    borderRadius: 5,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 14 }}>{msg.message}</p>
                  <p style={{ textAlign: "right", margin: 0, fontSize: 13 }}>
                    {msg.timestamp.toDate().toDateString() +
                      " at " +
                      msg.timestamp.toDate().toLocaleTimeString()}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default AthleteNotifications;
