import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, } from "react-router-dom";
import Signup from "../screen/signup";
import SignIn from "../screen/signin";
import UserDashboard from "../screen/userDashboard";
import Home from "../screen/home";
import UserDetails from "../screen/userDetails";
import Account from "../screen/account";
import Profile from "../screen/profile";
import ForgetPassword from "../screen/forgetpassword";
import Setting from "../adminScreens/setting";
import SystemAdminLogin from "../systemAdmin/systemAdminLogin";
import OwnerUserSignup from "../companyOwner/ownerUser";
import OwnerTeam from "../companyOwner/ownerTeam";
import Download from "../screen/download";
import CreateAccount from "../screen/createAccount";
import Layout from "../layout";
import UpdatePassword from "../screen/updatePassword";
import VerificationCode from "../screen/verificationCode";
import CaptureScreen from "../screen/captureScreen";
import OwnerReport from "../screen/owner-reports";
import OwnerUserTimeline from "../companyOwner/ownerUsersTimeline";
import PrivacyPolicy from "../screen/privacy-policy";
import PrivacyPolicy1 from '../screen/privacy-policy1'
import PrivacyPolicy2 from '../screen/privacy-policy2'

import Payment from "../screen/payment";
import axios from "axios";
import Pricing from '../screen/pricing'
import WorkCards from "../screen/workCards";
// import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import OwnerLeaveManagement from '../companyOwner/owner-setting-components/ownerLeaveManagement'
import SaLogin from '../SuperAdmin/SuperAdmin/saLogin'
import SaMain from '../SuperAdmin/SuperAdmin/saMain'
import UserSettings from '../companyOwner/owner-setting-components/userSetting'
import ApplyForLeave from '../companyOwner/owner-setting-components/ApplyForLeave'
import LocaitonTracking from "../Tracking/Locationtracking";
import NewHome from "../screen/LandingPage/newHome";
import AboutUs from "../screen/AboutUS/aboutUs";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import DashboardSplash from "../screen/spalsh/dashboardSplash";
import Project from "../screen/Project/Project";


