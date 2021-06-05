import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { db } from "../../utils/firebase";
import CalendarScreenHeader from "./CalendarScreenHeader";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
} from "../../features/userSlice";
import EventCard from "./EventCard";
import SelectedEvents from "./SelectedEvents";
import "./Calendar.css"

function AthleteCalendar() {
    const user = useSelector(selectUser);
    const userData = useSelector(selectUserData);
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(
      moment(new Date()).utc().format("YYYY-MM-DD")
    );
    const [events, setEvents] = useState({});
    const [sideBar, setSideBar] = useState("");
    const [eventHistory, setEventHistory] = useState([]);
    const [eventHistoryOpen, setEventHistoryOpen] = useState(false);
    const [goals, setGoals] = useState([]);
    const [selectedevents, setselectedevents] = useState([]);
    const [goalsData, setGoalsData] = useState(null);
    const [tdy, settdy] = useState([]);
    const [upcomingevents, setupcomingevents] = useState([]);
    const defaultValue = {
      year: 2021,
      month: 4,
      day: 5,
    };
    const [selectedDay, setSelectedDay] = useState(defaultValue);
    const [showevent_count, setshowevent_count] = useState(3);
    React.useEffect(() => {
      var el = document.getElementsByClassName("Calendar__day -selected");
      if (el.length > 0) {
        let weekname = el[0].getAttribute("aria-label").slice(0, 3).toUpperCase();
  
        el[0].setAttribute("week", weekname);
      }
    });
    React.useEffect(() => {
      let date = selectedDay;
      setSelectedDate(moment([date.year, date.month - 1, date.day]));
    }, [selectedDay]);
  
    React.useEffect(() => {
      var dates = [];
      var date_str = String(moment(moment(selectedDate).valueOf()).format("ll"));
      console.log("dt", date_str);
      if (Object.keys(events).length > 0) {
        var s = "";
  
        Object.keys(events).forEach((item) => {
          s = String(moment(moment(events[item].eventDate)).format("ll"));
  
          if (s == date_str) {
            dates.push(item);
            console.log(item);
          }
        });
      }
  
      setselectedevents(dates);
    }, [selectedDate]);
  
    React.useEffect(() => {
      var today_temp = [];
      var upcoming_temp = [];
      var local_events = {};
      let tdy = [];
  
      let now = moment();
  
      let today_date = {
        year: now.get("year"),
        month: now.get("month") + 1,
        day: now.get("day"),
      };
  
      setSelectedDay(today_date);
      if (userData) {
          var localEventsHistory = [];
        db.collection("events")
          .where("athletes", "array-contains", userData.id)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((item) => {
              let currentID = item.id;
  
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
            });
            setEvents(local_events);
  
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
              }else{
                localEventsHistory.push(
                    <div style={{width:"85%",marginTop:10}}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <div style={{display: "flex", alignItems: "center",}}>
                        <i class="fa fa-circle" style={{ fontSize: 10, marginRight: 8 }}></i>
                        <div style={{display: "flex",flexDirection: "column"}}>
                          <div className="upcoming_event_title"
                            style={{
                              fontWeight: "bold",
                              fontSize: 15,
                              marginBottom: 3,
                            }}
                          >
                            {data[id].eventName && data[id].eventName}
                          </div>
                          <div className="upcoming_event_time" style={{ fontSize: 13 }}>
                            {data[id].eventDate && moment(data[id].eventDate).format("LL")}
                          </div>
                        </div>
                      </div>
        
                      <div className="upcoming_event_right">
                        <button
                          style={{
                            height: 25,
                            backgroundColor: "#fcd54a",
                            color: "black",
                          }}
                        >
                          {data[id].eventDate && moment(data[id].eventDate).format("LT")}
                        </button>
                      </div>
                    </div>
                    <div style={{ marginLeft: 20 }}>
                      <a style={{textDecoration:"none"}}>
                        {data[id].showVideoLink && data[id].videolink}
                      </a>
                    </div>
                  </div>
                )
              }
            });
  
            settdy(tdy);
            setupcomingevents(upcomingevents);
            setEventHistory(localEventsHistory)

          })
          .catch((e) => console.log(e));
      }
    }, [userData?.id]);


  return (
    <div className="workouts__home">
        <CalendarScreenHeader name="Calendar" />

        <div style={{display:"flex",justifyContent:"space-evenly"}}>
          <div style={{flex:0.48,paddingLeft:20,width:"100%"}}>
      <div style={{display:"flex",alignItems:"center",marginBottom:20,marginRight:20}}>
          <span onClick={()=>setSideBar("eventsHistory")} style={{backgroundColor:"#fcd54a",borderRadius:5,padding:10,cursor:"pointer",marginLeft:"auto"}}>
            Events History
          </span>
        <button onClick={()=>setSideBar("createEvent")} style={{backgroundColor:"#fcd54a",fontSize:25,fontWeight:"bold",cursor:"pointer",padding:5,paddingLeft:12,paddingRight:12,border:"none",borderRadius:5,marginLeft:15}}>
           +
        </button>
      </div>
      <Calendar
        value={selectedDay}
        onChange={setSelectedDay}
        colorPrimary="#fcd54a" // added this
        colorPrimaryLight="blue"
        calendarClassName="customcalendarScreen" // and this
        calendarTodayClassName="custom-today-day" // also this
      />

      <div className="eventsContainerScreen">
        <div class="events_today">
          <div style={{ fontWeight: 100, color: "grey" }}></div>
          <div className="events_today_list">
            {tdy.length !== 0 ? (
              <EventCard data={tdy} count={tdy.length} />
            ) : (
              <>
                <div className="events_today_">
                  No events for today
                  <br />
                </div>
              </>
            )}
          </div>
          <div className="events_today_list">
            {selectedevents.length !== 0 ? (
              <SelectedEvents
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
            {upcomingevents.length !== 0 && (
              <EventCard data={upcomingevents} count={showevent_count} />
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
          <div style={{flex:0.48,marginTop:60,backgroundColor:"white",paddingLeft:30,borderRadius:10,alignSelf:"flex-start",paddingBottom:20}}>
              {sideBar == "eventsHistory" ? 
                eventHistoryOpen ? 
                  <div>
                      <p style={{fontWeight:"bold",fontSize:18}}>Events History</p>
                    {eventHistory}
                </div> : 
                <div>
                    <p style={{fontWeight:"bold",fontSize:18}}>Events History</p>
                    {eventHistory.slice(0,6)}
                    {eventHistory.length > 6 ?
                    <p onClick={()=>setEventHistoryOpen(true)} style={{textAlign:"center",color: "#acacac",cursor:"pointer"}}>+ {eventHistory.length - 6} more</p>:null}
                </div>
                 : null}
          </div>
        </div>

    </div>
  );
}

export default AthleteCalendar;
