import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
// import '../App'; // Import the CSS file for styling

// Make sure to replace this with your own publishable key
const stripePromise = loadStripe('pk_test_51PcoPgRrrKRJyPcXmQ4mWHBaIEBqhR8lWBt3emhk5sBzbPuQDpGfGazHa9SU5RP7XHH2Xlpp4arUsGWcDdk1qQhe00zIasVFrZ');

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    let token = localStorage.getItem('token');
    const items = JSON.parse(localStorage.getItem('items'));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        let headers = {
            Authorization: 'Bearer ' + token,
          }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            try {
                const response = await axios.post('https://myuniversallanguages.com:9093/api/v1/owner/payments', {
                    tokenId: paymentMethod.id,
                    TotalAmount: '58.88',
                    userId:items._id,
                    dueDate: '2024-07-30',
                    planId:'6698e237d0afea358463dd05'
                },{headers});

                if (response.data.success) {
                    setSuccess(true);
                } else {
                    setError('Payment failed');
                }
            } catch (error) {
                setError('Payment failed');
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

const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
            <div className="payment-container">
                <h2>Complete Your Payment</h2>
                <CheckoutForm />
            </div>
        </Elements>
    );
}

export default Payment;
