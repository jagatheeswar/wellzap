import React from "react";
import moment from "moment";
function Event_card(props) {
  var events = props.data;
  let eventslength = events.length;

  if (events.length > props.count) {
    var events = events.slice(0, props.count);
  }

  return (
    <div>
      {events.map((item) => {
        return (
          <div key={item.id} style={{}}>
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
                width: 300,
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
                    }}
                  >
                    {item.eventName && item.eventName}
                  </div>
                  <div className="upcoming_event_time" style={{ fontSize: 13 }}>
                    {item.eventDate && moment(item.eventDate).format("LL")}
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
                  {item.eventDate && moment(item.eventDate).format("LT")}
                </button>
              </div>
            </div>
            <div style={{ marginLeft: 20 }}>
              <a style={{textDecoration:"none"}} href={item.showVideoLink && item.videolink}>
                {item.showVideoLink && item.videolink}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Event_card;
