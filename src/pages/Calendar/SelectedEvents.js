import React from "react";
import moment from "moment";

function SelectedEvents(props) {
  var events = props.data;
  var dates = props.dates;
  let eventslength = events.length;

  if (events.length > props.count) {
    var events = events.slice(0, props.count);
  }
  console.log("sss,", events, dates);
  return (
    <div>
      {dates.map((item) => {
        return (
          <div style={{}}>
            <div
              className=""
              style={{
                display: "flex",
                width: 280,
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",

                  alignItems: "center",
                }}
              >
                <i
                  class="fa fa-circle"
                  style={{ fontSize: 10, marginRight: 8 }}
                ></i>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className="upcoming_event_title"
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      marginBottom: 3,
                      borderWidth: 1,
                      borderColor: "red",
                    }}
                  >
                    {events[item].eventName && events[item].eventName}
                  </div>
                  <div className="upcoming_event_time" style={{ fontSize: 13 }}>
                    {events[item].eventDate &&
                      moment(events[item].eventDate).format("LL")}
                  </div>
                </div>
              </div>

              <div
                className="upcoming_event_right"
                style={{ marginRight: -20 }}
              >
                <button
                  style={{
                    height: 25,
                    backgroundColor: "#fcd54a",
                    color: "black",
                  }}
                >
                  {events[item].eventDate &&
                    moment(events[item].eventDate).format("LT")}
                </button>
              </div>
            </div>
            <div style={{ marginLeft: 20 }}>
              <a style={{textDecoration:"none"}} href={events[item].showVideoLink && events[item].videolink}>
                {events[item].showVideoLink && events[item].videolink}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SelectedEvents;
