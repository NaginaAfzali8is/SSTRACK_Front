import React from "react";
import menu from "../../images/menu.webp";
import loader from "../../images/Rectangle.webp";
import check from "../../images/check.webp";
import circle from "../../images/circle.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";

function UserDashboardSection(params) {

    const navigate = useNavigate();
    const location = useLocation();
    const items = JSON.parse(localStorage.getItem('items'));

    console.log(items);

    // return (
    //     <div className="cursor-pointer">
    //         <div className="d-flex justify-content-between align-items-center" style={{
    //             backgroundColor: "white",
    //             padding: "10px 20px",
    //             borderBottomLeftRadius: "10px",
    //             borderBottomRightRadius: "10px",
    //             margin: "0 30px 0 30px",
    //         }}>
    //             <div className="d-flex gap-1 align-items-center">
    //                 <div className={location.pathname === "/dashboard" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate(`/timeline/${items?._id}`)}>
    //                     <p style={{ margin: 0 }} onClick={() => {
    //                         navigate('/dashboard')
    //                     }}>Dashboard</p>
    //                 </div>
    //                 {items?.userType === "user" && <div className={location.pathname.includes("/timeline") ? "active-tab" : "ownerSectionUser"} onClick={() => navigate(`/timeline/${items?._id}`)}>

    //                     <p style={{ margin: 0 }} onClick={() => navigate(`/timeline/${items?._id}`)}>My timeline</p>
    //                 </div>}
    //                 {(items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager") && (
    //                     <>
    //                         <div className={location.pathname === "/team" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/team')}>
    //                             <p style={{ margin: 0 }} onClick={() => navigate('/team')}>Team</p>
    //                         </div>
    //                     </>
    //                 )}
    //                 <div className={location.pathname === "/reports" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/reports')}>
    //                     <p style={{ margin: 0 }} onClick={() => navigate('/reports')}>Reports</p>
    //                 </div>
    //             </div>
    //             <div>
    //                 <div className="ownerSectionCompany d-flex align-items-center cursor-none">
    //                     <div><img src={circle} /></div>
    //                     <p className="m-0">{items?.company}</p>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )
    return (

        // <div className="cursor-pointer">
        <div className="mt-3 d-flex justify-content-between align-items-center" style={{
            backgroundColor: "white",
            padding: "10px",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            margin: "0px 30px 0px 30px",
        }}>
            <div className="d-flex gap-1 align-items-center">

            </div>

            <div>

                <div className="d-flex align-items-center gap-4 justify-content-end mt-2 flex-end text-end cursor-none">
                    {/* <div><img src={circle} /></div> */}
                    <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/download")}>Download</p>
                    <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/pricing")}>Pricing</p>
                    <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/workCards")}>How It Work</p>
                </div>
            </div>
        </div>
  

    )
}

export default UserDashboardSection;