import React, { useEffect, useState } from 'react';
import { fetchUserCheckout } from '../api';  // Make sure to update the file paths!

const UserCheckout = ({ username, token }) => {
    const [checkoutDetails, setCheckoutDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCheckoutDetails = async () => {
            try {
                // We're still hitting username and not email... This will have to be changed.
                const details = await fetchUserCheckout(username, token);
                setCheckoutDetails(details);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        getCheckoutDetails();
    }, [username, token]);

    return (
        <div className="checkout-container">
            <h2>Checkout Details for {username}</h2>
            
            {loading && <div>Loading...</div>}
            
            {error && <div className="error-message">{error}</div>}
            
            {checkoutDetails && (
                <div>
                    <p>Total Amount: ${checkoutDetails.totalAmount}</p>
                    <p>Items: {checkoutDetails.itemsCount}</p>
                </div>
            )}
        </div>
    );
};

export default UserCheckout;