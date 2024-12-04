import React, { useEffect, useState } from "react";
import axios from "axios";
import line from "../../images/Line 3.webp";

const OwnerTeam = () => {
    const [leaveRequest, setLeaveRequest] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
    });
    const [loading, setLoading] = useState(false);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [formSubmitting, setFormSubmitting] = useState(false);

    const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeaveRequest((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);
    
        console.log("Submitting Leave Request:", leaveRequest);
    
        try {
            const response = await axios.post(
                `${apiUrl}/timetrack/applyForLeave`,
                leaveRequest,
                { headers }
            );
    
            console.log("API Response:", response);
    
            if (response.status === 200) {
                alert("Leave request submitted successfully!");
                setLeaveRequest({
                    leaveType: "",
                    startDate: "",
                    endDate: "",
                    reason: "",
                });
    
                // Optionally update the UI with the new request
                setLeaveRequests((prev) => [...prev, leaveRequest]);
            } else {
                alert("Failed to submit leave request.");
            }
        } catch (error) {
            console.error("Error submitting leave request:", error);
    
            // Handle specific API errors
            if (error.response) {
                console.error("API Error Response:", error.response.data);
                alert(error.response.data.message || "An error occurred.");
            } else {
                alert("An error occurred while submitting the leave request.");
            }
        } finally {
            setFormSubmitting(false);
        }
    };
    

    return (
        <div className="container">
            <div className="userHeader">
                <h5>Apply For Leave</h5>
            </div>
            <div className="mainwrapper ownerTeamContainer" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                {/* Left Section */}
                <div
                    style={{
                        flex: "1",
                        backgroundColor: "#f9f9f9",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h3 style={{ color: "#0E4772", fontWeight: "600", marginBottom: "20px" }}>
                        Apply for Leave
                    </h3>
                    <form onSubmit={handleFormSubmit}>
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
                                Leave Type:
                            </label>
                            <select
                                name="leaveType"
                                value={leaveRequest.leaveType}
                                onChange={handleInputChange}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                }}
                                required
                            >
                                <option value="">Select Leave Type</option>
                                <option value="casualLeaves">Casual Leave</option>
                                <option value="sickLeaves">Sick Leave</option>
                                <option value="earnedLeaves">Earned Leave</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
                                Start Date:
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={leaveRequest.startDate}
                                onChange={handleInputChange}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
                                End Date:
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={leaveRequest.endDate}
                                onChange={handleInputChange}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
                                Reason:
                            </label>
                            <textarea
                                name="reason"
                                value={leaveRequest.reason}
                                onChange={handleInputChange}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                }}
                                rows="4"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#0E4772",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "600",
                            }}
                            disabled={formSubmitting}
                        >
                            {formSubmitting ? "Submitting..." : "Submit Leave Request"}
                        </button>
                    </form>
                </div>

                {/* Center Line */}
                <div>
                    <img src={line} style={{ height: "100%" }} alt="divider" />
                </div>

                {/* Right Section */}
                <div style={{ flexGrow: 1, paddingLeft: "20px" }}>
                    <h5 style={{ color: "#0E4772", fontWeight: "600" }}>Submitted Leave Requests</h5>
                    {leaveRequests.length > 0 ? (
                        <ul>
                            {leaveRequests.map((leave, index) => (
                                <li key={index} style={{ marginBottom: "10px" }}>
                                    <strong>Type:</strong> {leave.leaveType} <br />
                                    <strong>Start Date:</strong> {leave.startDate} <br />
                                    <strong>End Date:</strong> {leave.endDate} <br />
                                    <strong>Reason:</strong> {leave.reason}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No leave requests submitted yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerTeam;
