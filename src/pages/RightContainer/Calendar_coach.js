import React, { useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import "./Calendar.css";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../utils/firebase";
import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
} from "../../features/userSlice";
import Event_card from "./Event_card";
import Selected_events from "./SelectedEvents";
import dateContext from "../../features/context";
import { useHistory } from "react-router-dom";
const Calendar_coach = (props) => {
  let contextType = React.useContext(dateContext);

  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).utc().format("YYYY-MM-DD")
  );
  const history = useHistory();

  const [events, setEvents] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  const [months, setMonths] = useState([
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]);
  const [curr_month, setCurr_months] = useState("");

  const [curr_year, setCurr_year] = useState(2021);
  const [upcoming, setUpcoming] = useState([]);
  const [todays, setTodays] = useState([]);
  const [markedEvents, setMarkedEvents] = useState({});
  const [goals, setGoals] = useState([]);
  const [selectedevents, setselectedevents] = useState([]);
  const [goalsData, setGoalsData] = useState(null);
  const [tdy, settdy] = useState([]);
  const [upcomingevents, setupcomingevents] = useState([]);
  const defaultValue = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: 24,
  };

  // console.log(defaultValue, new Date().getDate())
  const [selectedDay, setSelectedDay] = useState(null);
  const [showevent_count, setshowevent_count] = useState(3);
  React.useEffect(() => {
    var el = document.getElementsByClassName("Calendar__day -selected");
    if (el.length > 0) {
      let weekname = el[0].getAttribute("aria-label").slice(0, 3).toUpperCase();

      el[0].setAttribute("week", weekname);
    }
  });

  React.useEffect(() => {
    if (selectedDay) {
      let date = selectedDay;

      let temp = new Date(date.year, date.month - 1, date.day);

      console.log(temp, date);
      temp = temp.setHours(0, 0, 0, 0);
      console.log(props?.selectedDate, temp);
      if (props?.selectedDate == temp) {
        console.log(props?.selectedDate);
      } else {
        //temp = temp.setHours(0, 0, 0, 0);
        props?.toggle_date(temp);
      }
    }
  }, [selectedDate]);

  React.useEffect(() => {
    if (selectedDay) {
      let date = selectedDay;

      setSelectedDate(moment([date.year, date.month - 1, date.day]));
      console.log(1);
    }
  }, [selectedDay]);

  React.useEffect(() => {
    var dates = [];
    var date_str = String(moment(moment(selectedDate).valueOf()).format("ll"));

    if (Object.keys(events).length > 0) {
      var s = "";

      Object.keys(events).forEach((item) => {
        s = String(moment(moment(events[item].eventDate)).format("ll"));

        if (s == date_str) {
          dates.push(item);
        }
      });
    }

    // console.log(Object.keys(events));
    setselectedevents(dates);
  }, [selectedDate]);

  React.useEffect(() => {
    var today_temp = [];
    var upcoming_temp = [];
    var local_events = {};
    let tdy = [];
    var local_markedEvents = {};

    let now = new Date();
    if (props?.selectedDate) {
      var d = moment(new Date(props?.selectedDate));
    } else {
      var d = moment();
    }

    console.log(now);
    let today_date = {
      year: d.year(),
      month: d.month() + 1,
      day: d.date(),
    };
    console.log(today_date, "td");

    setSelectedDay(today_date);
    if (userData) {
      db.collection("events")
        .where("coachID", "==", userData.id)
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((item) => {
            let currentID = item.id;

            let appObj = { ...item.data(), ["id"]: currentID };
            var key1 = String(
              moment(item.data().date.seconds * 1000)
                .format("llll")
                .split(" ")
                .join("-")
            );
            local_events[key1] = {
              eventName: item.data().name,
              eventDate: item.data().date.seconds * 1000,
              description: item.data().description,
              showVideoLink: item.data()?.showVideoLink,
              videolink: item.data()?.videolink,
              athletes: item.data().athletes,
              id: item.id,
              attendance: item.data()?.attendance,
            };

            if (
              moment(new Date()).valueOf() <=
              item.data().date.seconds * 1000
            ) {
              local_markedEvents[
                moment(item.data().date.seconds * 1000).format("YYYY-MM-DD")
              ] = {
                marked: true,
                dotColor: "black",
              };
            }
          });

          setEvents(local_events);
          setMarkedEvents(local_markedEvents);
          setMarkedDates(local_markedEvents);

          var data = local_events;
          var keys = Object.keys(local_events);
          if (keys.length > 1) {
            keys.sort(function (a, b) {
              return (
                new Date(a.split("-").join(" ")) -
                new Date(b.split("-").join(" "))
              );
            });
          }

          let tdy = [];
          let upcomingevents = [];
          keys.forEach((id) => {
            if (
              String(moment(new Date()).format("L")) ==
              moment(id.split("-").join(" ")).format("L")
            ) {
              tdy.push(data[id]);

              today_temp.push(<div key={id} id={id} data={data} />);
            } else if (
              moment(new Date()).valueOf() <
              moment(id.split("-").join(" ")).valueOf()
            ) {
              upcomingevents.push(data[id]);
              upcoming_temp.push(<div key={id} id={id} data={data} />);
            }
          });

          setTodays(today_temp);
          setUpcoming(upcoming_temp);
          settdy(tdy);
          setupcomingevents(upcomingevents);
        })
        .catch((e) => console.log(e));
    }
  }, [userData?.id]);

  return (
    <div className="calendar_container">
      <div className="calendar_header">
        <h3 className="calendar_title">Calendar</h3>
        <span className="calendar_right">
          <i
            class="fa fa-search"
            style={{ fontSize: "17px", fontWeight: 100 }}
          ></i>
          <button
            onClick={() => {
              history.push("/calendar");
            }}
            className="add_event"
          >
            +
          </button>
        </span>
      </div>
      {selectedDay && (
        <Calendar
          value={selectedDay ? selectedDay : defaultValue}
          onChange={setSelectedDay}
          colorPrimary="#fcd54a" // added this
          calendarClassName="custom-calendar" // and this
          calendarTodayClassName="custom-today-day" // also this
        />
      )}

      <div className="events_container">
        <div class="events_today">
          <div style={{ fontWeight: 100, fontSize: 16, color: "grey" }}>
            Today
          </div>
          <div className="events_today_list">
            {tdy.length !== 0 ? (
              <Event_card data={tdy} count={tdy.length} />
            ) : (
              <>
                <div className="events_today_">
                  No events for today
                  <br />
                </div>
              </>
            )}
          </div>
          {selectedevents.length !== 0 && (
            <div
              style={{
                fontWeight: 100,
                fontSize: 16,
                marginTop: 10,
                color: "grey",
              }}
            >
              Events scheduled on{" "}
              {moment(moment(selectedDate).valueOf()).format("ll")}
            </div>
          )}
          <div className="events_today_list">
            {selectedevents.length !== 0 ? (
              <Selected_events
                dates={selectedevents}
                data={events}
                count={tdy.length}
              />
            ) : (
              <>
                <div className="events_today_">
                  No events scheduled on{" "}
                  {moment(moment(selectedDate).valueOf()).format("ll")}
                  <br />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Upcoming events list */}

        <div
          class="upcoming_events"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              fontWeight: 100,
              color: "grey",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            Upcoming
          </div>

          {/* Upcoming events single item */}

          <div className="upcoming_event_">
            {upcomingevents.length !== 0 ? (
              <Event_card data={upcomingevents} count={showevent_count} />
            ) : (
              <div
                style={{
                  fontWeight: 600,
                }}
              >
                No events scheduled
              </div>
            )}
          </div>
          <div class="divider"> </div>
        </div>
        {upcomingevents.length > showevent_count && (
          <div
            class="events_more"
            style={{ textAlign: "center", marginTop: 30, color: "#acacac" }}
            onClick={() => {
              setshowevent_count(showevent_count + 3);
            }}
          >
            +{upcomingevents.length - showevent_count} more
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(
  Calendar_coach,
  (prevProps, nextProps) => prevProps.selectedDate === nextProps.selectedDate
);
