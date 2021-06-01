// import React, { useEffect, useRef, useState } from "react";
// import "./Messaging.css";
// import firebase from "firebase";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   selectUser,
//   selectUserData,
//   selectUserType,
//   setUserData,
// } from "../../features/userSlice";
// import { db } from "../../utils/firebase";

// function Messaging() {
//   const userType = useSelector(selectUserType);
//   const userData = useSelector(selectUserData);
//   const [inputMessage, setInputMessage] = useState("");
//   const [allMessages, setAllMessages] = useState([]);
//   const [from_id, setfrom_id] = useState(route.params?.from_id);
//   const [from_name, setfrom_name] = useState(route.params?.from_name);
//   const [to_id, setto_id] = useState(route.params?.to_id);
//   const [to_name, setto_name] = useState(route.params?.to_name);
//   const [type, settype] = useState(route.params?.type);
//   const [coachDetails, setCoachDetails] = useState({});
//   const [imageUrl, setImageUrl] = useState(null);
//   const [doc_id, setDoc_id] = useState(null);
//   const scrollViewRef = useRef();
//   const [athleteData, setAthleteData] = useState({});
//   const [listOfCoaches, setListOfCoaches] = useState([]);
//   const [warningMessage, setWarningMessage] = useState("");
//   const [chatType, setChatType] = useState();
//   const [registerFlow, setRegisterFlow] = useState();

//   useEffect(() => {
//     if (route.params?.registerFlow) {
//       setRegisterFlow(route.params?.registerFlow);
//     }
//   }, [route.params?.registerFlow]);

//   useEffect(() => {
//     if (route.params?.chatType) {
//       setChatType(route.params?.chatType);
//     }
//   }, [route.params?.chatType]);

//   useEffect(() => {
//     if (doc_id) {
//       const unsubscribe = db
//         .collection("chat")
//         .doc(doc_id)
//         .collection("messages")
//         .orderBy("timestamp", "asc")
//         .onSnapshot((querySnapshot) => {
//           // Get all documents from collection - with IDs
//           console.log("Loading the chat...");
//           const data = querySnapshot.docs.map((doc) => ({
//             ...doc.data(),
//             id: doc.id,
//           }));

//           setAllMessages(data);
//         });

//       return unsubscribe;
//     } else {
//       setAllMessages([]);
//     }
//   }, [db, doc_id]);

//   const sendMessage = async () => {
//     if (inputMessage !== "") {
//       db.collection("chat")
//         .where("from_id", "==", from_id)
//         .where("to_id", "==", to_id)
//         .get()
//         .then(function (querySnapshot) {
//           querySnapshot.forEach(function (doc) {
//             setDoc_id(doc.id);

//             if (type === "coach") {
//               if (doc.id) {
//                 db.collection("chat")
//                   .doc(doc.id)
//                   .collection("messages")
//                   .add({
//                     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//                     message: inputMessage,
//                     from_id: to_id,
//                     from_name: to_name,
//                   })
//                   .catch((e) => console.log(e));
//               }
//             } else if (type === "athlete") {
//               if (doc.id) {
//                 db.collection("chat")
//                   .doc(doc.id)
//                   .collection("messages")
//                   .add({
//                     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//                     message: inputMessage,
//                     from_id: from_id,
//                     from_name: from_name,
//                   })
//                   .catch((e) => console.log(e));
//               }
//             }
//           });
//         })
//         .catch(function (error) {
//           console.log("Error getting documents: ", error);
//         });

//       setInputMessage("");
//     }
//   };
//   return (
//     <div className="messaging">
//       <div className="messaging__chatList">Sidebar</div>
//       <div className="messaging__chat">chat</div>
//     </div>
//   );
// }

// export default Messaging;
