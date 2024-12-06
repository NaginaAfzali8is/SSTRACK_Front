import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { Form, Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";



const Pricing = () => {
    const section1Ref = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem('token');


    const [selectedPackage, setSelectedPackage] = useState();
    const [isloadning, setisloading] = useState(false);
    const navigate = useNavigate()
    const [email, setEmail] = useState();
    const [userCount, setUserCount] = useState('');
    const [ssstoredFor, setssstoredFor] = useState('');
    const [PaymentPlan, setPaymentPlan] = useState('');
    const [joinTiming, setJoinTiming] = useState(''); // New state for join timing
    const [phoneNo, setPhone] = useState('')
    const [companyName, setCompanyName] = useState('')
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);


    const plans = [
        { id: 1, name: 'Free' },
        { id: 2, name: 'Standard' },
        { id: 3, name: 'Premium' }
    ];

    const handleApply2 = async () => {
        setisloading(true)
        if (!email || !phoneNo || !companyName || !userCount || !joinTiming) {
            enqueueSnackbar("Please fill in all required fields.", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
            return;
        }

        const formData = {
            userCounts: userCount,
            paymentPlan: PaymentPlan, // Static value as per the context
            contactNumber: phoneNo,
            ssStoredFor: ssstoredFor,
            Discount: 0, // Assuming a default value for Discount
            totalAmount: 1000, // Replace with calculated or default value
            approved: 'pending', // Setting approved status as false by default
        };

        try {
            // Make API call with headers
            const response = await axios.post(
                "https://ss-track-xi.vercel.app/api/v1/owner/requestEnterprise",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Handle success
            if (response.status === 200 || response.status === 201) {
                enqueueSnackbar("Your application has been successfully submitted", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });

                setisloading(false)

                // Reset form fields
                // setEmail('');
                setssstoredFor('');
                setPhone('');
                setPaymentPlan('');
                setUserCount('');
                setJoinTiming('');
                handleCloseModal();
            }
        } catch (error) {
            // Handle errors

            setisloading(false)
            enqueueSnackbar("Failed to submit application. Please try again later.", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });

            console.error("API Error:", error.response ? error.response.data : error.message);
        }
    };

    // Retrieve the stored plan from localStorage and set the selected package
    useEffect(() => {
        const items = localStorage.getItem('items');
        if (items) {
            try {
                const parsedItems = JSON.parse(items); // Parse the JSON string
                if (parsedItems.email) {
                    setEmail(parsedItems.email); // Set email state
                }
                if (parsedItems.company) {
                    setCompanyName(parsedItems.company); // Set company name state
                }
            } catch (error) {
                console.error('Failed to parse localStorage item "items":', error);
            }

        }
        const storedPlanId = JSON.parse(localStorage.getItem('planIdforHome'));
        console.log('=====>>>>>>>', selectedPackage)
        // Check the stored plan type to set the selected package
        if (!storedPlanId?.planType || storedPlanId?.planType === 'free') {
            setSelectedPackage(1); // Free plan
        } else if (storedPlanId?.planType === 'standard') {
            setSelectedPackage(2); // Standard plan
        } else if (storedPlanId?.planType === 'premium') {
            setSelectedPackage(3); // Premium plan
        }
    }, []); // Empty dependency array to run only once on component mount


    const getButtonDisabled = (planId) => {

        // If token is not available, return false
        if (!token) {
            return false;
        }
        // If token is available, show relevant disabled state based on the selected plan
        if (planId === selectedPackage) {
            return 'Current'; // The user is already on this plan
        } else {
            return false;
        }
    };

    const isButtonDisabled = (planId) => {
        const buttonText = getButtonText(planId);
        // return getButtonText(planId) === 'Downgrade'; // Disable if "Downgrade" text is shown
        return buttonText === 'Downgrade' || buttonText === 'Current'; // Disable if "Downgrade" or "Current" text is shown
    };

    const handleUpgradeClicks = (selectedPlan) => {
        // setSelectedPackage(selectedPlan); // Update the selected package state
        // Navigate to the payment page, passing along the relevant data
        navigate('/account', {
            state: {
                defaultPlanIndex: selectedPlan
            }
        });
    };

    // Function to return the appropriate button text
    const getButtonText = (planId) => {
        // Check if token is available
        if (!token) {
            // If token is not available, show the plan names (Free, Standard, Premium)
            if (planId === 1) return 'Free';
            if (planId === 2) return 'Standard';
            if (planId === 3) return 'Premium';
        }

        // If token is available, show relevant text based on the selected plan
        if (planId === selectedPackage) {
            return 'Current'; // The user is already on this plan
        } else if (planId > selectedPackage) {
            return 'Upgrade'; // The plan is higher than the current one
        } else {
            return 'Downgrade'; // The plan is lower than the current one
        }
    };


    return (
        <>
            <SnackbarProvider />

            <div className='container' id="section3">
                <p className="how-it-works-title text-center">Company Plans & Pricing</p>
                <p className="text-center">These monthly plans are for Companies to track their employees or for freelancers to track their own time.
                    If you track your own time for other companies — you do not need a plan and do not have to pay — your company pays for you. Just ask your manager to send you an invitation email to their SSTrack team to start tracking your time and screenshots for them.</p>

                <div className="row justify-content-center align-items-center">

                    {/* ------------------------------ pricing card 1 ------------------------- */}

                    <div className="card m-3" style={{ width: "18rem", height: "44.5rem", backgroundColor: '#f2f5f5', border: "8px solid grey", borderRadius: "1rem" }}>
                        <div className="card-body">
                            <h5 className="card-title text-center fw-bold fs-2" style={{ color: "grey" }}>Free Trial</h5>
                            <div class="price-container">
                                {/* <span class="old-price align-items-center">$50.00</span> */}
                                <span class="old-price align-items-center" style={{ fontSize: '3rem' }}>
                                    <small class="small-dollar"></small>
                                </span>
                            </div>
                            <div class="price-container new-price">
                                {/* <span class="old-price align-items-center">$50.00</span> */}
                                <span class="free-price align-items-center" style={{ color: "grey", fontSize: '3.5rem', marginTop: "23%" }}>
                                    <small class="small-dollar text-center">$</small>0
                                </span>
                            </div>
                            <p className="text-center text-red">
                                Limited Time Offer
                            </p>
                            <p className="card-text text-center" style={{ marginTop: "37%" }}>
                                Time Tracking
                                SSTrack
                                up to <b>10</b> screenshots per hour
                                screenshots stored for <b>15 days</b>
                            </p>
                            <p className="activtiyUrl text-center" style={{ marginTop: '18%' }} >Individual settings
                            </p>
                            <p className="activtiyUrl text-center" > Activity Level Tracking</p>
                            <p className="activtiyUrl text-center" >
                                App & URL Tracking
                            </p>
                            <br />
                            <div className="mt-auto">
                                <button type="button" className="pricingButton2" style={{ width: '150px', alignItems: 'center', color: 'white', backgroundColor: getButtonDisabled(1) ? "#ccc" : "#e4eced", marginTop: '20px' }}
                                    onClick={() => handleUpgradeClicks(1)} disabled={isButtonDisabled(1)}
                                > {getButtonText(1)}</button>
                            </div>
                            {/* <button type="button" className="pricingButton2" style={{ width: '150px', alignItems: 'center', color: 'grey', backgroundColor: "#e4eced", marginTop: '20px' }}>
                  Current Plan
                </button> */}
                            <br />
                        </div>
                    </div>


                    {/* ------------------------------ pricing card 2 ------------------------- */}

                    <div className="card m-3" style={{ width: "18rem", height: '44.5rem', border: "8px solid  #0E4772", backgroundColor: "#f2faf6", borderRadius: "1rem" }}>
                        <div className="card-body px-3">
                            <h5 className="card-title text-center fw-bold fs-2" style={{ color: " #0E4772" }}>Premium</h5>
                            <div class="price-container new-price">
                                {/* <span class="old-price align-items-center">$50.00</span> */}
                                <span class="old-price align-items-center" style={{ color: "grey", fontSize: '3.5rem' }}>
                                    <small class="small-dollar">$</small>10
                                </span>
                            </div>
                            <p className="text-center"> per user per month</p>
                            <div class="price-container new-price">
                                {/* <span class="new-price">$35.00</span> */}
                                <span style={{ fontSize: "3rem" }}>
                                    <small class="small-dollar">$</small>4<sup class="small-number">99</sup>
                                </span>
                            </div>
                            <p className="text-center text-red">
                                per user per month
                                if you start now!
                            </p>
                            <p className="card-text text-center">
                                Time Tracking
                                SSTrack
                                up to <b>30</b> screenshots per hour
                                screenshots stored for <b>6 <br /> months</b>
                            </p>
                            <p className="activtiyUrl text-center">    Individual settings
                            </p>
                            <p className="text-center"> Activity Level Tracking</p>
                            <p className="activtiyUrl text-center">
                                App & URL Tracking
                            </p>
                            <p className="activtiyUrl text-center">
                                Mobile Application
                            </p>
                            <p className="activtiyUrl text-center">
                            </p>
                            <div className="mt-auto">
                                <button type="button" className="pricingButton1" style={{ color: 'white', width: '150px', backgroundColor: getButtonDisabled(3) ? "#ccc" : "#0E4772", marginTop: '20px' }} disabled={getButtonDisabled(3)}
                                    onClick={() => handleUpgradeClicks(3)}>{getButtonText(3)}</button>
                            </div>
                            <p className="text-center fw-bold" style={{ fontSize: "15px", color: '#7a8f91' }}>Switch to Free Plan any time</p>
                        </div>
                    </div>

                    {/* ------------------------------ pricing card 2 ------------------------- */}
                    <div className="card m-3" style={{ width: "18rem", height: '44.5rem', border: "8px solid #7ACB59", backgroundColor: "#f2faf6", borderRadius: "1rem" }}>
                        <div className="card-body px-3">
                            <h5 className="card-title text-center fw-bold fs-2" style={{ color: " #7ACB59" }}>Enterprise</h5>
                            {/* <div className="price-container new-price">
                        <span className="old-price align-items-center" style={{ color: "grey", fontSize: '3.5rem' }}>
                            <small className="small-dollar">$</small>6
                        </span>
                    </div> */}
                            {/* <p className="text-center"> per user per month</p> */}
                            <div className="price-container new-price mt-4">
                                <span style={{ fontSize: "2.6rem" }}>
                                    <small className="small-dollar"></small>Upto 50% Off<sup className="small-number"></sup>
                                </span>
                            </div>
                            <p className="text-center text-red mt-2" style={{ fontSize: "0.9rem" }}>
                                Ideal for organizations with 50+ users
                            </p>

                            <p className="text-center" style={{ fontSize: "0.85rem", color: "#555", fontWeight: "500", marginTop: "-5px" }}>
                                Enhance productivity with enterprise-level support and advanced features.
                            </p>

                            <p className="card-text text-center" style={{ marginTop: '-10px' }}>
                                Time Tracking SSTrack up to <b>30</b> screenshots per hour
                                screenshots stored for <b>1<br /> year</b>
                            </p>
                            <p className="activtiyUrl text-center">Individual settings</p>
                            <p className="text-center">Activity Level Tracking</p>
                            <p className="activtiyUrl text-center">App & URL Tracking</p>
                            <p className="activtiyUrl text-center">
                                Mobile Application
                            </p>
                            <br />
                            <div className="mt-auto">
                                <button type="button" className="pricingButton" style={{ color: 'white', width: '150px', backgroundColor: "#7ACB59", marginTop: '-20px' }}
                                    onClick={handleOpenModal}
                                >
                                    Apply
                                </button>
                            </div>
                            <p className="text-center fw-bold" style={{ fontSize: "15px", color: '#7a8f91' }}>Switch to Free Plan any time</p>
                        </div>
                    </div>

                    {/* Modal for applying */}
                    <Modal
                        show={showModal}
                        onHide={handleCloseModal}
                        centered
                        dialogClassName="modal-lg"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Apply for Enterprise Plan</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {token ? ( // Check if token is available
                                <>
                                    <p className="text-muted">
                                        Fill out the details below to apply for the Enterprise Plan.
                                    </p>
                                    <Form>
                                        <Form.Group controlId="formEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                required
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-100"
                                                readOnly
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formPhone" className="mt-3">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                required
                                                type="tel"
                                                placeholder="Enter your phone number"
                                                value={phoneNo}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-100"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formCompanyName" className="mt-3">
                                            <Form.Label>Company Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter your company name"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                className="w-100"
                                                readOnly
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formSSStoredFor" className="mt-3">
                                            <Form.Label>Sreen Shot Stored For</Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    as="select"
                                                    value={ssstoredFor}
                                                    onChange={(e) => setssstoredFor(e.target.value)}
                                                    className="w-100 pe-4"
                                                    style={{ paddingRight: '2.5rem' }}
                                                >
                                                    <option value="">select Payment Plan duration</option>
                                                    <option value="6 months">6 months</option>
                                                    <option value="1 year">1 year</option>
                                                    <option value="2 year">2 year</option>
                                                </Form.Control>
                                                <span
                                                    className="position-absolute"
                                                    style={{
                                                        top: '50%',
                                                        right: '1rem',
                                                        transform: 'translateY(-50%)',
                                                        pointerEvents: 'none',
                                                    }}
                                                >
                                                    <i className="bi bi-chevron-down"></i>
                                                </span>
                                            </div>
                                        </Form.Group>
                                        <Form.Group controlId="formPaymentPlan" className="mt-3">
                                            <Form.Label>Payment Plan</Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    as="select"
                                                    value={PaymentPlan}
                                                    onChange={(e) => setPaymentPlan(e.target.value)}
                                                    className="w-100 pe-4"
                                                    style={{ paddingRight: '2.5rem' }}
                                                >
                                                    <option value="">select Payment Plan duration</option>
                                                    <option value="6 months">6 months</option>
                                                    <option value="1 year">1 year</option>
                                                    <option value="2 year">2 year</option>
                                                </Form.Control>
                                                <span
                                                    className="position-absolute"
                                                    style={{
                                                        top: '50%',
                                                        right: '1rem',
                                                        transform: 'translateY(-50%)',
                                                        pointerEvents: 'none',
                                                    }}
                                                >
                                                    <i className="bi bi-chevron-down"></i>
                                                </span>
                                            </div>
                                        </Form.Group>
                                        <Form.Group controlId="formUserCount" className="mt-3">
                                            <Form.Label>Number of Employees</Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    as="select"
                                                    value={userCount}
                                                    onChange={(e) => setUserCount(e.target.value)}
                                                    className="w-100 pe-4"
                                                    style={{ paddingRight: '2.5rem' }}
                                                >
                                                    <option value="">Select number of employees</option>
                                                    <option value="50-100">50 - 100</option>
                                                    <option value="100-200">100 - 200</option>
                                                    <option value="250-300">200 - 300</option>
                                                </Form.Control>
                                                <span
                                                    className="position-absolute"
                                                    style={{
                                                        top: '50%',
                                                        right: '1rem',
                                                        transform: 'translateY(-50%)',
                                                        pointerEvents: 'none',
                                                    }}
                                                >
                                                    <i className="bi bi-chevron-down"></i>
                                                </span>
                                            </div>
                                        </Form.Group>
                                        <Form.Group controlId="formJoinTiming" className="mt-3">
                                            <Form.Label>When would you like to join?</Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    as="select"
                                                    value={joinTiming}
                                                    onChange={(e) => setJoinTiming(e.target.value)}
                                                    className="w-100 pe-4"
                                                    style={{ paddingRight: '2.5rem' }}
                                                >
                                                    <option value="">Select joining time</option>
                                                    <option value="immediately">Immediately</option>
                                                    <option value="1 month">In 1 month</option>
                                                    <option value="2 months">In 2 months</option>
                                                </Form.Control>
                                                <span
                                                    className="position-absolute"
                                                    style={{
                                                        top: '50%',
                                                        right: '1rem',
                                                        transform: 'translateY(-50%)',
                                                        pointerEvents: 'none',
                                                    }}
                                                >
                                                    <i className="bi bi-chevron-down"></i>
                                                </span>
                                            </div>
                                        </Form.Group>
                                    </Form>
                                </>
                            ) : (
                                <p className="text-danger text-center">Please login first to apply for the Enterprise Plan.</p>
                            )}
                        </Modal.Body>
                        {token &&
                            <Modal.Footer className="d-flex justify-content-center">
                                <button
                                    className="btn btn-success"
                                    style={{ width: '70%', height: '45px' }}
                                    onClick={handleApply2}
                                    disabled={isloadning} // Disable the button when loading
                                >
                                    {isloadning ? (
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                    ) : (
                                        'Apply'
                                    )}
                                </button>

                            </Modal.Footer>
                        }
                    </Modal>
                </div>
            </div>
        </>
    )
}



export default Pricing;