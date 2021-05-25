import React from 'react'
import AthleteAssessment from './AthleteAssessment'
import './Profile.css'


function AthleteAssessments() {
    return (
        <div className="athleteAssessments">
        <h2>Assessments and Measurements</h2>
        <AthleteAssessment name="Anthropometric Measurements" path="measurements"/>
        <AthleteAssessment name="Medical Assessment" />
        <AthleteAssessment name="Training Assessment" />
        <AthleteAssessment name="Food and Lifestyle Assessment" />
        <div className="viewReport">
              <div className="viewReport__button">View Report</div>
              <img src="/assets/white_right.png" alt="" />
        </div>
        </div>
    )
}

export default AthleteAssessments
