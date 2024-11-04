import React, { useCallback, useEffect, useState } from 'react';



const PayPalButton = ({ amount }) => {
    useEffect(() => {
        const script = document.createElement('script');
        // Add disable-funding parameter to remove credit/debit card options
        script.src = `https://www.paypal.com/sdk/js?client-id=AbjWITfwZjHD0s6nwfnGmZFpRKnhKLet_QEaADR6xkZ4LiBjI2niy3U6sHRvYi6zCKgaCA4H4RX3mIPh&currency=USD&disable-funding=credit,card`;
        script.addEventListener('load', () => {
            window.paypal
                .Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: amount, // Pass the amount for the transaction
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then(details => {
                            console.log("paypal", details);
                            alert('Transaction completed by ' + details.payer.name.given_name);
                            // Perform any additional post-payment logic here
                        });
                    },
                    onError: err => {
                        console.error('PayPal Checkout onError', err);
                    },
                })
                .render('#paypal-button-container');
        });
        document.body.appendChild(script);
    }, [amount]);
    return <div id="paypal-button-container" style={{ width: '40%' }}></div> // Adjust width here

    // return <div id="paypal-button-container"></div>; // PayPal button will render here
};




export default PayPalButton;