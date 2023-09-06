import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllOrders } from '../api'; // Make sure correct route in cleanup

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadOrders() {
            try {
                const response = await fetchAllOrders();
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchAllOrders();
    }, []);

    return (
        <div>
            <h1>Order List</h1>
            {error && <p>Error: {error.message}</p>}
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        <Link to={`/order/${order.id}`}>{order.customerName}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;