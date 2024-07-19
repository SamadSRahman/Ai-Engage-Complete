import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import logo from './aiengagelogo.png';

const Navbar = () => {
  const {logoutRequest} = useParams()
      const navigate = useNavigate();
      // Retrieve accessToken from localStorage
      const accessToken = localStorage.getItem('accessToken');
      console.log("Acesss Token:", accessToken)
      const userName = localStorage.getItem('userName');
      const [isSubscribed, setIsSubscribed] = useState(null);
      const [isTrialActive, setIsTrialActive] = useState(null);


  
      useEffect(() => {
        // Fetch user subscription information only if accessToken is available
        if (accessToken) {
          axios.get('https://stream.xircular.io/api/v1/subscription/getCustomerSubscription', {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
          .then(response => {
            const user = response.data[0]; // Adjust based on the actual response structure
              console.log(user);
              setIsSubscribed(user.isSubscribed);
              setIsTrialActive(user.isTrialActive);
          })
          .catch(error => {
            console.error("Error fetching user subscription data", error);
          });
        }
      }, [accessToken]);

      // Define a function to extract the name from the email
      const extractNameFromEmail = (email) => {
        // Split the email by '@' symbol and return the first part (name)
        return email.split('@')[0];
      };

  // If accessToken exists, extract the name from it
  // Otherwise, set the name to an empty string
  const Name = userName ? extractNameFromEmail(userName) : '';

      const handlelogout = () =>{
               localStorage.clear();
               window.location.reload();
      }


  return (
    <div className='navbar'>

      <div className='logowrapper'>
        <img src={logo}  alt="Online video survey maker" />
      </div>
   
      {/* Render the "Sign in" button if accessToken does not exist */}
       { !accessToken &&
           ( <button className='' onClick={() => navigate("/SignUp")}>
                Signup/SignIn
             </button> )
         }


      {/* Render the userName if it exists */}
      {userName && (   
        <div className='userName' >
         {/*   <p>  Hi,{Name}   </p> */}
           <button
            className='gotodashboard' 
            onClick={() => window.location.href = `https://new-video-editor.vercel.app/listings?accessToken=${accessToken}`}
            disabled={isSubscribed === false && isTrialActive === false}
            > Go to Dashboard </button>  

             <button className='logoutbtn' onClick={ handlelogout }> Logout </button>
           </div>   
          )}

    </div>
  );
};

export default Navbar;
