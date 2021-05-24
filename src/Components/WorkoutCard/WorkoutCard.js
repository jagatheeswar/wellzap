import React from 'react'
import './WorkoutCard.css'

function WorkoutCard() {
    return (
        <div className="workoutCard">
            <img src="/assets/illustration.jpeg" alt="" width="110px" height="110px" />
            <div className="workoutCard__info">
                <h1>Workout Name</h1>
                <div className="workoutCard__macroNutrients">
                    <h3>Calories</h3>
                    <h3>660</h3>
                </div>
                <div className="workoutCard__macroNutrients">
                    <h3>Difficulty</h3>
                    <h3>Moderate</h3>
                </div>
                <div className="workoutCard__macroNutrients">
                    <h3>Duration</h3>
                    <h3>00:30:00</h3>
                </div>
                
                
            </div>
            <div className="right__arrow">
                    <img src="/assets/right__arrow.png" alt="" />
                </div>
        </div>
    )
}

export default WorkoutCard
