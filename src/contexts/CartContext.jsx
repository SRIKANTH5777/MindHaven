/* eslint-disable react-refresh/only-export-components */
// contexts/CartContext.js
import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

// Cart action types
const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalItems: state.totalItems + 1
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        totalItems: state.totalItems + 1
      };
    }
    
    case CART_ACTIONS.REMOVE_FROM_CART: {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        totalItems: state.totalItems - (itemToRemove?.quantity || 0)
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      const currentItem = state.items.find(item => item.id === id);
      const quantityDiff = quantity - (currentItem?.quantity || 0);
      
      if (quantity === 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
          totalItems: state.totalItems - (currentItem?.quantity || 0)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
        totalItems: state.totalItems + quantityDiff
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return {
        items: [],
        totalItems: 0
      };
    }
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  totalItems: 0
};

// Cart Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Actions
  const addToCart = (book) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: book });
  };

  const removeFromCart = (bookId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: bookId });
  };

  const updateQuantity = (bookId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: bookId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};