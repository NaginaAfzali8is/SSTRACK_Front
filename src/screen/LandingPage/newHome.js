import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apple from '../../images/apple.svg';
import chrome from '../../images/chrome.svg';
import laptopandmob from '../../images/laptopand mob.svg';
import microsoftlogo from '../../images/microsoft.svg';
import playstore from '../../images/playStore.svg';
import NavigationBar from '../../screen/component/header'; // Import your NavigationBar component
import NewHIW from '../LandingPage/Components/newHIW';
import ETIOP from '../LandingPage/Components/ETIOP'
import FeaturesSection from '../LandingPage/Components/FeaturesSection';
import ProductivitySection from '../LandingPage/Components/ProductivitySection';
import PricingSection from '../../screen/LandingPage/Components/PricingSection'
import DownaloadApp from '../LandingPage/Components/DownloadApp'
import FAQ from '../LandingPage/Components/FAQ';
import ContactSection from '../LandingPage/Components/ContactSection'
import StatsSection from '../LandingPage/Components/StatsSection';
import StartingSStrack from '../LandingPage/Components/StartingSStrack';
import translations from './Components/translations';
import NewHeader from '../component/Header/NewHeader';
import Footer from '../component/footer';

function NewHome() {
  const navigate = useNavigate();
  const contactSectionRef = useRef(null); // Create a ref for ContactSection

  const scrollToContactSection = () => {
    if (contactSectionRef.current) {
      contactSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [language, setLanguage] = useState('en');

  const handleToggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const currentText = translations[language];
  return (
    <>
      {/* Navbar */}

      {/* Main content */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowX: 'hidden',
        overflowY: 'auto',
        backgroundColor: '#ffffff',
        scrollbarWidth: 'none',
        fontFamily: "'Sinkin Sans', sans-serif",
        textAlign: language === 'ar' ? 'right' : 'left',
        // direction: language === 'ar' ? 'rtl' : 'ltr',
      }}>
        <div style={{ position: 'sticky', top: '0', width: '100%', zIndex: '10' }}>
          {/* <NavigationBar /> */}
          <NewHeader language={language} handleToggleLanguage={handleToggleLanguage} />
          {/* <button
            onClick={handleToggleLanguage}
            style={{
              position: 'absolute',
              top: '70px',
              right: language === 'ar' ? 'auto' : '20px',
              left: language === 'ar' ? '20px' : 'auto',
              padding: '5px 10px',
              backgroundColor: '#7ACB59',
              border: 'none',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '5px'
            }}
          >
            {language === 'en' ? 'العربية' : 'English'}
          </button> */}
        </div>
        <div style={{
          position: 'absolute',
          width: '150%',
          height: '190%',
          top: '-115%',
          background: 'linear-gradient(90deg, #0D4873, #0A304B, #071F2D, #0C364F, #0D4873)',
          borderRadius: '50%',
          zIndex: 1,
        }}></div>
        <div className="container" style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: '#ffffff',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            // fontFamily: "'Sinkin Sans', sans-serif",
            marginBottom: '30px',
            marginTop: '10%',
            fontFamily: "'Sinkin Sans', sans-serif",
          }}>{currentText.heading}</h1>
          <p style={{
            fontSize: '1rem',
            fontWeight: '400',
            marginBottom: '50px',
            textAlign: 'center',
            width: '75%',
            fontFamily: "'Sinkin Sans', sans-serif",
          }}>
            {currentText.description}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0',
            marginBottom: '2rem',
            width: '28%',
            maxWidth: '500px',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}>
            <input
              type="email"
              placeholder={currentText.signUpPlaceholder}
              className="form-control"
              style={{
                flex: '2',
                padding: '0.86rem 1rem',
                fontSize: '0.69rem',
                fontFamily: "'Sinkin Sans', sans-serif",
                border: 'none',
                outline: 'none',
                borderRadius: '0',
              }}
            />
            <button style={{
              padding: '0.9rem 2.7rem',
              fontSize: '0.69rem',
              fontFamily: "'Sinkin Sans', sans-serif",
              border: 'none',
              backgroundColor: '#7ACB59',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 'bold',
            }} onClick={() => navigate("/signup")}>{currentText.signUpButton}</button>
          </div>
          <p style={{
            fontSize: '1rem',
            fontWeight: '400',
            marginBottom: '2.49rem',
            marginTop: '1rem',
            fontFamily: "'Sinkin Sans', sans-serif",
          }}>
            {currentText.availablePlatforms}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            marginBottom: '2.49rem',
          }}>
            <img src={microsoftlogo} alt="Microsoft" style={{ width: '11rem' }} />
            <img src={apple} alt="Apple" style={{ width: '3rem' }} />
            <img src={playstore} alt="Google Play" style={{ width: '12rem' }} />
            <img src={chrome} alt="Chrome Web Store" style={{ width: '12rem' }} />
          </div>
        </div>

        {/* Mockup */}
        <img
          src={laptopandmob}
          alt="Laptop and Mobile Mockup"
          style={{
            position: 'relative',
            // top: '60%',
            width: '81%',
            zIndex: 2,
          }}
        />



      </div>
      <StatsSection  language={language}/>
      <div id="section1">
        <NewHIW  language={language}/>
      </div>
      <ETIOP language={language}/>
      <FeaturesSection language={language}/>
      <ProductivitySection language={language}/>
      <div id="pricing">
        <PricingSection onContactButtonClick={scrollToContactSection} language={language} />
      </div>
      <DownaloadApp  language={language} />
      <div id="faq">
      <FAQ onContactButtonClick={scrollToContactSection}  language={language} />
      </div>
      <div ref={contactSectionRef} id="section3">
        <ContactSection  language={language} />
      </div>
      <StartingSStrack language={language} />
      <Footer />
    </>
  );
}


export default NewHome;

