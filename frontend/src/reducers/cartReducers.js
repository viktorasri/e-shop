import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_ADD_ITEM_FAIL } from '../constans/cartConstants';

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      //  Check if item exist in current cart
      const existItem = state.cartItems.find((x) => x.product === item.product);
      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) => (i.product === item.product ? item : i)),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case CART_ADD_ITEM_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };

    default:
      return state;
  }
};
