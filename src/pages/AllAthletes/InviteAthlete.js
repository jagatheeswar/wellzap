import React, { useState } from "react";
import { useHistory } from "react-router";
import "./AllAthletes.css";

function InviteAthlete() {
  const [text, setText] = useState(
    "Hi Athlete! Join Wellzap today and get started on your fitness journey! Download the app here, and link with your coach by typing in the Coach ID as 100000"
  );
  const history = useHistory();

  return (
    <div className="InviteAthlete">
      <div className="inviteAthlete__info">
        <div
          className="inviteAthlete__backButton"
          onClick={() => history.push("/all-athletes")}
        >
          <img src="/assets/left_arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
        <h1>Invites Athlete</h1>
      </div>
      <div className="inviteAthlete__form">
        <h3>Athlete Name</h3>
        <input type="text" placeholder="Enter Athlete Name" />
        <h2>Send Invite</h2>
        <h3>Athlete Email ID</h3>
        <input type="mail" placeholder="Enter Athlete Email ID" />
        <div className="inviteAthlete__sendMailButton">
          Send Automated Email
        </div>
        <textarea
          className="shareInvite"
          type="text"
          onChange={(e) => e.target.value}
        >
          {text}
        </textarea>
      </div>
      <div className="inviteAthlete__shareInvite">Share Invite</div>
    </div>
  );
}

export default InviteAthlete;
