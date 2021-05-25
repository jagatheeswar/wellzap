import React from 'react'
import { useHistory } from 'react-router';
import './Profile.css'

function AthleteAssessment({name,path}) {
    const history = useHistory();
    return (
        <div className="athleteAssessment" onClick={() => history.push(`/profile/${path}`)}>
            
            <div className="athleteAssessment__features"> 
            <div className="athleteAssessment__button">{name}</div>
            <img src="/assets/black_right.png" alt="" />
            </div>
           
        </div>
    )
}

export default AthleteAssessment