export default function AppRouter() {

  // const tokenfromRedux = useSelector((state) => state.auth.token);
  // console.log("Token from Redux:", tokenfromRedux); 
  const [suspended, setSuspended] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  // const items = jwtDecode(JSON.stringify(token));
  // console.log('decoded data', items)

  useEffect(() => {
    const fetchTokenAndSuspendedStatus = async () => {
      if (token) {
        // console.log('++++++++++++++++++++', token)
        try {
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          const apiUrl = 'https://myuniversallanguages.com:9093/api/v1';
          const response = await axios.get(`${apiUrl}/owner/getCompanyInfo`, { headers });
          // For objects or arrays:
          const planindex = response?.data.data[0].planId.length - 1;
          const planId = response?.data.data[0].planId?.slice(-1)[0]?.id || null;
          // const planId = response?.data.data[0].planId[planindex].id;


          // Save to localStorage after converting to a string
          // localStorage.setItem('planId', JSON.stringify(planId));
          // localStorage.setItem('planIdforHome', JSON.stringify(planId));
          // Simulate a delay of 2 seconds
          setTimeout(() => {
            setSuspended(response?.data.data[0].suspended);
            setLoading(false); // Move this inside the timeout
          }, 2000);
        } catch (err) {
          console.error('Error fetching data%%%%%%%%%%%%%%%%%%%%%%%', err);
          let planId = null;
          localStorage.setItem('planId', JSON.stringify(planId));
          // localStorage.setItem('planIdforHome', JSON.stringify(planId));
        }
      }
      setLoading(false);
    };

    fetchTokenAndSuspendedStatus();
    console.log('suspended=========', suspended);

  }, [token]);



  useEffect(() => {
    if (!token) {
      setToken(localStorage.getItem("token"));
    }
  }, [token]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Layout />}> */}

            {/* Public Routes */}

            <Route path="/download" element={<Download />} />
            <Route path="/aboutUs" element={<AboutUs/>} />
            <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/dashboard" />} />
            <Route path="/account" element={token ? <Account suspended={suspended} /> : <Navigate to="/signup" />} />
            <Route path="/signin" element={!token ? <SignIn /> : <Navigate to="/splash" />} />
            {/* <Route path="/" element={!token ? <NewHome /> : <Navigate to="/signp" />} /> */}

            <Route path="/systemAdminLogin" element={<SystemAdminLogin />} />
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<NewHome />} />
            <Route path="/capture-screen" element={<CaptureScreen />} />
            <Route path="/:token" element={<Home />} />
            {/* <Route path="//:token" element={<Home />} /> */}

            <Route path="/create-account/:code/:email" element={<CreateAccount />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/update-password/:id" element={<UpdatePassword />} />
            <Route path="/verification-code" element={<VerificationCode />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy1" element={<PrivacyPolicy1 />} />
            <Route path="/privacy-policy2" element={<PrivacyPolicy2 />} />
            <Route path="/profile" element={<Profile />} />

            {/* <Route path="/dashboard" element={token ? (suspended ? <Navigate to="/" /> : <UserDashboard />) : <Navigate to="/" />} /> */}
            <Route path="/dashboard" element={token ? (suspended ? <Navigate to="/account" /> : <UserDashboard />) : <Navigate to="/" />} />
            <Route path="/splash" element={token ? (suspended ? <Navigate to="/account" /> : <DashboardSplash/>) : <Navigate to="/" />} />
            <Route path="/timeline" element={token ? (suspended ? <Navigate to="/account" /> : <UserDetails />) : <Navigate to="/" />} />
            <Route path="/timeline/:id" element={token ? (suspended ? <Navigate to="/account" /> : <UserDetails />) : <Navigate to="/" />} />
            <Route path="/account" element={token ? <Account /> : <Navigate to="/" />} />
            <Route path="/effective-settings" element={token ? (suspended ? <Navigate to="/account" /> : <Setting />) : <Navigate to="/" />} />

            <Route path="/user-setting" element={token ? (suspended ? <Navigate to="/account" /> : <UserSettings />) : <Navigate to="/" />} />

            <Route path="/team" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerTeam />) : <Navigate to="/" />} />
            <Route path="/reports" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerReport />) : <Navigate to="/" />} />
            <Route path="/Projects" element={token ? (suspended ? <Navigate to="/account" /> : <Project />) : <Navigate to="/" />} />
            <Route path="/company-owner-user" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerUserSignup />) : <Navigate to="/" />} />
            <Route path="/activity/:id" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerUserTimeline />) : <Navigate to="/" />} />
            <Route path="/profile" element={token ? (suspended ? <Navigate to="/account" /> : <Profile />) : <Navigate to="/" />} />
            <Route path="/leave-management" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerLeaveManagement />) : <Navigate to="/" />} />
            <Route path="/applyForLeave" element={token ? (suspended ? <Navigate to="/account" /> : <ApplyForLeave />) : <Navigate to="/" />} />
            <Route path="/Locationtracking" element={token ? (suspended ? <Navigate to="/account" /> : <LocaitonTracking />) : <Navigate to="/" />} />

            {/* <Route
              path="/profile"
              element={
                localStorage.getItem("googleEmail") ? (
                  <Profile />
                ) : (
                  <Navigate to="/" />
                )
              }
            /> */}

            {/* <Route path="/profile" element={token ? (suspended ? <Navigate to="/account" /> : <Profile />) : <Navigate to="/" />} /> */}
            <Route path="/pricing" element={token ? (suspended ? <Navigate to="/account" /> : <Pricing />) : <Navigate to="/" />} />
            <Route path="/workCards" element={token ? (suspended ? <Navigate to="/account" /> : <WorkCards />) : <Navigate to="/" />} />
            {/* <Route path="/privacy-policy" element={token ? <PrivacyPolicy /> : <Navigate to="/" />} /> */}
            {/* <Route path="/privacy-policy1" element={<PrivacyPolicy1/>} />
            <Route path="/privacy-policy2" element={<PrivacyPolicy2 />} /> */}
          {/* </Route> */}
          <Route path="*" element={<Navigate to="/signin" />} />
          <Route path="/sALogin" element={<SaLogin/>} />
          <Route path="/sADashboard" element={<SaMain/>} />
        </Routes>
      </Router>
    </>
  );
}



















// import PrivateRoute from "./PrivateRoutes"; // Adjust the path based on your file structure
// // import Layout from "../layout";
// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, } from "react-router-dom";
// // import Signup from "../screen/signup";
// // import SignIn from "../screen/signin";
// // import UserDashboard from "../screen/userDashboard";
// import Home from "../screen/home";
// import UserDetails from "../screen/userDetails";
// import Account from "../screen/account";
// import Profile from "../screen/profile";
// import ForgetPassword from "../screen/forgetpassword";
// import Setting from "../adminScreens/setting";
// import SystemAdminLogin from "../systemAdmin/systemAdminLogin";
// import OwnerUserSignup from "../companyOwner/ownerUser";
// import OwnerTeam from "../companyOwner/ownerTeam";
// import Download from "../screen/download";
// import CreateAccount from "../screen/createAccount";
// import Layout from "../layout";
// import UpdatePassword from "../screen/updatePassword";
// import VerificationCode from "../screen/verificationCode";
// import CaptureScreen from "../screen/captureScreen";
// import OwnerReport from "../screen/owner-reports";
// import OwnerUserTimeline from "../companyOwner/ownerUsersTimeline";
// import PrivacyPolicy from "../screen/privacy-policy";
// import PrivacyPolicy1 from '../screen/privacy-policy1'
// import PrivacyPolicy2 from '../screen/privacy-policy2'

