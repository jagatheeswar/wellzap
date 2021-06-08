import React from "react";
import AthleteAssessment from "./AthleteAssessment";
import "./Profile.css";

function AthleteAssessments() {
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
        <div className="viewReport__button">View Report</div>
        <img src="/assets/white_right.png" alt="" />
      </div>
    </div>
  );
}

export default AthleteAssessments;
