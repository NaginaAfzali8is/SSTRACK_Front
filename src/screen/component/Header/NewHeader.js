import React from 'react';
import { Button, Container, Form, Nav, NavItem, NavLink, Navbar } from 'react-bootstrap';
import { Switch, FormControlLabel } from '@mui/material';

import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import logo from '../../../images/ss-track-logo.svg';
import { setLogout } from "../../../store/timelineSlice";

import NewHEaderOpions from './components/NewHeaderOptions';

const NewHeader = ({ scrollToSection1, scrollToSection2, language, handleToggleLanguage, show }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();

    function logOut() {
        // localStorage.removeItem("items");
        localStorage.removeItem("token");
        localStorage.removeItem("cachedData");
        dispatch(setLogout());
        navigate('/');
        window.location.reload();
    }

    function goToDashboard() {
        navigate('/splash');
    }

      const redirectToDashboard = () => {
    navigate('/dashboard'); // Redirect to the /dashboard route
  };
    // console.log(currentUser);
    const location = useLocation();

    // Conditional styles
    const navbarBackground =
        location.pathname === "/"
            ? "transparent"
            : "linear-gradient(90deg, #0D4873, #0A304B, #071F2D, #0C364F, #0D4873)";
    return (

        <section>

            <Navbar expand="lg" style={{
                background: navbarBackground,
                // padding: "0px 30px",
                // borderRadius: "20px",
                // margin: "30px 30px 0 30px",
            }}>

                <Container fluid>
                    <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img className="logo" src={logo} alt="Logo" />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbarSupportedContent" className="custom-toggler" style={{ color: 'white' }}>
                        {/* <span className="navbar-toggler-icon"></span> */}
                    </Navbar.Toggle>

                    <Navbar.Collapse id="navbarSupportedContent">
                        <Nav className="me-auto mb-2 mb-lg-0">


                        </Nav>
                        <Form className="d-flex">

                        </Form>

                        {!show && (
                            <div className="d-flex justify-content-center align-items-center" style={{ flex: 1 }}>
                                <div className="d-flex justify-content-center align-items-center">
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label={language === 'en' ? 'English' : 'العربية'}
                                        checked={language === 'ar'}
                                        onChange={handleToggleLanguage}
                                        style={{
                                            fontWeight: '400',
                                            color: 'white',
                                            '--bs-switch-handle-color': '#7ACB59', // Green color
                                            '--bs-switch-handle-border-color': '#7ACB59', // Green border
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className='align-items-center' style={{ marginTop: '-20px' }}>
                            <NewHEaderOpions language={language} />
                        </div>
                        <div className="d-flex flex-column flex-lg-row align-items-start gap-2">
                            <div className="d-lg-block d-none">
                                {/* <Button style={{ marginRight: token ? 10 : 50 }} onClick={() => navigate('/download')} className="signUpButton" type="button">Download</Button> */}
                                {!token ? (
                                    <>
                                        <Button onClick={() => navigate('/download')} className="signUpButton" type="button" style={{
                                            marginRight: '20px',
                                            fontWeight: '400', // Sinkin Sans weight
                                            fontSize: '0.8rem',
                                            fontFamily: "'Sinkin Sans', sans-serif",

                                        }}>{language === "en" ? "Download" : "تحميل"}</Button>
                                        <Button onClick={() => navigate('/signin')} className="btn loginButton1" type="button" style={{
                                            marginRight: '10px',
                                            fontWeight: '400', // Sinkin Sans weight
                                            fontSize: '0.8rem',  // Text size
                                            fontFamily: "'Sinkin Sans', sans-serif",
                                            borderColor: '#8CCA6B', // Border color
                                            borderWidth: '1px',    // Optional for a visible border
                                        }}>{language === "en" ? "Log In" : "تسجيل الدخول"}</Button>

                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => redirectToDashboard()} className="btn signUpButton" style={{
                                            marginRight: '0.8rem',
                                            fontWeight: '400', // Sinkin Sans weight
                                            fontSize: '0.8rem',  // Text size

                                        }} type="button"> {language === "en" ? "Dashboard" : "لوحة القيادة"}</Button>
            
          
                                        <Button onClick={() => logOut()} className="btn loginButton1" style={{
                                            marginRight: '10px',
                                            fontWeight: '400', // Sinkin Sans weight
                                            fontSize: '0.8rem',   // Text size
                                            borderColor: '#8CCA6B', // Border color
                                            borderWidth: '1px',    // Optional for a visible border
                                        }} type="button">{language === "en" ? "Log out" : "تسجيل الخروج"}
                                        </Button>
                                    </>
                                )}
                            </div>
                            <div className="d-lg-none d-block" style={{ color: 'white', fontWeight: 'bold' }}>

                                <NavItem>
                                    <NavLink href="#" onClick={() => navigate('/download')}>Download</NavLink>
                                </NavItem>
                                {!token ? (
                                    <>
                                        <NavItem>
                                            <NavLink href="#" onClick={() => navigate('/signin')}>Log In</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="#" onClick={() => navigate('/signup')}>Sign Up</NavLink>
                                        </NavItem>
                                    </>
                                ) : (
                                    <>
                                        <NavItem>
                                            <NavLink href="#" onClick={() => goToDashboard()}>Dashboard</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="#" onClick={() => logOut()}>Log out</NavLink>
                                        </NavItem>
                                    </>
                                )}
                            </div>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar >
        </section >
    );
};

export default NewHeader;




