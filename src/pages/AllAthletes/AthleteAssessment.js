import React from "react";
import { useHistory } from "react-router";
import "./Profile.css";

function AthleteAssessment({ name, path, Id }) {
  const history = useHistory();
  var temp_path = Id ? `/${Id}` : "";

  return (
    <div
      className="athleteAssessment"
      onClick={() => {
        console.log(temp_path);
        window.open("/Athlete/" + path + temp_path, "_blank");
      }}
    >
      <div className="athleteAssessment__features">
        <div className="athleteAssessment__button">{name}</div>
        <img src="/assets/black_right.png" alt="" />
      </div>
    </div>
  );
}

export default AthleteAssessment;
