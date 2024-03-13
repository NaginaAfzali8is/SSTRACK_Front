import React, { useEffect, useRef, useState } from "react";
import logo from "../images/logo.webp";
import banner from '../images/ss-track-banner.svg';
import start from "../images/button.webp";
import line from '../images/greenline.webp';
// import banners from './images/banner.png';
import logo1 from '../images/adit-logo.png.webp';
import logo2 from '../images/liveglam-logo.png.webp';
import logo3 from '../images/route4me-logo.png.webp';
import logo4 from '../images/wozu-logo.png.webp';
import logo5 from '../images/howsy-logo.png.webp';
import logo6 from '../images/kinetic-logo.png.webp';
import logo7 from '../images/callnovo-logo.png.webp';
import logo8 from '../images/plumbworld-logo.png.webp';
import hand from '../images/hand.webp';
import web from '../images/web.webp';
import insight from '../images/insight.webp';
import arrow from '../images/arrow.webp';
import Header from "./component/header";
import olivia from "../images/olivia.webp";
import pheonix from "../images/pheonix.webp";
import lana from "../images/lana.webp";
import candice from "../images/candice.webp";
import natali from "../images/natali.webp";
import drew from "../images/drew.webp";
import leftArrow from "../images/Leftarrow.webp";
import rightArrow from "../images/Rightarrow.webp";
import dean from "../images/manage.svg";
import reportImage from "../images/reports.webp";
import wifi from "../images/wifi.webp";
import innerSetting from "../images/innersetting.webp";
import userProfile from "../images/userProfile.webp";
import Footer from "./component/footer";
import lines from "../images/line.webp";
import greenBanner from "../images/greenBanner.png";
import employeeMonitor from '../images/Employee-Time-Tracking-1400-removebg-preview.png';
import { BsQuestionLg, BsTelephonePlusFill } from 'react-icons/bs'
import { IoMdMail } from 'react-icons/io'
import { FaQuestion } from 'react-icons/fa'
import ss1 from '../images/capture-1.png';
import ss2 from '../images/capture-2.png';
import ss3 from '../images/capture-3.png';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DownloadProduct from '../images/download-product.svg'
import { AiFillWindows, AiFillApple } from 'react-icons/ai'
import { BsWindows, BsApple } from 'react-icons/bs'
import { ImArrowUpRight2 } from 'react-icons/im'
import { TbSquareRoundedArrowRightFilled } from 'react-icons/tb'
import detailedTimeline from '../images/connecting-employess-with-manager.png'
import connectingemployees from '../images/connecting-employess-with-manager2.avif'
import simpleAccess from '../images/simple-access.jpg'
import effortlessTimeTrack from '../images/effortless-time-track.jpg'
import screenshot from '../images/screenshot.jpg'
import jwtDecode from "jwt-decode";
import axios from "axios";

