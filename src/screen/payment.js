import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Modal, Button } from 'react-bootstrap';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
// import './Payment.css'; // Import the CSS file for styling

const stripePromise = loadStripe('pk_test_51PcoPgRrrKRJyPcXmQ4mWHBaIEBqhR8lWBt3emhk5sBzbPuQDpGfGazHa9SU5RP7XHH2Xlpp4arUsGWcDdk1qQhe00zIasVFrZ');



const Payment = () => {
    const location = useLocation();
    const [plans] = useState(location.state?.plans || []);
    const [fetchError] = useState(location.state?.fetchError || null);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [defaultPlanIndex] = useState(location.state?.defaultPlanIndex || 0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (plans.length > 0) {
            setSelectedPlan(plans[defaultPlanIndex] || plans[0]);
        }
    }, [plans, defaultPlanIndex]);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
    };

    const getPlanDescription = (plan) => {
        return `$${plan.costPerUser} per month per user, up to ${plan.screenshotsPerHr} screenshots per hour, screenshots kept ${plan.ssStored} days, individual settings, activity level tracking, ${plan.mobileApp ? 'mobile app included' : 'no mobile app'}, app & URL tracking`;
    };







    const planUpgradeApiUrl = "https://myuniversallanguages.com:9093/api/v1";


    const postNewPlans = async () => {
        try {
            const response = await axios.post(`${planUpgradeApiUrl}/owner/upgrade`);
            console.error('res:', response);

        } catch (error) {
            console.error('Error fetching plans:', error);

        }
    };


















    const CheckoutForm = () => {
        const stripe = useStripe();
        const elements = useElements();
        const [error, setError] = useState(null);
        const [success, setSuccess] = useState(false);
        const [loading, setLoading] = useState(false);
        const items = JSON.parse(localStorage.getItem('items'));
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: "Bearer " + token,
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            setLoading(true);

            if (!stripe || !elements) {
                setError('Stripe has not loaded correctly.');
                setLoading(false);
                return;
            }

            const cardElement = elements.getElement(CardElement);

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {

                console.log('Card Info:', {
                    amount: selectedPlan.costPerUser,
                    planType: selectedPlan._id,
                    brand: paymentMethod,
                    headers: headers,

                });
                const planUpgradeApiUrl = "https://myuniversallanguages.com:9093/api/v1";
                try {
                    const response = await axios.post(`${planUpgradeApiUrl}/owner/upgrade`, {
                        // tokenId: paymentMethod.id,
                        // TotalAmount: selectedPlan.costPerUser,
                        // planId: selectedPlan._id,
                        tokenId: paymentMethod.id,
                        TotalAmount: '58.88',
                        dueDate: '2024-07-30',
                        planId: selectedPlan._id,
                    }, { headers });

                    console.log('Payment Response:', response);

                    if (response.data.success) {
                        setSuccess(true);
                    } else {
                        setError(`Payment failed: ${response.data.message}`);
                    }
                } catch (error) {
                    setError(`Payment failed: ${error.response ? error.response.data.message : error.message}`);
                }
                setLoading(false);
            }
        };

        return (
            <form onSubmit={handleSubmit} className="payment-form">
                <CardElement className="card-element" />
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Payment successful!</div>}
                <button type="submit" disabled={!stripe || loading} className="submit-button">
                    {loading ? 'Processing...' : 'Pay'}
                </button>
            </form>
        );
    };




    const PaymentModal = ({ showModal, handleClose }) => {
        return (
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Payment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-left mb-4">
                        <h5 className="owner-name">Owner Name</h5>
                        <h5 className="employee-count">Number of employees: 5</h5>
                        {/* <h5 className="employee-count">{selectedPlan}</h5> */}

                        {selectedPlan && (
                            <Elements stripe={stripePromise}>
                                <div className="payment-container mt-4">
                                    <p className="mb-4">Complete Your Payment</p>
                                    <CheckoutForm />
                                </div>
                            </Elements>
                        )}
                    </div>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer> */}
            </Modal>
        );
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };








    return (
        <div>
            <div className="container">
                <div className="userHeader">
                    <div>
                        <h5>Paid plan</h5>
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="ownerTeamContainer">
                        <h3 className="card-title mb-4">Selected Plan</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            {loading ? (
                                <p>Loading plans...</p>
                            ) : fetchError ? (
                                <p>{fetchError}</p>
                            ) : (
                                plans
                                    .filter((plan) => plan.planType !== 'trial') // Filter out trial plans
                                    .map((plan) => (
                                        <div className="card w-75" style={{ marginBottom: '10px' }} key={plan._id}>
                                            <div className="card-body">
                                                <label style={{
                                                    position: 'relative',
                                                    paddingLeft: '30px',
                                                    cursor: 'pointer',
                                                    fontSize: '22px',
                                                    userSelect: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    <input
                                                        type="radio"
                                                        id={plan._id}
                                                        name="plan"
                                                        value={plan.planType}
                                                        checked={selectedPlan?._id === plan._id}
                                                        onChange={() => handlePlanSelect(plan)}
                                                        style={{
                                                            position: 'absolute',
                                                            opacity: 0,
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        height: '25px',
                                                        width: '25px',
                                                        backgroundColor: '#7CCB58',
                                                        borderRadius: '50%'
                                                    }}></span>
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '9px',
                                                        left: '9px',
                                                        height: '8px',
                                                        width: '8px',
                                                        borderRadius: '50%',
                                                        backgroundColor: selectedPlan?._id === plan._id ? 'white' : 'transparent',
                                                        display: selectedPlan?._id === plan._id ? 'block' : 'none'
                                                    }}></span>
                                                    {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)} - ${plan.costPerUser}/month
                                                </label>
                                                <p className="card-text">{getPlanDescription(plan)}</p>
                                            </div>
                                        </div>
                                    ))
                            )}




                        </div>
                        <h3 className="card-title mt-4">Estimated payments</h3>
                        <div className="mt-2" style={{ maxWidth: "70%", color: 'grey' }}>Pay only for what you use. There is no minimum fee. If you add a worker for a single day, you'll pay for this day only. Not month. You are free to add or remove workers anytime as you see fit. Your credit card will not be charged today, only at the end of your billing period.</div>
                        <h3 className="card-title mt-4">Pay with Card</h3>
                        <button className="btn  mt-2" style={{ backgroundColor: '#7CCB58', color: 'white' }} onClick={handleShowModal}>
                            Continue to pay
                        </button>
                    </div>
                </div>
                <PaymentModal
                    showModal={showModal}
                    handleClose={handleCloseModal}
                    selectedPlan={selectedPlan}
                />
            </div>
        </div>
    );
};

export default Payment;
