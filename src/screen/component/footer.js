import React from "react";
import footerLogo from '../../images/FooterLogo.png';
import linkedin from '../../images/LinkdinIcon.webp';
import insta from '../../images/InstaIcon.webp';
import facebook from '../../images/FacebookIcon.webp';
import twitter from '../../images/TwiterIcon.webp';
import line from '../../images/line.webp';
import { useLocation, useNavigate } from "react-router-dom";


function Footer({ scrollToSection }) {

    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div className="footer">
            <div className="footerContent">
                <div className="footerLogo">
                    <img width={70} src={footerLogo} alt="FooterLogo.png" />
                </div>
                <div className="footerLinks">
                    {/* <p>Support</p> */}
                    <p onClick={() => location.pathname === "/" ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate("/")}>Home</p>
                    <p onClick={() => location.pathname === "/" ? scrollToSection('section1') : navigate("/")}>About us</p>
                    <p onClick={() => location.pathname === "/" ? scrollToSection('section2') : navigate("/")}>Contact</p>
                    <p onClick={() => navigate("/download")}>Download</p>
                    {/* <p>Terms</p> */}
                    {/* <p>Privacy</p> */}
                </div>
                <div>
                    <p className="text-white fs-8 mb-1">info@SSTRACK.IO</p>
                    <div className="footerSocialMedia">
                        <img src={linkedin} alt="LinkdinIcon.png" />
                        <img src={facebook} alt="FacebookIcon.png" />
                        <img src={insta} alt="InstaIcon.png" />
                        <img src={twitter} alt="TwiterIcon.png" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;