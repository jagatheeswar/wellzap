import React, { useState, useEffect, useCallback } from "react";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { Typography } from "@material-ui/core";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ChatCard from "./ChatCard";
import { useHistory } from "react-router";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginBottom: 0,
//     padding: RFValue(20,816),
//     minHeight: ScreenHeight,
//   },
//   athlete_card: {
//     width: ScreenWidth / 1.05,
//     height: RFValue(180,816),
//     backgroundColor: "#2E2E2E",
//     // borderWidth: 1,
//     // borderColor: "white",
//     borderRadius: 12,
//     marginVertical: 15,
//     padding: 15,
//   },
//   athlete_cardHeader: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 10,
//     marginVertical: 10,
//   },
//   athlete_image: {
//     marginHorizontal: 10,
//     width: ScreenWidth * 0.35,
//     height: ScreenWidth * 0.35,
//     borderRadius: 100,
//     backgroundColor: "white",
//     marginRight: RFValue(20,816),
//     marginTop: 0,
//   },
//   athlete_name: {
//     fontSize: RFValue(18,816),
//     color: "white",
//     margin: 15,
//     marginBottom: 5,
//   },
//   athlete__cardBody: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginHorizontal: RFValue(20,816),
//   },
//   share: {
//     position: "absolute",
//     top: RFValue(20,816),
//     right: RFValue(70,816),
//   },
// });

function ChatHomeScreen({ navigation }) {
  const history = useHistory();
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (userData) {
      const data = [];
      var temp = [];
      db.collection("chat")
        .where("from_id", "==", userData.id)
        .onSnapshot((snapshot) => {
          snapshot.docs.forEach((item) => {
            let currentID = item.id;
            let appObj = { ...item.data(), ["id"]: currentID };
            data.push(appObj);
          });
          data.forEach((id) => {
            temp.push(
              <ChatCard
                from_id={id.from_id}
                id={id.id}
                key={id.id}
                to_id={id.to_id}
              />
            );
          });
          setChats(temp);
          console.log(chats);
          console.log(data);
        });
    }
  }, [userData?.id]);

  return (
    <div style={{ minHeight: "99.5vh" }} className="container">
      <div>
        <div
          style={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginRight: 20,
            }}
          >
            <div
              onClick={() => history.goBack()}
              style={{ marginTop: 20, display: "flex", alignItems: "center" }}
            >
              <ArrowBackIosRoundedIcon
                style={{ height: 18, width: 18, padding: 5, cursor: "pointer" }}
              />
              <Typography variant="h6" style={{ fontSize: 25, marginLeft: 5 }}>
                Chats
              </Typography>
            </div>
            <div
              className="athlete_list"
              onClick={() => {
                history.push("/all-athletes");
              }}
              style={{
                borderRadius: 16,
              }}
            >
              <img
                src="/assets/fab.png"
                alt=""
                width="32px"
                height="32px"
                style={{
                  borderRadius: 10,
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3
            style={{
              fontSize: "22px",
              color: "black",
              fontWeight: "500",
              lineHeight: "20px",
              marginLeft: "45px",
            }}
          ></h3>
        </div>

        {chats}
        {chats.length == 0 && (
          <h1
            onClick={() => {
              history.push("/all-athletes");
            }}
            style={{
              marginLeft: 20,
              fontSize: 18,
              backgroundColor: "white",
              textAlign: "center",
              height: 90,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
            }}
          >
            No Conversions yet, Start a conversion
          </h1>
        )}
      </div>
    </div>
  );
}

export default ChatHomeScreen;
