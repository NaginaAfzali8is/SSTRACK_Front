import React, { useState } from "react";
import logo from '../../images/ss-track-logo.svg';
import line from '../../images/line.webp';
import dashboard from "../../images/dashboard.webp";
import account from "../../images/myaccount.webp";
import logout from "../../images/logout.webp";
import { useNavigate } from "react-router-dom";
import AdminHead from "../../screen/component/adminHeadSection";
import UserDashboardSection from "../../screen/component/userDashboardsection";
import OwnerSection from "../../companyOwner/ownerComponent/ownerSection";
import SystemAdminHeader from "../../systemAdmin/component/systemAdminHeader";
import { useDispatch } from "react-redux";
import { setLogout } from "../../store/timelineSlice";

function UserHeader() {

    const user = JSON.parse(localStorage.getItem('items'));
    const [showContent, setShowContent] = useState(false);
    const navigate = useNavigate("");
    const dispatch = useDispatch()

    function logOut() {
        localStorage.removeItem("items");
        localStorage.removeItem("token");
        dispatch(setLogout())
        navigate("/signin")
        setShowContent(false)
    }

    function takeToDashboard() {
        setShowContent(false)
        if (user?.userType === "admin" || user?.userType === "manager") {
            navigate("/admindashboard")
        }
        else if (user?.userType === "user") {
            navigate("/userdashboard");
        }
        else if (user?.userType === "owner") {
            navigate("/company-owner");
        }
        else if (user?.userType === "system Admin") {
            navigate("/systemAdminDashboard");
        }
    }

    function takeToAdmin() {
        setShowContent(false)
        if (user?.userType === "admin" || user?.userType === "manager") {
            navigate("/adminaccount")
        }
        else if (user?.userType === "user") {
            navigate("/account");
        }
        else if (user?.userType === "owner") {
            navigate('/owner-account')
        }
    }

    function takeToSettings() {
        setShowContent(false)
        navigate("/setting")
    }

    const wordsAfterSpace = user?.name?.split(" ")[1] ? user?.name?.split(" ")[1].charAt(0).toUpperCase() : "";
    const capitalizedWord = user?.name?.charAt(0).toUpperCase();

    return (
        <section>
            <nav className="navbar navbar-expand-lg navbar-dark" style={{
                backgroundColor: "#0d3756",
                padding: "20px 30px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                margin: "30px 30px 0 30px",
            }}>
                <div className="container-fluid" style={{ position: "relative" }}>
                    <div>
                        <img onClick={() => navigate('/')} className="logo" src={logo} />
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button></div>
                    {/* <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Demo</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Pricing</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Download</a>
                        </li>
                    </ul>
                </div> */}
                    <div className="d-flex amButton" role="search">
                        <p>{user?.name.charAt(0).toUpperCase() + user?.name.slice(1)} ({user?.userType})</p>
                        <button onClick={() => setShowContent(!showContent)} className="userName">
                            {capitalizedWord + wordsAfterSpace}
                        </button>
                    </div>
                    {showContent && <div className="logoutDiv">
                        <div onClick={takeToDashboard}>
                            <div>
                                <img src={dashboard} />
                            </div>
                            <p>Dashboard</p>
                        </div>
                        <div onClick={takeToAdmin}>
                            <div>
                                <img src={account} />
                            </div>
                            <p>My Account</p>
                        </div>
                        {user.userType === "user" || user.userType === "owner" ? null : (
                            <div onClick={takeToSettings}>
                                <div>
                                    <img src={account} />
                                </div>
                                <p>Settings</p>
                            </div>
                        )}
                        <div onClick={logOut}>
                            <div>
                                <img src={logout} />
                            </div>
                            <p>Logout</p>
                        </div>
                    </div>}
                </div>
            </nav>
            {user?.userType === "owner" ? <OwnerSection /> :
             user?.userType === "admin" ? <AdminHead /> :
             user?.userType === "user" ? <UserDashboardSection /> :
             user?.userType === "system Admin" ? <SystemAdminHeader /> : ""}
            {/* <img className="line" src={line} /> */}
        </section>
    )
}

export default UserHeader;