function Home() {

  const { token } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [downloadOS, setDownloadOS] = useState("mac")
  const [accessToken, setAccessToken] = useState('');
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const [page, setPage] = useState(1)
  const [feedback, setFeedback] = useState([
    {
      page: 1,
      data: [
        {
          username: "Olivia Rhye",
          designation: "Expect Best",
          feedback: "“sstrack.io allows us to look over completed work by remote staff, shows when my staff is working and keeps a backup of work produced. Highly recommend!”",
          img: olivia,
        },
        {
          username: "Phoenix Baker",
          designation: "Engineering Manager",
          feedback: "“sstrack.io makes it easy for us to manage the staff at different branch offices of Visas Avenue. The different locations of work is not a hurdle anymore. Thank you sstrack.io!”",
          img: pheonix,
        },
        {
          username: "Lana Steiner",
          designation: "Product Manager",
          feedback: "“The best way to follow your team overseas is to actually see what they're doing...”",
          img: lana,
        },
        {
          username: "Candice Wu",
          designation: "Backend Developer",
          feedback: "“sstrack.io allows us to look over completed work by remote staff, shows when my staff is working and keeps a backup of work produced. Highly recommend!”",
          img: candice,
        },
        {
          username: "Phoenix Baker",
          designation: "Product Designer",
          feedback: "“sstrack.io makes it easy for us to manage the staff at different branch offices of Visas Avenue. The different locations of work is not a hurdle anymore. Thank you sstrack.io!”",
          img: pheonix,
        },
        {
          username: "Drew Cano",
          designation: "UX Researcher",
          feedback: "“The best way to follow your team overseas is to actually see what they're doing...”",
          img: drew,
        },
      ]
    },
    {
      page: 2,
      data: [
        {
          username: "Lana Steiner",
          designation: "Product Manager",
          feedback: "“The best way to follow your team overseas is to actually see what they're doing...”",
          img: lana,
        },
        {
          username: "Phoenix Baker",
          designation: "Engineering Manager",
          feedback: "“sstrack.io makes it easy for us to manage the staff at different branch offices of Visas Avenue. The different locations of work is not a hurdle anymore. Thank you sstrack.io!”",
          img: pheonix,
        },
        {
          username: "Olivia Rhye",
          designation: "Expect Best",
          feedback: "“sstrack.io allows us to look over completed work by remote staff, shows when my staff is working and keeps a backup of work produced. Highly recommend!”",
          img: olivia,
        },
        {
          username: "Phoenix Baker",
          designation: "Product Designer",
          feedback: "“sstrack.io makes it easy for us to manage the staff at different branch offices of Visas Avenue. The different locations of work is not a hurdle anymore. Thank you sstrack.io!”",
          img: pheonix,
        },
        {
          username: "Drew Cano",
          designation: "UX Researcher",
          feedback: "“The best way to follow your team overseas is to actually see what they're doing...”",
          img: drew,
        },
        {
          username: "Candice Wu",
          designation: "Backend Developer",
          feedback: "“sstrack.io allows us to look over completed work by remote staff, shows when my staff is working and keeps a backup of work produced. Highly recommend!”",
          img: candice,
        },
      ]
    },
  ])
  const apiUrl = process.env.REACT_APP_API_URL;

  const scrollToSection1 = () => {
    section1Ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection2 = () => {
    section2Ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  console.log(location);
  console.log(token);

  async function signin() {
    const decoded = jwtDecode(token);
    localStorage.setItem("items", JSON.stringify(decoded));
    localStorage.setItem("token", token);
    console.log(token);
    console.log(decoded);
    if (decoded._id) {
      if (decoded.userType === "admin") {
        navigate(`/admindashboard`)
      }
      else if (decoded.userType === "user") {
        navigate(`/userdashboard`)
      }
      else if (decoded.userType === "owner") {
        navigate(`/company-owner`)
      }
    }
  }

  useEffect(() => {
    signin()
  }, [])

  console.log(page);

  return (

    <div className="homeSection">

      <div>

        <section className='firstSection'>
          {/* <Header scrollToSection1={scrollToSection1} scrollToSection2={scrollToSection2} /> */}

          <div className='secondPart container'>
            <div>
              <p className='trackFont'>Track time, screenshots & productivity</p>
              <p className='trackPera'>Employee monitoring software for remote, office and freelance teams</p>
              <button className="downloadButton" onClick={() => navigate("/download")}>Download</button>

            </div>
            <div className="bannerDiv d-flex">
              <img className="banner" src={banner} />
            </div>
          </div>
        </section>

        <section className='secondSection'>
          <div className="container">

            <div>
              <p className='ethical'>Monitor employee hours and screen captures online.</p>
              <p className='employee'>Discover how much time and money your remote or office team dedicates to each task.</p>
            </div>
            <div className='cardSection'>
              <div className='box'>
                <img src={ss1} alt="" style={{ width: "200px", height: "200px", borderRadius: "100%", objectFit: "cover", border: "10px solid #7ACB59" }} />
                <p className='trackEffort'>Manage employee time logs and screen captures digitally.</p>
                <p className='trackEffortPera'>Employees independently manage the start and stop of their tracking using a streamlined desktop app.</p>
                {/* <img className='arrow' src={arrow} /> */}
              </div>
              <div className='box'>
                <img src={ss2} alt="" style={{ width: "200px", height: "200px", borderRadius: "100%", objectFit: "cover", border: "10px solid #7ACB59" }} />
                <p className='trackEffort'>Access it online</p>
                <p className='trackEffortPera'>The tracked time, screenshots and activity are all sent to the web for the employee. </p>
                {/* <img className='arrow' src={arrow} /> */}
              </div>
              <div className='box'>
                <img src={ss3} alt="" style={{ width: "200px", height: "200px", borderRadius: "100%", objectFit: "cover", border: "10px solid #7ACB59" }} />
                <p className='trackEffort'>Get insights</p>
                <p className='trackEffortPera'>Get a clear picture of time and money spent on each task, project or client. best option.</p>
                {/* <img className='arrow' src={arrow} /> */}
              </div>
            </div>
            <div style={{
              textAlign: "center"
            }}>
              <button onClick={() => navigate('/signup')} className="btn signUpButton" type="submit">Sign up for free!</button>
            </div>
          </div>
        </section>

      </div>

      <section className="thirdSection">
        <div className="container">
          <p className="millionHours">
            Over million hours tracked each month <br />
            15M+ screenshots monthly
          </p>
          {/* <button className="joinButton">Join them now</button> */}

          <div className="feedbackDiv">

            {feedback?.map((feed, index) => feed.page === page ? feed.data.map((data) => {
              return (
                <div className="feedbackBox">
                  <div>
                    <img className="olivia" src={data.img} />
                  </div>
                  <div className="oliviaDiv">
                    <p className="oliviafont">{data.username}</p>
                    <p className="oliviaGreen">{data.designation}</p>
                    <p className="oliviaPera">{data.feedback}</p>
                  </div>
                </div>
              )
            }) : null)}

            {/* <div className="feedbackBox" style={{ marginLeft: "20px", marginRight: "20px" }}>
              <div>
                <img className="olivia" src={pheonix} />
              </div>
              <div className="oliviaDiv">
                <p className="oliviafont">Phoenix Baker</p>
                <p className="oliviaGreen">Engineering Manager</p>
                <p className="oliviaPera">“sstrack.io makes it easy for us to manage the staff at different branch offices of Visas Avenue. The different locations of work is not a hurdle anymore. Thank you sstrack.io!”</p>
              </div>
            </div>

            <div className="feedbackBox">
              <div>
                <img className="olivia" src={lana} />
              </div>
              <div className="oliviaDiv">
                <p className="oliviafont">Lana Steiner</p>
                <p className="oliviaGreen">Product Manager</p>
                <p className="oliviaPera">“The best way to follow your team overseas is to actually see what they're doing...”</p>
              </div>
            </div>

            <div className="feedbackBox">
              <div>
                <img className="olivia" src={candice} />
              </div>
              <div className="oliviaDiv">
                <p className="oliviafont">Candice Wu</p>
                <p className="oliviaGreen">Backend Developer</p>
                <p className="oliviaPera">“sstrack.io is the most efficient way to track hours, manage projects, and most importantly your people! With one scroll through the home page, you'll know what everyone is working on.”</p>
              </div>
            </div>

            <div className="feedbackBox" style={{ marginLeft: "20px", marginRight: "20px" }}>
              <div>
                <img className="olivia" src={natali} />
              </div>
              <div className="oliviaDiv">
                <p className="oliviafont">Natali Craig</p>
                <p className="oliviaGreen">Product Designer</p>
                <p className="oliviaPera">“I've been using sstrack.io for several years and it has been a great tool. As my company grows, it’s easy to add people and get reports sent to me every week.”</p>
              </div>
            </div>

            <div className="feedbackBox">
              <div>
                <img className="olivia" src={drew} />
              </div>
              <div className="oliviaDiv">
                <p className="oliviafont">Drew Cano</p>
                <p className="oliviaGreen">UX Researcher</p>
                <p className="oliviaPera">“sstrack.io is price competitive and the most reliable tool on the market. It tracks screens, prevents cheating, and doesn’t provide unnecessary features.”</p>
              </div>
            </div> */}

          </div>

          <div className="leftRightArrow">
            <div onClick={() => setPage(page > 1 ? page - 1 : page)} style={{ cursor: "pointer" }}>
              <img src={leftArrow} />
            </div>
            <p>{page}</p>
            <div onClick={() => setPage(page < 2 ? page + 1 : page)} style={{ cursor: "pointer" }}>
              <img src={rightArrow} />
            </div>
          </div>

          {/* <div className="trialDiv">
            <div className="freeTrialDiv">
              <div>
                <p className="startedFont">Start your 30-day free trial</p>
                <p className="unitedFont">Become part of the 4,000+ startups thriving with Untitled.</p>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      <section className="deanDiv container" id="section1">
        <div>
          <img className="deanBanner" src={banner} />
        </div>
        <div>
          <p className="employetime">Employees track time</p>
          <p className="managerFont">
            A manager invites employees to sstrack.io, where they download a streamlined desktop application, choose a project to work on, and hit the Start button. This initiates tracking, sending data to the web instantly until they press the Stop button.
          </p>
        </div>
      </section>
      <section className="deanDiv container">
        <div>
          <p className="employetime">Managers view it on the web</p>
          <p className="managerFont">Within their sstrack.io dashboards, both the employee and manager have access to insights on the employee's working periods, task duration, screen captures taken at random moments, activity metrics, applications operated, along with the websites visited and their respective browsing times.</p>
          {/* <button className="startedButton">Explore</button> */}
        </div>
        <div>
          <img className="deanBanner" src={dean} />
        </div>
      </section>
      <section className="fourSection">
        <div className="container">
          <div className="employeesDiv">
            <p className='ethical'>Get reports you need, at a glance</p>
            <p className='employees'>Generate reports and charts on employees, clients and projects. Download in Excel for further analysis or to create invoices. Share with your clients. Set up automated emails. All in a few clicks.</p>
          </div>

          <div className="trialDiv">
            <div className="freeTrialDiv">
              <div>
                <p className="startedFont">Start your 30-day free trial</p>
                <p className="unitedFont">Join over 4,000+ startups already growing with Untitled.</p>
              </div>
              {/* <div className="startedButtonDiv">
                <button className="learnMoreButton">Learn More</button>
                <button className="startedButton">Get Started</button>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <section className="fiveSection" style={{ backgroundColor: "whitesmoke" }}>
        <div>
          <img className="wifi" src={wifi} />
          <p className="internetFont">Track without Internet</p>
          <p className="internetPera">The app will continue time tracking and screenshot capture even without an Internet connection and will sync when the connection is restored.</p>
        </div>
        <div>
          <img className="wifi" src={userProfile} />
          <p className="internetFont">As simple as it gets</p>
          <p className="internetPera">Our uncluttered, polished and fast interface will make it more satisfying to use than anything else on the market.</p>
        </div>
        <div>
          <img className="wifi" src={innerSetting} />
          <p className="internetFont">Integrate using Web API</p>
          <p className="internetPera">Connect your existing software to sstrack.io via API to retrieve tracked time and notes.</p>
        </div>
      </section>

      <section id="section1" ref={section1Ref}>
        <div className='how-it-works-container'>
          <div style={{
            padding: "40px",
          }}>
            <div>

              <p className="how-it-works-title">How It Works ?</p>

              <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
                <div>
                  <p className="features-title"> <ImArrowUpRight2 size={20} /> Connecting Employees with Managers - <span style={{ fontWeight: "700", color: "#7ACB59", margin: "0" }}>SSTRACK.IO</span> <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                  <p className="features-working">When you sign up as a company owner or join as admin, you can invite employees to join. As an admin, you can add your team members. When employees log in, they can easily start keeping track of time and share screenshots for their work.</p>
                </div>
                <div>
                  <img style={{ width: "300px", height: "300px", objectFit: 'contain' }} src={connectingemployees} alt="" />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
                <div>
                  <p className="features-title"> <ImArrowUpRight2 size={20} /> Simple Access with Log In - <span style={{ fontWeight: "700", color: "#7ACB59", margin: "0" }}>SSTRACK.IO</span> <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                  <p className="features-working">
                    Employees just need to install the SSTRACK.IO app on their computer. After logging in, they can click "Start" to begin tracking time and taking screenshots for their tasks. The app automatically sends this info to our website.
                  </p>
                </div>
                <div>
                  <img style={{ width: "300px", height: "300px", objectFit: 'contain' }} src={simpleAccess} alt="" />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
                <div>
                  <p className="features-title"> <ImArrowUpRight2 size={20} /> Effortless Time Tracking - <span style={{ fontWeight: "700", color: "#7ACB59", margin: "0" }}>SSTRACK.IO</span> <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                  <p className="features-working">
                    Our app records work hours and takes screenshots in the background. It does this randomly and stops when the user clicks "Stop." This feature is great for keeping tabs on in-office employees without being sneaky. Employees always know the app is running.
                  </p>
                </div>
                <div>
                  <img style={{ width: "300px", height: "300px", objectFit: 'contain' }} src={effortlessTimeTrack} alt="" />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
                <div>
                  <p className="features-title"> <ImArrowUpRight2 size={20} /> Clear View - <span style={{ fontWeight: "700", color: "#7ACB59", margin: "0" }}>SSTRACK.IO</span> <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                  <p className="features-working">
                    Our app sends time and screenshot info to our website, so admins can see what's happening in real-time. Admins don't need to install anything else; they can check everything online on SSTRACK.IO. The dashboard shows how long employees worked, who's active now, and the latest screenshots.
                  </p>
                </div>
                <div>
                  <img style={{ width: "300px", height: "300px", objectFit: 'contain' }} src={screenshot} alt="" />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
                <div>
                  <p className="features-title"> <ImArrowUpRight2 size={20} /> Detailed Timeline - <span style={{ fontWeight: "700", color: "#7ACB59", margin: "0" }}>SSTRACK.IO</span> <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                  <p className="features-working">
                    The employee timeline gives a detailed view: time and money spent on each task, how active the user was, which apps were used, and visited websites. It also includes screenshots taken randomly (up to 30 per hour) throughout the day. This gives a complete picture of the employee's day.
                  </p>
                </div>
                <div>
                  <img style={{ width: "300px", height: "300px", objectFit: 'contain' }} src={detailedTimeline} alt="" />
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <section ref={section2Ref} id="section2" className="contact-us-container">
        <div className="lightGreen">
          <div className="formFullDiv">
            <div className="firstFormPart">
              <h3 className="contactUs">Contact us</h3>
              <p className="query">For any questions or feedback please feel free to contact us using
                the form below, or email us at <span style={{ color: "#7ACB59" }}>info@SSTRACK.IO</span></p>
            </div>
            <form className="fullForm">
              <div>
                <p className="firstNameHead">First Name</p>
                <p><input type="text" className="firstName" placeholder="Enter your first name" /></p>
              </div>
              <div>
                <p className="firstNameHead">last Name</p>
                <p><input type="text" className="firstName" placeholder="Enter your last name" /></p>
              </div>
              <div>
                <p className="firstNameHead">Email</p>
                <p><input type="text" className="firstName" placeholder="Enter your email" /></p>
              </div>
              <div>
                <p className="firstNameHead">Phone Number</p>
                <p><input type="email" className="firstName" placeholder="Enter your phone number" /></p>
              </div>
              <div>
                <p className="firstNameHead">Company Name</p>
                <p><input type="text" className="firstName" placeholder="Enter your company name" /></p>
              </div>
            </form>
            <div>
              <button className="btn formButton btn-success">Send</button>
            </div>
          </div>
        </div>
        <div className="publicRelation">
          <div className="halfPart">
            <div style={{ display: "flex", alignItems: "center", margin: "0 0 10px 0" }}>
              {/* <div style={{
                backgroundColor: "white",
                width: "40px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "100%",
                margin: "0 20px 0 0"
              }}>
                <FaQuestion color="#09A144" size={20} />
              </div> */}
              <h2 style={{ margin: "0" }}>For help & Support</h2>
            </div>
            {/* <div style={{ display: "flex", alignItems: "center", margin: "0 0 10px 0" }}>
              <div style={{
                backgroundColor: "white",
                width: "40px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "100%",
                margin: "0 20px 0 0"
              }}>
                <BsTelephonePlusFill color="#09A144" size={20} />
              </div>
              <p style={{ margin: "0", fontWeight: '600' }}>+1 647-699-4687</p>
            </div> */}
            <div style={{ display: "flex", alignItems: "center", }}>
              <div style={{
                backgroundColor: "white",
                width: "40px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "100%",
                margin: "0 20px 0 0"
              }}>
                <IoMdMail color="#09A144" size={20} />
              </div>
              <p style={{ margin: "0", fontWeight: '600' }}>info@SSTRACK.IO</p>
            </div>
          </div>
          <div>
            <img width="100%" src={employeeMonitor} alt="" />
          </div>
        </div>
      </section>

      <section className="eightSection">
        <div className="container">
          <p className="employeeTracking">Start employee time tracking!</p>
          <button className="startnowButton" onClick={() => navigate("/download")}>Start Now</button>
          <p className="creditCancel">No credit card required. Cancel anytime.</p>
        </div>
        <div>
          <img src={lines} className="homeLine" />
        </div>
        {/* <Footer /> */}
      </section>

    </div>

  )

}

export default Home;