// CartIcon.js
import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

const CartIcon = () => {
    const { cart } = useCart();
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
            <FiShoppingCart size={28} />
            {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cart.length}
                </span>
            )}
        </div>
    );
};

export default CartIcon;
