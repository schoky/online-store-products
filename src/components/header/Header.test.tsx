import { render, screen } from '@testing-library/react';
import { CartContext, CartStateContext } from '../cartState';
import { Header } from './Header';
import productsArr from '../../data/products.json';

const cartContext = {
  cartState: {
    products: {},
    promos: {},
    isCheckout: false,
  },
  dispatch: () => {},
} as CartContext;

describe('Header tests', () => {
  it('Logo loads and displays', () => {
    render(
      <CartStateContext.Provider value={cartContext}>
        <Header />
      </CartStateContext.Provider>,
    );
    expect(screen.getByRole('link', { name: /logo/i })).toBeInTheDocument();
  });
  it('Cart products amount displays correct amount', () => {
    cartContext.cartState.products[productsArr[0].id] = { ...productsArr[0], amount: 1 };
    render(
      <CartStateContext.Provider value={cartContext}>
        <Header />
      </CartStateContext.Provider>,
    );
    expect(screen.getByRole('link', { name: /cart/i })).toHaveTextContent('1');
  });
  it('Cart products amount displays correct amount', () => {
    cartContext.cartState.products[productsArr[0].id] = { ...productsArr[0], amount: 1 };
    cartContext.cartState.products[productsArr[1].id] = { ...productsArr[1], amount: 2 };
    render(
      <CartStateContext.Provider value={cartContext}>
        <Header />
      </CartStateContext.Provider>,
    );
    expect(screen.getByRole('link', { name: /cart/i })).toHaveTextContent('3');
  });
  it('Cart total price displays correct price without promos', () => {
    cartContext.cartState.products[productsArr[0].id] = { ...productsArr[0], amount: 1 };
    cartContext.cartState.products[productsArr[1].id] = { ...productsArr[1], amount: 2 };
    const totalPrice = Object.values(cartContext.cartState.products)
      .reduce((acc, prod) => acc + prod.price * prod.amount, 0)
      .toFixed(2);
    render(
      <CartStateContext.Provider value={cartContext}>
        <Header />
      </CartStateContext.Provider>,
    );
    expect(screen.getByText(/итого:/i)).toHaveTextContent(`Итого: ${totalPrice} RUB`);
  });
  it('Cart total price displays correct price with promos', () => {
    cartContext.cartState.products[productsArr[0].id] = { ...productsArr[0], amount: 1 };
    cartContext.cartState.products[productsArr[1].id] = { ...productsArr[1], amount: 2 };
    cartContext.cartState.promos = {
      RS: 10,
    };
    const totalPrice = Object.values(cartContext.cartState.products).reduce(
      (acc, prod) => acc + prod.price * prod.amount,
      0,
    );
    const totalDiscount = Object.values(cartContext.cartState.promos).reduce(
      (acc, promo) => acc + promo,
      0,
    );
    const totalPriceWithDiscount = (totalPrice - (totalPrice / 100) * totalDiscount).toFixed(2);
    render(
      <CartStateContext.Provider value={cartContext}>
        <Header />
      </CartStateContext.Provider>,
    );
    expect(screen.getByText(/итого:/i)).toHaveTextContent(`Итого: ${totalPriceWithDiscount} RUB`);
  });
});
