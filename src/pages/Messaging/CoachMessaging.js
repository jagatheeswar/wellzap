import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import firebase from "firebase";
import NutritionScreenHeader from "../Nutrition/NutritionScreenHeader";
import userType from "../../features/userSlice";

function CoachMessaging({ route, navigation }) {
  const [doc_id, setDoc_id] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [from_id, setfrom_id] = useState(route.params?.from_id);
  const [from_name, setfrom_name] = useState(route.params?.from_name);
  const [to_id, setto_id] = useState(route.params?.to_id);
  const [to_name, setto_name] = useState(route.params?.to_name);
  const [type, settype] = useState(route.params?.type);
  const [athleteData, setAthleteData] = useState({});
  const [coachDetails, setCoachDetails] = useState({});
  const [chatType, setChatType] = useState();

  useEffect(() => {
    if (route.params?.chatType) {
      setChatType(route.params?.chatType);
    }
  }, [route.params?.chatType]);

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
    <div className="coachMessaging">
      <NutritionScreenHeader name="Messaging" />
      <div
        onClick={() => {
          if (userType === "athlete") {
            navigation.navigate("Home", { screen: "Home" });
          } else {
            navigation.goBack();
          }
        }}
        style={{ marginleft: "10px", marginRight: "10px" }}
      >
        <img src="/assets/left_arrow.png" />
      </div>
      <img
        src={{
          uri:
            type == "coach"
              ? athleteData?.imageUrl != ""
                ? athleteData.imageUrl
                : null
              : coachDetails?.imageUrl != ""
              ? coachDetails.imageUrl
              : null,
        }}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "10px",
          margin: "10px",
        }}
      />
      <h3 style={{ color: "black", fontSize: "20px", fontWeight: "bold" }}>
        {to_name}
      </h3>
      <div style={{ marginBottom: "40px", marginTop: "50px" }}>
        {allMessages?.map((msg) => (
          <div key={msg.id}>
            {type === "coach" ? (
              <div style={{ margin: "15px" }}>
                {msg.format && msg.format == "image" ? (
                  <img
                    src={{ uri: msg.message }}
                    style={
                      msg.from_id === to_id
                        ? {
                            backgroundColor: "black",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            borderRadius: "15px",
                            alignItems: "flex-start",
                            color: "white",
                            fontSize: "18px",
                            borderBottomRightRadius: "0px",
                            marginRight: "5px",
                            height: "200px",
                            width: "200px",
                          }
                        : {
                            borderRadius: "15px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            alignItems: "flex-end",
                            fontSize: "18px",
                            color: "#63697B",
                            borderBottomLeftRadius: "0px",
                            marginLeft: "5px",
                            height: "200px",
                            width: "200px",
                          }
                    }
                  />
                ) : (
                  <h2
                    style={
                      msg.from_id === to_id
                        ? {
                            backgroundColor: "black",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            borderRadius: "15px",
                            alignItems: "flex-end",
                            color: "white",
                            fontSize: "18px",
                            borderBottomRightRadius: "0px",
                            marginRight: "5px",
                          }
                        : {
                            backgroundColor: "#EAECF2",
                            borderRadius: "15px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            alignItems: "flex-start",
                            fontSize: "18px",
                            color: "#63697B",
                            borderBottomLeftRadius: "0px",
                            marginLeft: "5px",
                          }
                    }
                  >
                    {msg.message}
                  </h2>
                )}
              </div>
            ) : (
              <div style={{ margin: "15px" }}>
                {msg.format && msg.format == "image" ? (
                  <img
                    src={{ uri: msg.message }}
                    style={
                      msg.from_id === to_id
                        ? {
                            backgroundColor: "black",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            borderRadius: "15px",
                            alignItems: "flex-start",
                            color: "white",
                            fontSize: "18px",
                            borderBottomRightRadius: "0px",
                            marginRight: "5px",
                            height: "200px",
                            width: "200px",
                          }
                        : {
                            borderRadius: "15px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            alignItems: "flex-end",
                            fontSize: "18px",
                            color: "#63697B",
                            borderBottomLeftRadius: "0px",
                            marginLeft: "5px",
                            height: "200px",
                            width: "200px",
                          }
                    }
                  />
                ) : (
                  <h2
                    style={
                      msg.from_id === from_id
                        ? {
                            backgroundColor: "black",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            borderRadius: "15px",
                            alignItems: "flex-end",
                            color: "white",
                            fontSize: "18px",
                            borderBottomRightRadius: "0px",
                            marginRight: "5px",
                          }
                        : {
                            backgroundColor: "#EAECF2",
                            borderRadius: "15px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            alignItems: "flex-start",
                            fontSize: "18px",
                            color: "#63697B",
                            borderBottomLeftRadius: "0px",
                            marginLeft: "5px",
                          }
                    }
                  >
                    {msg.message}
                  </h2>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div onClick={(e) => sendMessage(e)}>
        <img src="/assets/send.png" style={{ width: "27px", height: "25px" }} />
      </div>
    </div>
  );
}

export default CoachMessaging;
