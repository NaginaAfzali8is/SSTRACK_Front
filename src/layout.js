import React, { useEffect, useState } from 'react';
import Header from './screen/component/header';
import Footer from './screen/component/footer';
import { Outlet, useLocation } from 'react-router-dom';
import UserHeader from './screen/component/userHeader';
import NewHeader from './screen/component/Header/NewHeader';

const Layout = () => {

  const location = useLocation()

  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between', marginTop:'-10px' }}>
      {
        location.pathname === "/" ||
          location.pathname === "/signin" ||
          location.pathname === "/signup" ||
          location.pathname === "/forgetpassword" ||
          location.pathname === "/download" ||
          location.pathname === "/systemAdminLogin" ||
          location.pathname === "/forget-password" ||
          location.pathname === "/file-upload" ||
          location.pathname === "/verification-code" ||
          location.pathname === "/privacy-policy" ||
          location.pathname === "/privacy-policy1" ||
          location.pathname === "/privacy-policy2" ||
          location.pathname === "/aboutUs" ||
          location.pathname === "/splash" ||
          location.pathname.startsWith("/update-password") ||
          location.pathname.startsWith("/create-account") ||
          location.pathname === "/download" ? (
          <></>
        ) : (
          location.pathname !== "/capture-screen" && <UserHeader />
          // <></>
        )
      }
      <div>
        <Outlet />
      </div>
      <div style={{ marginBottom:'0px' }}>
        {location.pathname !== "/capture-screen" && <Footer scrollToSection={scrollToSection} />}
      </div>
    </div>
  )
}

export default Layout;

// import React from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import Header from './screen/component/header';
// import Footer from './screen/component/footer';
// import UserHeader from './screen/component/userHeader';
// import NewHeader from './screen/component/Header/NewHeader';

// const Layout = () => {
//   const location = useLocation();

//   function scrollToSection(sectionId) {
//     const section = document.getElementById(sectionId);
//     if (section) {
//       window.scrollTo({
//         top: section.offsetTop,
//         behavior: 'smooth',
//       });
//     }
//   }

//   // Define routes where you don't want to display the header
//   const noHeaderRoutes = [
//     '/',
//     '/signin',
//     '/signup',
//     '/forgetpassword',
//     '/download',
//     '/systemAdminLogin',
//     '/forget-password',
//     '/file-upload',
//     '/verification-code',
//     '/privacy-policy',
//     '/privacy-policy1',
//     '/privacy-policy2',
//     '/aboutUs',
//     '/splash',
//     '/capture-screen',
//   ];

//   // Check if the current route starts with certain paths
//   const isUpdatePassword = location.pathname.startsWith('/update-password');
//   const isCreateAccount = location.pathname.startsWith('/create-account');

//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         minHeight: '100vh',
//         justifyContent: 'space-between',
//         marginTop: '-10px',
//       }}
//     >
//       {!noHeaderRoutes.includes(location.pathname) && !isUpdatePassword && !isCreateAccount && (
//         <UserHeader />
//       )}

//       <div>
//         <Outlet />
//       </div>

//       <div style={{ marginBottom: '0px' }}>
//         {location.pathname !== '/capture-screen' && <Footer scrollToSection={scrollToSection} />}
//       </div>
//     </div>
//   );
// };

// export default Layout;

// import React from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import UserHeader from './screen/component/userHeader';
// import Footer from './screen/component/footer';

// const Layout = () => {
//   const location = useLocation();

//   function scrollToSection(sectionId) {
//     const section = document.getElementById(sectionId);
//     if (section) {
//       window.scrollTo({
//         top: section.offsetTop,
//         behavior: 'smooth',
//       });
//     }
//   }

//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         minHeight: '100vh',
//         justifyContent: 'space-between',
//         marginTop: '-10px',
//       }}
//     >
//       {
//         location.pathname === "/" ||
//           location.pathname === "/signin" ||
//           location.pathname === "/signup" ||
//           location.pathname === "/forgetpassword" ||
//           location.pathname === "/download" ||
//           location.pathname === "/systemAdminLogin" ||
//           location.pathname === "/forget-password" ||
//           location.pathname === "/file-upload" ||
//           location.pathname === "/verification-code" ||
//           location.pathname === "/privacy-policy" ||
//           location.pathname === "/privacy-policy1" ||
//           location.pathname === "/privacy-policy2" ||
//           location.pathname === "/aboutUs" ||
//           location.pathname === "/splash" ||
//           location.pathname.startsWith("/update-password") ||
//           location.pathname.startsWith("/create-account") ||
//           location.pathname === "/download"
//           ? null // Excluded paths - no header
//           : location.pathname === "/capture-screen"
//             ? <UserHeader /> // Show UserHeader for /capture-screen
//             : null
//       }

//       {/* Main Content */}
//       <div>
//         <Outlet />
//       </div>

//       {/* Footer */}
//       <div style={{ marginBottom: '0px' }}>
//         {location.pathname !== "/capture-screen" && (
//           <Footer scrollToSection={scrollToSection} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Layout;


// import React from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import UserHeader from './screen/component/userHeader';
// import Footer from './screen/component/footer';

// const Layout = () => {
//   const location = useLocation();

//   // Define excluded paths
//   const excludedPaths = [
//     "/",
//     "/signin",
//     "/signup",
//     "/forgetpassword",
//     "/download",
//     "/systemAdminLogin",
//     "/forget-password",
//     "/file-upload",
//     "/verification-code",
//     "/privacy-policy",
//     "/privacy-policy1",
//     "/privacy-policy2",
//     "/aboutUs",
//     "/splash",
//   ];

//   // Check if the current path is excluded
//   const isExcludedPath =
//     excludedPaths.includes(location.pathname) ||
//     location.pathname.startsWith("/update-password") ||
//     location.pathname.startsWith("/create-account");

//   // Function to scroll to a specific section
//   const scrollToSection = (sectionId) => {
//     const section = document.getElementById(sectionId);
//     if (section) {
//       window.scrollTo({
//         top: section.offsetTop,
//         behavior: 'smooth',
//       });
//     }
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         minHeight: '100vh',
//         justifyContent: 'space-between',
//         marginTop: '-10px',
//       }}
//     >
//       {/* Render UserHeader unless the path is excluded */}
//       {!isExcludedPath && <UserHeader />}

//       {/* Main Content */}
//       <div>
//         <Outlet />
//       </div>

//       {/* Render Footer unless the path is excluded */}
//       <div style={{ marginBottom: '0px' }}>
//         {!isExcludedPath && <Footer scrollToSection={scrollToSection} />}
//       </div>
//     </div>
//   );
// };

// export default Layout;
