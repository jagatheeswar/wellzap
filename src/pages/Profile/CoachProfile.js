import React,{ useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Notification from '../../Components/Notifications/Notification';
import { selectUser, selectUserData, selectUserType, setUserData } from '../../features/userSlice'
import { db } from '../../utils/firebase';
import CoachAssessment from './CoachAssessment';
import CoachProfileForm from './CoachProfileForm';
import './Profile.css'

function CoachProfile() {

    const user = useSelector(selectUser);
    const userData = useSelector(selectUserData);
      const userType = useSelector(selectUserType);
      const dispatch = useDispatch();
      const [athleteDetails, setAthleteDetails] = useState([]);
  
      useEffect(() => {
              db.collection("coaches")
              .where("email", "==", user)
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  dispatch(
                    setUserData({
                      id: doc.id,
                      data: doc.data(),
                    })
                  );
                });
              })
              .catch(function (error) {
                console.log("Error getting documents: ", error);
              });
        
            if (userData) {
              const data = [];
              db.collection("athletes")
              .orderBy("name", "asc")
              .get()
              .then(snapshot => {
                snapshot.docs.forEach((athlete) => {
                  if(userData?.data?.listOfAthletes?.includes(athlete.id)){
                    let currentID = athlete.id;
                    let appObj = { ...athlete.data(), ["id"]: currentID };
                    data.push(appObj);
                  }
                })
                setAthleteDetails(data);
              })
              
            }
          
        }, [user]);
    return (
        <div className="coachProfile">
            <div className="coachProfile__container">
                    <div className="coachProfile__leftContainer">
                        <div className="coachProfile__header">
                                <div className="coachProfile__img">
                                <img className="leftarrow" src="/assets/left_arrow.png" alt="" />
                                <img className="image" src={userData?.data?.imageUrl} alt={userData?.data.name} width="100px" height="100px"/>
                                </div>
                                <div className="coachProfile__content">
                                <h1>{userData?.data.name}</h1>
                                <h3>Strength and Conditioning Coach</h3>
                                </div>       
                        </div>
                        <div className="coachProfile__info">
                            <div className="coachProfile__heading">
                            <h2>Profile</h2>
                            </div>
                            <div className="coachProfile__editButton">EDIT PROFILE</div>
                        </div>
                        <CoachProfileForm />
                        <CoachAssessment />
                    </div>
                    <div className="coachProfile__rightContainer">
                        <Notification />
                    </div>
            



            </div>
        </div>
    )
}

export default CoachProfile
