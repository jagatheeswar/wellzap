import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { formatDate } from "../../functions/formatDate";

function CalendarComponent() {
  const [value, onChange] = useState(new Date());

  console.log(formatDate(value));
  return (
    <div>
      <Calendar
        style={{ width: "80%", height: "200px", backgroundColor: "grey" }}
        onClick={(value, event) => alert("New date selected is: ", value)}
        value={value}
      />
    </div>
  );
}

export default CalendarComponent;