// import Payment from "../screen/payment";
// import axios from "axios";
// import Pricing from '../screen/pricing'
// import WorkCards from "../screen/workCards";
// // import { GoogleOAuthProvider } from '@react-oauth/google';
// import { GoogleLogin } from '@react-oauth/google';
// import OwnerLeaveManagement from '../companyOwner/owner-setting-components/ownerLeaveManagement'
// import SaLogin from '../SuperAdmin/SuperAdmin/saLogin'
// import SaMain from '../SuperAdmin/SuperAdmin/saMain'
// import UserSettings from '../companyOwner/owner-setting-components/userSetting'
// import ApplyForLeave from '../companyOwner/owner-setting-components/ApplyForLeave'
// import LocaitonTracking from "../Tracking/Locationtracking";
// import NewHome from "../screen/LandingPage/newHome";
// import AboutUs from "../screen/AboutUS/aboutUs";
// import { useSelector } from "react-redux";
// import jwtDecode from "jwt-decode";
// import DashboardSplash from "../screen/spalsh/dashboardSplash";
// import Project from "../screen/Project/Project";

// // Import your components as usual
// import Signup from "../screen/signup";
// import SignIn from "../screen/signin";
// import UserDashboard from "../screen/userDashboard";
// // ... other imports

// export default function AppRouter() {
//   const [suspended, setSuspended] = useState(false);
//   const [token, setToken] = useState(localStorage.getItem("token"));

//   useEffect(() => {
//     // Fetch suspension status and token logic (same as your code)
//   }, [token]);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           {/* Public Routes */}
//           <Route path="/" element={<NewHome />} />
//           <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/dashboard" />} />
//           <Route path="/signin" element={!token ? <SignIn /> : <Navigate to="/splash" />} />
//           {/* ... other public routes */}

//           {/* Protected Routes */}
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute token={token} suspended={suspended}>
//                 <UserDashboard />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/team"
//             element={
//               <PrivateRoute token={token} suspended={suspended}>
//                 <OwnerTeam />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/reports"
//             element={
//               <PrivateRoute token={token} suspended={suspended}>
//                 <OwnerReport />
//               </PrivateRoute>
//             }
//           />
//           {/* Add more protected routes here */}
//         </Route>

//         {/* Catch-all Route */}
//         <Route path="*" element={<Navigate to="/signin" />} />
//       </Routes>
//     </Router>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, } from "react-router-dom";
// import Signup from "../screen/signup";
// import SignIn from "../screen/signin";
// import UserDashboard from "../screen/userDashboard";
// import Home from "../screen/home";
// import UserDetails from "../screen/userDetails";
// import Account from "../screen/account";
// import Profile from "../screen/profile";
// import ForgetPassword from "../screen/forgetpassword";
// import Setting from "../adminScreens/setting";
// import SystemAdminLogin from "../systemAdmin/systemAdminLogin";
// import OwnerUserSignup from "../companyOwner/ownerUser";
// import OwnerTeam from "../companyOwner/ownerTeam";
// import Download from "../screen/download";
// import CreateAccount from "../screen/createAccount";
// import Layout from "../layout";
// import UpdatePassword from "../screen/updatePassword";
// import VerificationCode from "../screen/verificationCode";
// import CaptureScreen from "../screen/captureScreen";
// import OwnerReport from "../screen/owner-reports";
// import OwnerUserTimeline from "../companyOwner/ownerUsersTimeline";
// import PrivacyPolicy from "../screen/privacy-policy";
// import PrivacyPolicy1 from '../screen/privacy-policy1'
// import PrivacyPolicy2 from '../screen/privacy-policy2'

// import Payment from "../screen/payment";
// import axios from "axios";
// import Pricing from '../screen/pricing'
// import WorkCards from "../screen/workCards";
// // import { GoogleOAuthProvider } from '@react-oauth/google';
// import { GoogleLogin } from '@react-oauth/google';
// import OwnerLeaveManagement from '../companyOwner/owner-setting-components/ownerLeaveManagement'
// import SaLogin from '../SuperAdmin/SuperAdmin/saLogin'
// import SaMain from '../SuperAdmin/SuperAdmin/saMain'
// import UserSettings from '../companyOwner/owner-setting-components/userSetting'
// import ApplyForLeave from '../companyOwner/owner-setting-components/ApplyForLeave'
// import LocaitonTracking from "../Tracking/Locationtracking";
// import NewHome from "../screen/LandingPage/newHome";
// import AboutUs from "../screen/AboutUS/aboutUs";
// import { useSelector } from "react-redux";
// import jwtDecode from "jwt-decode";
// import DashboardSplash from "../screen/spalsh/dashboardSplash";
// import Project from "../screen/Project/Project";

// import PrivateRoute from "./PrivateRoutes";

// export default function AppRouter() {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [suspended, setSuspended] = useState(false);

//   useEffect(() => {
//     // Fetch suspended status if token exists
//     if (token) {
//       // Example: Replace this with your actual API call
//       setSuspended(false); // Assume not suspended for demonstration
//     }
//   }, [token]);

//   return (
//     <Router>
//       <Routes>
//         {/* <Route path="/" element={<Layout />}> */}
//           {/* Public Route */}

//           {/* Protected Route */}
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute token={token} suspended={suspended}>
//                 <UserDashboard />
//               </PrivateRoute>
//             }
//           />
//         {/* </Route> */}
//       </Routes>
//     </Router>
//   );
// }
