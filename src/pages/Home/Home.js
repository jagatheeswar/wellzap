import React,{ useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Sidebar from '../../Components/Sidebar/Sidebar'
import { selectUser, selectUserData, selectUserType, setUserData } from '../../features/userSlice'
import { db } from '../../utils/firebase';
import AthleteHome from './AthleteHome';
import CoachHome from './CoachHome';
import './Home.css'

function Home() {
    const user = useSelector(selectUser);
    const userData = useSelector(selectUserData);
    const userType = useSelector(selectUserType);
    const dispatch = useDispatch();

    return (
        <div className="home">
            <div className="home__container">
            <Sidebar />
            <div className="home__main">
            {userType === "athlete" ? <AthleteHome /> : <CoachHome />}
            </div>
            </div>
        </div>
    )
}

export default Home
