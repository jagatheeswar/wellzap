import React, { useEffect, useState } from "react";
import Report_coach from "../Reports/Report_coach";
import { PieChart } from "react-minimal-pie-chart";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import CoachPayments from "../Payments/CoachPayments";
import { useHistory } from "react-router-dom";
import { Pie } from "react-chartjs-2";

function CoachHomeReports() {
  const history = useHistory();
  const userData = useSelector(selectUserData);
  const [pending, setPending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [today, setToday] = useState([]);
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);

  const [data, setData] = useState([
    { title: "Due today", value: 10, color: "red" },
    { title: "Pending", value: 15, color: "green" },
    { title: "Due Soon", value: 20, color: "#00B1C0" },
    { title: "Completed", value: 20, color: "#ffe486" },
  ]);

  const [chart_data, setchart_data] = useState();
  useEffect(() => {
    if (userData) {
      db.collection("payments")
        .where("coach", "==", userData.id)
        .get()
        .then((snap) => {
          var payments_data = [];
          var completed = [];
          var upcoming = [];
          var pending = [];
          var today = [];
          snap.docs.forEach((doc) => {
            let appObj = { ...doc.data(), ["id"]: doc.id };
            payments_data.push(appObj);
          });
          payments_data.sort((a, b) => {
            return (
              new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000)
            );
          });
          payments_data.forEach((id) => {
            if (id.status == "paid") {
              completed.push(
                <div
                  key={id.id}
                  style={{
                    display: "flex",
                    marginBottom: 15,
                    backgroundColor: "white",
                    paddingRight: 20,
                    paddingLeft: 20,
                    borderRadius: 10,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                      {id.athleteName}
                    </p>
                    <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                      <b>Due on:</b>{" "}
                      {moment(id.date.seconds * 1000).format("ll")}
                    </p>
                  </div>
                  <p style={{ fontSize: 16, color: "black" }}>
                    {"\u20B9"} {id.amt}
                  </p>
                </div>
              );
            } else {
              if (
                moment(
                  moment(new Date()).format("DD-MM-YYYY"),
                  "DD-MM-YYYY"
                ).valueOf() <=
                  id.date.seconds * 1000 &&
                moment(
                  moment(new Date()).add(1, "days").format("DD-MM-YYYY"),
                  "DD-MM-YYYY"
                ).valueOf() >=
                  id.date.seconds * 1000
              ) {
                today.push(
                  <div
                    key={id.id}
                    style={{
                      display: "flex",
                      marginBottom: 15,
                      backgroundColor: "white",
                      paddingRight: 20,
                      paddingLeft: 20,
                      borderRadius: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        {id.athleteName}
                      </p>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        <b>Due on:</b>{" "}
                        {moment(id.date.seconds * 1000).format("ll")}
                      </p>
                    </div>
                    <p style={{ fontSize: 16, color: "black" }}>
                      {"\u20B9"} {id.amt}
                    </p>
                  </div>
                );
              } else if (
                id.date.seconds * 1000 <
                moment(new Date()).valueOf()
              ) {
                pending.push(
                  <div
                    key={id.id}
                    style={{
                      display: "flex",
                      marginBottom: 15,
                      backgroundColor: "white",
                      paddingRight: 20,
                      paddingLeft: 20,
                      borderRadius: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        {id.athleteName}
                      </p>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        <b>Due on:</b>{" "}
                        {moment(id.date.seconds * 1000).format("ll")}
                      </p>
                    </div>
                    <p style={{ fontSize: 16, color: "black" }}>
                      {"\u20B9"} {id.amt}
                    </p>
                  </div>
                );
              } else {
                upcoming.push(
                  <div
                    key={id.id}
                    style={{
                      display: "flex",
                      marginBottom: 15,
                      backgroundColor: "white",
                      paddingRight: 20,
                      paddingLeft: 20,
                      borderRadius: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        {id.athleteName}
                      </p>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        <b>Due on:</b>{" "}
                        {moment(id.date.seconds * 1000).format("ll")}
                      </p>
                    </div>
                    <p style={{ fontSize: 16, color: "black" }}>
                      {"\u20B9"} {id.amt}
                    </p>
                  </div>
                );
              }
            }
          });

          setData([
            { title: "Due Today", value: today.length, color: "orange" },
            { title: "Pending", value: pending.length, color: "red" },
            { title: "Due Soon", value: upcoming.length, color: "#ffe486" },
            { title: "Completed", value: completed.length, color: "green" },
          ]);

          setPending(pending);
          setUpcoming(upcoming);
          setCompleted(completed);
          setToday(today);
        });
    }
  }, [userData?.id]);

  return (
    <div className="home__reports">
      <h1 onClick={() => history.push("/reports")}>Reports</h1>
      <div className="home__reportsMainContainer">
        <div className="home__reportsLeftContainer">
          <h1 style={{ cursor: "auto" }}>Compliance</h1>
          <div style={{ width: "100%" }}>
            <Report_coach height={150} />
          </div>
        </div>
        <div className="home__reportsRightContainer">
          <h1 onClick={() => history.push("/payments")}>Payments</h1>
          <div style={{ width: "100%", marginTop: 20 }}>
            <div
              style={{
                backgroundColor: "white",
                justifyContent: "space-around",
                alignItems: "center",
                height: "340px",
                borderRadius: 10,
                display: "flex",
                width: 420,
              }}
            >
              <div style={{ width: 230 }}>
                <PieChart
                  data={data}
                  lineWidth={50}
                  labelPosition={75}
                  radius={35}
                  label={() => (
                    <div
                      style={{
                        backgroundColor: "white",
                        borderRadius: 100,
                        width: "20px",
                        height: "20px",
                      }}
                    >
                      <p>5</p>
                    </div>
                  )}
                />
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: 20,
                  }}
                >
                  <div
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: "red",
                      borderRadius: 100,
                      alignSelf: "center",
                      alignItems: "center",
                      marginRight: 10,
                      marginTop: 5,
                    }}
                  ></div>
                  <p>
                    {/* {today.length} -  */}
                    Due Today
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: "#34B334",
                      borderRadius: 100,
                      alignSelf: "center",
                      alignItems: "center",
                      marginRight: 10,
                      marginTop: 5,
                    }}
                  ></div>
                  <p>
                    {/* {pending.length} -  */}
                    Pending
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: "rgb(0, 177, 192)",
                      borderRadius: 100,
                      alignSelf: "center",
                      alignItems: "center",
                      marginRight: 10,
                      marginTop: 5,
                    }}
                  ></div>
                  <p>
                    {/* {upcoming.length} -  */}
                    Due Soon
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: "#ffe486",
                      borderRadius: 100,
                      alignSelf: "center",
                      alignItems: "center",
                      marginRight: 10,
                      marginTop: 5,
                    }}
                  ></div>
                  <p>
                    {/* {completed.length} -  */}
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachHomeReports;
