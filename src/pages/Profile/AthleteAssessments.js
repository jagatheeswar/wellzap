import React from "react";
import AthleteAssessment from "./AthleteAssessment";
import "./Profile.css";
import { useHistory } from "react-router-dom";
function AthleteAssessments() {
  const history = useHistory();
  return (
    <div className="athleteAssessments">
      <h2>Assessments and Measurements</h2>
      <AthleteAssessment
        name="Anthropometric Measurements"
        path="anthropometric-measurements"
      />
      <AthleteAssessment name="Medical Assessment" path="medical-assessment" />
      <AthleteAssessment
        name="Training Assessment"
        path="training-assessment"
      />
      <AthleteAssessment
        name="Food and Lifestyle Assessment"
        path="food-and-lifestyle-assessment"
      />
      <div className="viewReport">
        <div
          onClick={() => history.push("/reports")}
          className="viewReport__button"
        >
          View Report
        </div>
        <img src="/assets/white_right.png" alt="" />
      </div>
    </div>
  );
}

export default AthleteAssessments;
