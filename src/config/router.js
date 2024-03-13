import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
  Navigate,
  useNavigate,
  useLocation
} from "react-router-dom";
import Signup from "../screen/signup";
import SignIn from "../screen/signin";
import UserDasboard from "../screen/userDashboard";
import Home from "../screen/home";
import UserDetails from "../screen/userDetails";
import Account from "../screen/account";
import Profile from "../screen/profile";
import SummaryReport from "../screen/owner-reports";
import AdminDashboard from "../adminScreens/adminDashboard";
import AdminUser from "../adminScreens/admiUser";
import AdminReport1 from "../adminScreens/admin1";
import ForgetPassword from "../screen/forgetpassword";
import AdminReport2 from "../adminScreens/admin2";
import AdminReport3 from "../adminScreens/admin3";
import AdminReport4 from "../adminScreens/admin4";
import AdminReport5 from "../adminScreens/admin5";
import SavedReport from "../screen/savedReport";
import UserSummary from "../screen/usersummary";
import AdminTeam from "../adminScreens/adminteam";
import Setting from "../adminScreens/setting";
// import URL from "../adminScreens/settingScreenComponent/url";
import AdminProject from "../adminScreens/adminProject";
import AdminClient from "../adminScreens/adminClient";
import AccountAdmin from "../adminScreens/adminAccountt";
import AdminTeamComponent from "../adminScreens/component/adminTeamComponent";
import SystemAdminLogin from "../systemAdmin/systemAdminLogin";
import SystemAdminDashboard from "../systemAdmin/systemAdminDashboard";
import CompanyOwner from "../companyOwner/companyOwner";
import OwnerUserSignup from "../companyOwner/ownerUser";
import CompanyIndividualUser from "../companyOwner/companyindividualUser";
import OwnerTeam from "../companyOwner/ownerTeam";
import OwnerAccount from "../companyOwner/ownerAccount";
import Download from "../screen/download";
import OwnerSettings from "../companyOwner/ownerSettings";
import CreateAccount from "../screen/createAccount";
import AdminReports from "../adminScreens/adminReports";
import Layout from "../layout";
import AdminUserSignup from "../adminScreens/adminUserSignup";
import UpdatePassword from "../screen/updatePassword";
import AddCompany from "../systemAdmin/addCompany";
import VerificationCode from "../screen/verificationCode";
import { CaptureScreenshot } from "../screen/component/captureScreenshot";
import CaptureScreen from "../screen/captureScreen";
import GeoxHR from "../screen/geoxHR";
import OwnerReport from "../screen/owner-reports";

export default function AppRouter() {

  const user = JSON.parse(localStorage.getItem("items"))
  const token = localStorage.getItem("token")
  const adminToken = localStorage.getItem("adminToken")
  const location = useLocation()
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshotCount, setScreenshotCount] = useState(0);
  const [videoStream, setVideoStream] = useState(null);
  const [captureInterval, setCaptureInterval] = useState(null);

  return (
    <>
      <Routes className="page-routes">
        <Route path="/clickHR-login" element={<GeoxHR />} />

        <Route path="/" element={<Layout />}>

          {/* Public Routes */}
          <Route path="/download" element={<Download />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin"
            element={token === null ? <SignIn /> :
              <Navigate
                to={
                  user?.userType === "owner" ? "/company-owner" :
                    user?.userType === "admin" ? "/admindashboard" :
                      user?.userType === "user" ? "/userdashboard" : ""
                } />
            } />
          <Route path="/systemAdminLogin" element={<SystemAdminLogin />} />
          <Route path="/" element={<Home />} />
          <Route path="/capture-screen" element={<CaptureScreen />} />
          <Route path="/:token" element={<Home />} />
          <Route path="/create-account/:code/:email" element={<CreateAccount />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/update-password/:id" element={<UpdatePassword />} />
          <Route path="/verification-code" element={<VerificationCode />} />

          {/* Private Routes */}

          {/* User routes */}
          <Route path="/userdashboard" element={token !== null && user?.userType === "user" ? <UserDasboard /> : <Navigate to="/" />} />
          <Route path="/userdashboard/userdetail" element={token !== null && user?.userType === "user" ? <UserDetails /> : <Navigate to="/" />} />
          <Route path="/usersummary" element={token !== null && user?.userType === "user" ? <UserSummary /> : <Navigate to="/" />} />
          <Route path="/account" element={token !== null && user?.userType === "user" ? <Account /> : <Navigate to="/" />} />

          {/* Owner routes */}
          <Route path="/company-owner" element={token !== null && user?.userType === "owner" ? <CompanyOwner /> : <Navigate to="/" />} />
          <Route path="/company-owner/company-individual-user" element={token !== null && user?.userType === "owner" ? <CompanyIndividualUser /> : <Navigate to="/" />} />
          <Route path="/owner-settings" element={token !== null && user?.userType === "owner" ? <OwnerSettings /> : <Navigate to="/" />} />
          <Route path="/owner-team" element={token !== null && user?.userType === "owner" ? <OwnerTeam /> : <Navigate to="/" />} />
          <Route path="/owner-account" element={token !== null && user?.userType === "owner" ? <OwnerAccount /> : <Navigate to="/" />} />
          <Route path="/owner-team/company-owner-user-signup" element={token !== null && user?.userType === "owner" ? <OwnerUserSignup /> : <Navigate to="/" />} />
          <Route path="/owner-reports" element={token !== null && user?.userType === "owner" ? <OwnerReport /> : <Navigate to="/" />} />

          {/* Admin routes */}
          <Route path="/admindashboard" element={token !== null && user?.userType === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admindashboard/admin-user-signup" element={<AdminUserSignup />} />
          <Route path="/adminProject" element={token !== null && user?.userType === "admin" ? <AdminProject /> : <Navigate to="/" />} />
          <Route path="/adminClient" element={token !== null && user?.userType === "admin" ? <AdminClient /> : <Navigate to="/" />} />
          <Route path="/adminaccount" element={token !== null && user?.userType === "admin" ? <AccountAdmin /> : <Navigate to="/" />} />
          <Route path="/adminTeamComponent" element={token !== null && user?.userType === "admin" ? <AdminTeamComponent /> : <Navigate to="/" />} />
          <Route path="/admindashboard/adminuser" element={token !== null && user?.userType === "admin" ? <AdminUser /> : <Navigate to="/" />} />
          <Route path="/adminteam" element={token !== null && user?.userType === "admin" ? <AdminTeam /> : <Navigate to="/" />} />
          <Route path="/setting" element={token !== null && user?.userType === "admin" ? <Setting /> : <Navigate to="/" />} />
          <Route path="/admin-reports" element={token !== null && user?.userType === "admin" ? <AdminReports /> : <Navigate to="/" />} />

          {/* System admin routes */}
          <Route path="/systemAdminDashboard" element={adminToken !== null && user?.userType === "system Admin" ? (
            <SystemAdminDashboard />
          ) : (
            <Navigate to="/" />
          )} />
          <Route path="/addCompany" element={adminToken !== null && user?.userType === "system Admin" ? (
            <AddCompany />
          ) : (
            <Navigate to="/" />
          )} />

          <Route path="/profile" element={token !== null ? <Profile /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/adminReport1" element={<AdminReport1 />} />
          <Route path="/adminreport2" element={<AdminReport2 />} />
          <Route path="/adminreport3" element={<AdminReport3 />} />
          <Route path="/adminreport4" element={<AdminReport4 />} />
          <Route path="/adminreport5" element={<AdminReport5 />} />
          <Route path="/savedReport" element={<SavedReport />} />

        </Route>

      </Routes>
    </>
  )
}