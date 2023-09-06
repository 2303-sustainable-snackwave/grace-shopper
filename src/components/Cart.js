import React, { useState, useEffect, useContext } from 'react';
import { getCartItemsByCartId } from '../api';
import CartContext from '../CartContext';

const Cart = () => {
    const { cartItems, removeFromCart } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cartId = null; // placeholder

    useEffect(() => {
        async function fetchCartItems() {
            try {
                if (!cartId) {
                    throw new Error("No cart ID available");
                }
                const items = await getCartItemsByCartId(cartId);
                setCartItems(items);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        fetchCartItems();
    }, [cartId]);

    const handleRemoveItem = async (cartItemId) => {
        try {
            await removeFromCart(cartItemId);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="cart-container container mt-5">
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Your Cart</h2>
                </div>
                {error && 
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                }
                <ul className="list-group list-group-flush">
                    {cartItems.length === 0 ? 
                        <li className="list-group-item">Your cart is empty</li> :
                        cartItems.map(item => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {item.productName} - Quantity: {item.quantity}
                                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(item.id)}>Remove</button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );    
}

export default Cart;