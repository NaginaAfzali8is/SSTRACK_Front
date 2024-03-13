import React from "react";
import logo from '../../images/ss-track-logo.svg';
import { useNavigate } from "react-router-dom";
import line from '../../images/line.webp';
import { setLogout } from "../../store/timelineSlice";
import { useDispatch } from "react-redux";

function Header({ scrollToSection1, scrollToSection2 }) {

    const navigate = useNavigate()
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('items'));
    const dispatch = useDispatch()

    function logOut() {
        localStorage.removeItem("items");
        localStorage.removeItem("token");
        dispatch(setLogout())
        window.location.reload()
    }

    function goToDashboard() {
        if (currentUser.userType === "owner") {
            navigate('/company-owner')
        }
        if (currentUser.userType === "admin") {
            navigate('/admindashboard')
        }
        if (currentUser.userType === "user") {
            navigate('/userdashboard')
        }
    }

    return (
        <section>
            <nav class="navbar navbar-expand-lg navbar-dark" style={{
                backgroundColor: "#0d3756",
                padding: "20px 30px",
                borderRadius: "20px",
                margin: "30px 30px 0 30px",
            }}>
                <div class="container-fluid">
                    <img onClick={() => navigate('/')} className="logo" src={logo} />
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="d-flex" role="search" id="header-nav">
                        <button style={{ marginRight: token ? 10 : 50 }} onClick={() => navigate('/download')} class="btn signUpButton" type="submit">Download</button>
                        {!token ? (
                            <>
                                <button onClick={() => navigate('/signin')} class="btn loginButton" type="submit">Log In</button>
                                <button onClick={() => navigate('/signup')} class="btn signUpButton" type="submit">Sign Up</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => goToDashboard()} class="btn loginButton" type="submit">Dashboard</button>
                                <button onClick={() => logOut()} class="btn signUpButton" type="submit">Log out</button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            {/* <img className="line" src={line} /> */}
        </section>
    )
}

export default Header;