import React, { useState} from 'react'
import CheckboxesGroups from '../../Components/Buttons/Checkboxs';
import Header from '../../Components/Header/Header';
import './Profile.css'

function AthleteTrainingAssessment() {
    const [daysList, setDaysList] = useState([
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
      ]);
      const [color, changeColor] = useState([]);
      const [selectedDaysOfTraining, setSelectedDaysOfTraining] = useState([]);
      const [editable, setEditable] = useState(false);
      const [userData, setUserData] = useState(null);
      const [trainingHours, setTrainingHours] = useState("");

    return (
        <div className="athleteTrainingAssessment">
        <Header />
        <h2>Training Assessment</h2>
            <h4>Select Days you wish to train</h4>
                <h5>Select days</h5>
                <div className="athleteTrainingAssessment__container">
                { daysList.map((day, idx) => (
                    <div className="athleteTrainingAssessment__days"
                  key={idx}
                  onClick={() => {
                    if (color.includes(idx)) {
                      var array = [...color];
  
                      var index = array.indexOf(idx);
                      if (index !== -1) {
                        array.splice(index, 1);
  
                        changeColor(array);
                      }
                      var list = selectedDaysOfTraining.filter(
                        (t) => t !== daysList[idx]
                      );
                      setSelectedDaysOfTraining(list);
                    } else {
                      changeColor([...color, idx]);
                    }
                  }} 
                  disabled={!editable} 
                  
                style={
                  color.includes(idx)
                    ? {
                        backgroundColor: "#fcd54a",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        textAlign: "center",
                        borderRadius: 10,
                        marginRight: 8,
                        marginBottom: 5,
                        height: 30,
                        width: 60,
                        fontWeight: 600,
                      }
                    : {
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        textAlign: "center",
                        borderRadius: 10,
                        marginRight: 8,
                        marginBottom: 5,
                        height: 30,
                        width: 60,
                        fontWeight: 600,
                      }
                }
                >
                {day}    
              </div>
            ))}  
          
          </div>
          <h4>Training Hours per day</h4>
          <input style={
            editable
              ? {
                  borderWidth: 1,
                  borderColor: "grey",
                  width: '97%',
                  borderRadius: 5,
                  padding: 15,
                  marginLeft: 10,
                }
              : {
                  borderColor: "grey",
                  borderWidth: 0,
                  width: '97%',                 
                  borderRadius: 5,
                  padding: 15,
                  marginLeft: 10,
                }
          }
          editable={editable}
          type="text"
          placeholder="No. of hours you wish to train per day"
          defaultValue={userData?.data?.trainingHours}
          value={trainingHours}
          onChange={e => setTrainingHours(e.target.value)}
        />
        <h4>Select equipment you have access to</h4>
        <div className="athleteTrainingAssessment__form">
          <div className="athleteTrainingAssessment__checkBox">
          <CheckboxesGroups label1="Gym" label2="Kettlebells" />
          <CheckboxesGroups label1="Cycle" label2="Weights" />
          <CheckboxesGroups label1="Dumbells" label2="Resistance Bands" />
          <CheckboxesGroups label1="Swimming Pool" label2="Other" />
        </div>
        </div>
          <div className="athleteTrainingAssessment__Button">Complete Form</div>
     </div>
    )
}

export default AthleteTrainingAssessment
