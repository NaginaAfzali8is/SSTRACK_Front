import React, { useEffect, useRef, useState } from "react";
import logo from '../../images/ss-track-logo.svg';
import dashboard from "../../images/dashboard.webp";
import account from "../../images/myaccount.webp";
import logout from "../../images/logout.webp";
import { useNavigate } from "react-router-dom";
import UserDashboardSection from "../../screen/component/userDashboardsection";
import { useDispatch } from "react-redux";
import { setLogout } from "../../store/timelineSlice";

function UserHeader() {

    const user = JSON.parse(localStorage.getItem('items'));
    const [showContent, setShowContent] = useState(false);
    const navigate = useNavigate("");
    const dispatch = useDispatch()

    const logoutDivRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (logoutDivRef.current && !logoutDivRef.current.contains(event.target)) {
                setShowContent(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    function logOut() {
        localStorage.removeItem("items");
        localStorage.removeItem("token");
        dispatch(setLogout())
        navigate("/")
        setTimeout(() => {
            window.location.reload()
        }, 1000);
        setShowContent(false)
    }

    function takeToDashboard() {
        setShowContent(false)
        navigate("/dashboard")
    }

    function takeToAdmin() {
        setShowContent(false)
        navigate("/account")
    }

    function takeToSettings() {
        setShowContent(false)
        navigate("/effective-settings")
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
                        {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button> */}
                        </div>
                    <div ref={logoutDivRef}>
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
                            {user.userType === "user" ? null : (
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
                </div>
            </nav>
            <UserDashboardSection />
            {/* <img className="line" src={line} /> */}
        </section>
    )
}

export default UserHeader;