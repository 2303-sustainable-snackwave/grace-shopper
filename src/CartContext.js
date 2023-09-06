import { createContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        setCartItems(prevItems => [...prevItems, item]);
    };

    const removeFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const fetchAndSetCartItems = async (userId, token) => {
        try {
            const userCart = await fetchUserCart(userId, token); // Ensure fetchUserCart is imported or available in this scope
            if (userCart && userCart.cart) {
                setCartItems(userCart.cart.items);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, fetchAndSetCartItems }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;