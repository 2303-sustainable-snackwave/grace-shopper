import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrderDetails() {
            try {
                const response = await fetch(`/api/orders/${orderId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }
                const data = await response.json();
                setOrder(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        }

        async function fetchOrderHistory() {
            try {
                const response = await fetch(`/api/orders/history`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order history');
                }
                const data = await response.json();
                setOrderHistory(data);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchOrderDetails();
        fetchOrderHistory();
    }, [orderId]);

    const handleRetry = () => {
        setLoading(true);
        setError(null);
        fetchOrderDetails();
        fetchOrderHistory();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
                <button onClick={handleRetry}>Retry</button>
            </div>
        );
    }

    if (!order) {
        return <div>No order found for ID: {orderId}</div>;
    }

    return (
        <div>
            <h2>Order Details</h2>
            <p>Order ID: {order.id}</p>
            <p>Customer Name: {order.customerName}</p>

            <h2>Order History</h2>
            <ul>
                {orderHistory.map((historyOrder) => (
                    <li key={historyOrder.id}>{historyOrder.customerName}</li>
                ))}
            </ul>
        </div>
    );
};

export default OrderDetail;