import React from 'react'
import './Profile.css'

function AthleteProfileForm() {
    return (
        <div className="coachProfileForm">
        <div className="coachProfile__info">
        <div className="coachProfile__heading">
        <h2>Profile</h2>
        </div>
        <div className="coachProfile__editButton">EDIT PROFILE</div>
    </div>
          <form>
            <h4>Mobile Number</h4>
            <input type="text" placeholder="+91 56985 45955" />
            <h4>Email ID</h4>
            <input type="email" placeholder="anishchandra@gmail.com" />
            <h4>Gender</h4>
            <input type="text" placeholder="Enter Gender" />
            <h4>Date of Birth</h4>
            <input type="date" placeholder="Enter Date of Birth" />
            <h4>Billing Address</h4>
            <textarea type="text" placeholder="300, Baneerghatta Main Rd, opp to Apollo Hospitals, Sundar Ram Shetty Nagar, Bilekahali, Bengaluru, Karnataka - 560076" />
          </form>
          <div className="coachProfileForm__Button">Upload File</div>
        </div>
    )
}

export default AthleteProfileForm
