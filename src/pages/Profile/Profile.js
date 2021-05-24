import React,{ useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Sidebar from '../../Components/Sidebar/Sidebar'
import { selectUser, selectUserData, selectUserType, setUserData } from '../../features/userSlice'
import { db } from '../../utils/firebase';
import AthleteProfile from './AthleteProfile';
import CoachProfile from './CoachProfile';
import './Profile.css'

function Profile() {
    const user = useSelector(selectUser);
    const userData = useSelector(selectUserData);
    const userType = useSelector(selectUserType);
    const dispatch = useDispatch();

    return (
        <div className="profile">
            <div className="profile__container">
            <Sidebar />
            <div className="profile__main">
            {userType === "athlete" ? <AthleteProfile /> : <CoachProfile />}
            </div>
            </div>
        </div>
    )
}

export default Profile
