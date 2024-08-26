import React from "react";
import circle from "../../images/circle.webp"
import { useLocation, useNavigate } from "react-router-dom";

function OwnerSection() {

    let token = localStorage.getItem('token');
    const items = JSON.parse(localStorage.getItem('items'));
    const navigate = useNavigate()
    const location = useLocation()
    
    return (
        <div className="cursor-pointer">
            <div
                className="d-flex justify-content-between align-items-center"
                style={{
                    backgroundColor: "white",
                    padding: "10px 20px",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                    margin: "0 30px 0 30px",
                }}>
                <div className="d-flex gap-1 align-items-center">
                    <div className={location.pathname === "/company-owner" || location.pathname === "/company-owner/company-individual-user" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/company-owner')} >Dashboard</p>
                    </div>
                    {/* <div className={location.pathname === "/company-owner-user-signup" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/company-owner-user-signup')}>Add User</p>
                    </div> */}
                    <div className={location.pathname === "/owner-team" || location.pathname === "/owner-team/company-owner-user-signup" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/owner-team')}>Team</p>
                    </div>
                    <div className={location.pathname === "/owner-reports" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/owner-reports')}>Reports</p>
                    </div>
                    {/* <div className={location.pathname === "/owner-settings" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/owner-settings')}>Settings</p>
                    </div> */}
                </div>
                <div>
                    <div className="ownerSectionCompany d-flex align-items-center cursor-default">
                        <div><img src={circle} /></div>
                        <p className="m-0">{items?.company}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerSection;