import React,{ useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectUser, selectUserData, selectUserType, setUserData } from '../../features/userSlice'
import { db } from '../../utils/firebase';
import './Home.css'

function AthleteHome() {
    const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
    const userType = useSelector(selectUserType);
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
       
            db.collection("athletes")
            .where("email", "==", user)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                setUserDetails({
                  id: doc.id,
                  data: doc.data(),
                });
               // dispatch(setLoading(false))
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
      
       
      }, [user]);
      
    return (
        <div className="athletehome">
            <h1>Hello, {userDetails?.data?.name}</h1>
        </div>
          
    )
}

export default AthleteHome
