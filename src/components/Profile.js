import React, { useState, useEffect } from 'react';
import { fetchCurrentUser, fetchUserCheckout } from '../api'; 

const Profile = ({ token }) => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [checkoutDetails, setCheckoutDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profile = await fetchCurrentUser(token, setEmail);
                setUser(profile);
                // const userCheckout = await fetchUserCheckout(profile.name, token);
                // setCheckoutDetails(userCheckout);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {user && (
                <>
                    <div>
                        <strong>Name:</strong> {user.name}
                    </div>
                    <div>
                        <strong>Email:</strong> {user.email}
                    </div>
                </>
            )}
            {checkoutDetails && (
                <div className="checkout-details">
                    <h3>Checkout Details</h3> 
                    <div>
                        <strong>Total Purchased Items:</strong> {checkoutDetails.totalItems}
                    </div>
                    <div>
                        <strong>Total Amount:</strong> {checkoutDetails.totalAmount}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;