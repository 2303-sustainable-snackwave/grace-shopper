import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOrderDetails() {
            try {
                const response = await fetch(`/api/orders/${orderId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }
                const data = await response.json();
                setOrder(data);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchOrderDetails();
    }, [orderId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Order Details</h2>
            <p>Order ID: {order.id}</p>
            <p>Customer Name: {order.customerName}</p>
        </div>
    );
};

export default OrderDetail;