import { Reducer } from 'react';
import { possiblePromos } from '../components/cartState';
import { CartState } from '../components/cartStateTypes';
import { CartProduct } from '../data/product';
import { CartActionType } from './CartStoreTypes';

export const countTotalItems = (productsObj: Record<number, CartProduct>) => {
  return Number(
    Object.values(productsObj)
      .reduce((acc, item) => acc + item.amount, 0)
      .toFixed(2),
  );
};
export const countTotalCost = (productsObj: Record<number, CartProduct>): number => {
  return Number(
    Object.values(productsObj)
      .reduce((acc, item) => acc + item.amount * item.price, 0)
      .toFixed(2),
  );
};

export const countTotalCostDiscount = (totalCost: number, totalDiscount: number): number => {
  return totalCost - (totalCost / 100) * totalDiscount;
};

export const cartReducer: Reducer<CartState, CartActionType> = (state, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const newState = {
        ...state,
        products: {
          ...state.products,
          [action.payload.id]: {
            ...action.payload,
            amount: 1,
          },
        },
      };
      return newState;
    }
    case 'REMOVE_PRODUCT': {
      const newState = { ...state };
      delete newState.products[action.payload.id];

      return newState;
    }
    case 'INCREASE_PRODUCT': {
      const amount = state.products[action.payload].amount + 1;
      if (amount > state.products[action.payload].stock) {
        return state;
      }
      const newState = {
        ...state,
        products: {
          ...state.products,
          [action.payload]: { ...state.products[action.payload], amount },
        },
      };
      return newState;
    }
    case 'DECREASE_PRODUCT': {
      const amount = state.products[action.payload]?.amount
        ? state.products[action.payload].amount - 1
        : 0;
      if (amount < 1) {
        const newState = { ...state };
        delete newState.products[action.payload];
        return newState;
      }
      const newState = {
        ...state,
        products: {
          ...state.products,
          [action.payload]: { ...state.products[action.payload], amount },
        },
      };
      return newState;
    }
    case 'CLEAR_CART': {
      const newState = {
        ...state,
        products: [],
        promos: {},
        isCheckout: false,
      };
      return newState;
    }
    case 'ADD_PROMO': {
      if (Object.keys(state.promos).includes(action.payload)) {
        return state;
      }
      const newState = {
        ...state,
        promos: {
          ...state.promos,
          [action.payload]: possiblePromos[action.payload],
        },
      };
      return newState;
    }
    case 'REMOVE_PROMO': {
      if (Object.keys(state.promos).includes(action.payload)) {
        const newPromos = {
          ...state.promos,
        };
        delete newPromos[action.payload];
        const newState = {
          ...state,
          promos: newPromos,
        };
        return newState;
      }
      return state;
    }
    case 'SET_CHECKOUT': {
      const newState = { ...state, isCheckout: action.payload };
      return newState;
    }
    default:
      return state;
  }
};
