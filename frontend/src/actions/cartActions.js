import axios from 'axios';
import { CART_ADD_ITEM, CART_ADD_ITEM_FAIL, CART_REMOVE_ITEM } from '../constans/cartConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qty,
      },
    });

    //  Save cartItems to local storage
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
  } catch (error) {
    dispatch({
      type: CART_ADD_ITEM_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  //  Save cartItems to local storage
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};
