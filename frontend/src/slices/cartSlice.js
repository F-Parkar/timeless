import { createSlice } from '@reduxjs/toolkit'; //not using createApi/apiSlice because we not working with async anymore
import { updateCart } from '../utils/cartUtils'

//If there's already a cart in localStorage (maybe from a previous session), it loads that.Otherwise, it starts with an empty cartItems array.
const initialState = localStorage.getItem('cart') 
  ? JSON.parse(localStorage.getItem('cart')) 
  : {cartItems : [], shippingAddress: {}, paymentMethod: 'PayPal' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // NOTE: we don't need user, rating, numReviews or reviews
      // in the cart
      const item  = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state);
    },
    removeFromCart: (state, action) => { //id is in the actions payload
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload); //returning all cartitems we dont want to delete, so the one we want to delete is gone from the UI

      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
    resetCart: (state) => {
      localStorage.removeItem('cart'); //remove the cart from local storage //this will reset the cart to its initial state
        return {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: 'PayPal',
      };
    } 
  },
});


export const { addToCart, 
              removeFromCart, 
              saveShippingAddress, 
              savePaymentMethod, 
              clearCartItems,
              resetCart } = cartSlice.actions; //any function you create you have to export it as a function

export default cartSlice.reducer;
