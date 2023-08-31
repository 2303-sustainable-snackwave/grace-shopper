import React, { useState, useEffect } from 'react';
import { fetchCurrentUser, fetchUserCheckout } from '../api'; 

const Profile = () => {
    const [user, setUser] = useState(null);
    const [checkoutDetails, setCheckoutDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = "YOUR_TOKEN"; // This should be dynamically set! From localStorage!!! Temporary build!

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profile = await fetchCurrentUser(token);
                setUser(profile);
                const userCheckout = await fetchUserCheckout(profile.username, token);
                setCheckoutDetails(userCheckout);
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
                    <img src={user.profilePicture} alt="User Profile" />
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
            <button onClick={() => { /* Handle logout or profile update? I'm leaving this is for further development */ }}>Logout or Update Profile</button>
        </div>
    );
};

export default Profile;