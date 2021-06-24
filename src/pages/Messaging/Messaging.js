import React, { useState, useEffect } from "react";

import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";

import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { useHistory } from "react-router";
import "./Messaging.css";
import { Divider } from "@material-ui/core";
import { useLocation } from "react-router-dom";

function Messaging({ route, navigation }) {
  const userType = useSelector(selectUserType);
  const userData = useSelector(selectUserData);
  const [inputMessage, setInputMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [from_id, setfrom_id] = useState("");
  const [from_name, setfrom_name] = useState(route?.params?.from_name);
  const [to_id, setto_id] = useState("");
  const [to_name, setto_name] = useState(route?.params?.to_name);
  const [type, settype] = useState();
  const [coachDetails, setCoachDetails] = useState({});

  const [doc_id, setDoc_id] = useState(null);
  const [athleteData, setAthleteData] = useState({});
  const [listOfCoaches, setListOfCoaches] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setto_id(location.state?.to_id);
    setDoc_id(location.state?.id);
    setfrom_id(location.state?.from_id);
    setfrom_name(location.state?.from_name);
    setto_name(location.state?.to_name);
    settype(location.state?.type);
  }, [location]);

  useEffect(() => {
    if (userType == "athlete") {
      setfrom_id(userData?.data?.listOfCoaches[0]);
      setfrom_name(userData?.data?.name);
      setto_id(userData?.id);
      settype("athlete");
      db.collection("coaches")
        .doc(userData?.data?.listOfCoaches[0])
        .get()
        .then((snap) => {
          setCoachDetails(snap.data());
          setto_name(snap.data().name);
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
    console.log("1");
    if (from_id && to_id) {
      console.log("2");
      db.collection("chat")
        .where("from_id", "==", from_id)
        .where("to_id", "==", to_id)
        .onSnapshot((snap) => {
          console.log("3");
          if (!snap.empty) {
            snap.forEach(function (doc) {
              setDoc_id(doc.id);
            });
          } else {
            console.log("4");
            db.collection("chat").add({
              from_id: from_id,
              to_id: to_id,
            });

            setAllMessages([]);
          }
        });
      console.log("5");
      db.collection("athletes")
        .doc(from_id)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log("6");
            setListOfCoaches(doc.data().listOfCoaches);
          } else {
            console.log("No such document! gagan");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });

      db.collection("athletes")
        .doc(to_id)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setAthleteData(doc.data());
          } else {
            console.log("No such document! gagan");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    } else {
      setAllMessages([]);
    }
  }, [doc_id, from_id, to_id]);

  useEffect(() => {
    if (doc_id) {
      const unsubscribe = db
        .collection("chat")
        .doc(doc_id)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((querySnapshot) => {
          // Get all documents from collection - with IDs
          console.log("Loading the chat...");
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          setAllMessages(data);
        });

      return unsubscribe;
    } else {
      setAllMessages([]);
    }
  }, [db, doc_id]);

  const sendMessage = async () => {
    if (inputMessage !== "") {
      db.collection("chat")
        .where("from_id", "==", from_id)
        .where("to_id", "==", to_id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            setDoc_id(doc.id);

            if (type === "coach") {
              if (doc.id) {
                db.collection("chat")
                  .doc(doc.id)
                  .collection("messages")
                  .add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    message: inputMessage,
                    from_id: to_id,
                    from_name: to_name,
                  })
                  .catch((e) => console.log(e));
              }
            } else if (type === "athlete") {
              if (doc.id) {
                db.collection("chat")
                  .doc(doc.id)
                  .collection("messages")
                  .add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    message: inputMessage,
                    from_id: from_id,
                    from_name: from_name,
                  })
                  .catch((e) => console.log(e));
              }
            }
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });

      setInputMessage("");
    }
  };

  return (
    <div>
      <div style={{ flex: 9 }}>
        <div>
          <div
            style={{
              display: "flex",

              alignItems: "center",
              padding: "5px",
              borderBottomWidth: "1px",
              borderColor: "#707070",
            }}
          >
            <div
              className="messaging__leftArrow"
              onClick={() => {
                if (userType === "athlete") {
                  history.push("/");
                } else {
                  history.goBack();
                }
              }}
              style={{ marginLeft: "10px", marginRight: "10px" }}
            >
              <img src="/assets/left_arrow.png" alt="" />
            </div>
            <h3
              style={{
                color: "black",
                fontSize: "20px",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            >
              {to_name}
            </h3>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "140px", marginTop: "50px" }}>
        {allMessages?.map((msg) => (
          <div key={msg.id}>
            {type === "coach" ? (
              <div style={{ margin: "15px" }}>
                {msg.format && msg.format == "image" ? (
                  <img
                    src={msg.message}
                    style={
                      msg.from_id === to_id
                        ? {
                            backgroundColor: "black",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            borderRadius: "15px",
                            alignSelf: "flex-start",
                            color: "white",
                            fontSize: "18px",
                            borderBottomRightRadius: 0,
                            marginRight: "5px",
                            height: "200px",
                            width: "50px",
                          }
                        : {
                            borderRadius: 15,
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            alignSelf: "flex-end",
                            fontSize: "18px",
                            color: "#63697B",
                            borderBottomLeftRadius: 0,
                            marginLeft: "5px",
                            height: "200px",
                            width: "50px",
                          }
                    }
                  />
                ) : (
                  <h3
                    style={
                      msg.from_id === to_id
                        ? {
                            backgroundColor: "black",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            borderRadius: "15px",
                            alignSelf: "flex-end",
                            color: "white",
                            fontSize: "18px",
                            borderBottomRightRadius: 0,
                            marginRight: "5px",
                            marginLeft: "300px",
                            width: "50%",
                            fontWeight: "500",
                            textAlign: "end",
                          }
                        : {
                            backgroundColor: "#EAECF2",
                            borderRadius: 15,
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            alignSelf: "flex-start",
                            fontSize: "18px",
                            color: "#63697B",
                            borderBottomLeftRadius: 0,
                            marginLeft: "5px",
                            width: "50%",
                            fontWeight: "500",
                          }
                    }
                  >
                    {msg.message}
                  </h3>
                )}
                {/* <Text
                style={
                  msg.from_id === to_id
                    ? {
                        alignSelf: "flex-end",
                      }
                    : {
                        alignSelf: "flex-start",
                      }
                }
              >
                {msg.timestamp}
              </Text> */}
              </div>
            ) : (
              <div style={{ margin: "15px" }}>
                {msg.format && msg.format == "image" ? (
                  <img
                    src={msg.message}
                    style={
                      msg.from_id === to_id
                        ? {
                            backgroundColor: "black",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            borderRadius: "15px",
                            alignSelf: "flex-start",
                            color: "white",
                            fontSize: "18px",
                            borderBottomRightRadius: 0,
                            marginRight: "5px",
                            height: "50%",
                            width: "50%",
                            fontWeight: "500",
                            objectFit: 'contain'
                          }
                        : {
                            borderRadius: "15px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            alignSelf: "flex-end",
                            fontSize: "18px",
                            color: "#63697B",
                            borderBottomLeftRadius: 0,
                            marginLeft: "5px",
                            height: "50%",
                            width: "50%",
                            fontWeight: "500",
                            objectFit: 'contain'
                          }
                    }
                  />
                ) : (
                  <h3
                    style={
                      msg.from_id === from_id
                        ? {
                            backgroundColor: "black",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            borderRadius: "15px",
                            alignSelf: "flex-grow",
                            color: "white",
                            fontSize: "18px",
                            borderBottomRightRadius: 0,
                            marginRight: "5px",
                            marginLeft: "300px",
                            width: "50%",
                            height: "fit-content",
                            textAlign: "end",
                            fontWeight: "500",
                            width: "50%",
                          }
                        : {
                            backgroundColor: "#EAECF2",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            borderRadius: "15px",
                            alignSelf: "flex-start",
                            fontSize: "18px",
                            color: "#63697B",
                            borderBottomLeftRadius: 0,
                            marginLeft: "5px",
                            width: "fit-content",
                            textAlign: "start",
                            fontWeight: "500",
                            width: "50%",
                          }
                    }
                  >
                    {msg.message}
                  </h3>
                )}
                {/* <Text
                style={
                  msg.from_id === from_id
                    ? {
                        alignSelf: "flex-end",
                      }
                    : {
                        alignSelf: "flex-start",
                      }
                }
              >
                {msg.timestamp}
              </Text> */}
              </div>
            )}
          </div>
        ))}
      </div>
      {warningMessage ? (
        <h3 style={{ color: "yellow" }}>{warningMessage}</h3>
      ) : null}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "50%",
          backgroundColor: "white",
          justifyContent: "space-between",
          paddingLeft: "10px",
          paddingRight: "10px",
          flex: 1,
          marginLeft: "10px",
          paddingTop: "5px",
          paddingBottom: "5px",
          // position: "relative",
          bottom: "30px", 
          position: 'absolute',
          bottom: 10
        }}
      >
        <div
          className="messaging__bar"
          style={{ display: "10px", alignItems: "center", width: "100%" }}
        >
          <input
            style={{
              color: "black",
              width: "100%",
              marginLeft: "10px",
            }}
            placeholder="Type something..."
            placeholderTextColor="black"
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
            }}
          />
          <div
            className="messaging__sendMessage"
            onClick={(e) => sendMessage(e)}
            style={{ width: "10%" }}
          >
            <img
              src="/assets/Send.png"
              alt=""
              style={{ width: "27px", height: "25px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messaging;
