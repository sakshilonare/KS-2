import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('orders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });

    // Update localStorage whenever the cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    const addToCart = (crop, quantity) => {
        const existingCrop = cart.find(item => item._id === crop._id);

        if (existingCrop) {
            // Update quantity for existing crop
            setCart(prevCart => 
                prevCart.map(item => 
                    item._id === crop._id ? { ...item, quantity: item.quantity + quantity } : item
                )
            );
            toast.success(`Updated ${crop.crop} quantity!`);
        } else {
            // Add new crop to cart
            setCart((prevCart) => [...prevCart, { ...crop, quantity }]);
            toast.success(`${crop.crop} added to cart!`);
        }
    };

    const removeFromCart = (cropId) => {
        setCart((prevCart) => prevCart.filter(item => item._id !== cropId));
        toast.error('Crop removed from cart');
    };

    const clearCart = () => {
        setCart([]);
    };

    const placeOrder = () => {
        if (cart.length === 0) {
            toast.error('Your cart is empty!');
            return;
        }

        setOrders(prevOrders => [...prevOrders, cart]);
        clearCart(); // Clear the cart after placing the order
        toast.success('Order placed successfully!');
    };

    return (
        <CartContext.Provider value={{ cart, orders, addToCart, removeFromCart, clearCart, placeOrder }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
