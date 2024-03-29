import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import style from './Catalog.module.css';
import { ProductCard } from './productCard/ProductCard';
import products from '../../data/products.json';
import { CatalogMenu } from './sortMenu/CatalogMenu';
import { Filter } from './filter/Filter';
import { history } from '../../store/History';
import { getArraySearchValue, getSearchValue } from '../../utils/searchHelpers';
import { FilterState, initialFilterState } from './filterState';
import { Matches } from './matches/Matches';
import { checkFilterState } from '../../utils/checkFilterState';
import { parsePathname } from '../../utils/pathnameHelpers';
import { CategoriesMenu } from './categoriesMenu/CategoriesMenu';
import { ProductPage } from './productPage/ProductPage';
import { Cart } from './cart/Cart';
import { SortBy } from './types';
import { sortArray } from '../../utils/sortFunction';
import { categoryRoutes, productRoutes } from '../../services/routes';
import { Page404 } from '../basic-components/Page404';
import { BackToTop } from '../basic-components/BackToTop';

export const Catalog = () => {
  const [filterState, setFilterState] = useState(initialFilterState);
  const [categoryPath, setCategoryPath] = useState('/');
  const [isProductPageView, setIsProductPageView] = useState(false);
  const [isPathError, setIsPathError] = useState(false);

  const updateFilterState = () => {
    setFilterState((prevState) => {
      const searchFieldState = getSearchValue('search');
      const brandState = getArraySearchValue('brand');
      const productState = getArraySearchValue('product');
      const minPrice = getSearchValue('minPrice');
      const maxPrice = getSearchValue('maxPrice');
      const minStock = getSearchValue('minStock');
      const maxStock = getSearchValue('maxStock');
      const sortBy = getSearchValue('sort') as SortBy;
      const displayState = getSearchValue('display');
      return {
        ...prevState,
        searchField: searchFieldState ?? null,
        brand: brandState,
        product: productState,
        minPrice: minPrice ? +minPrice : null,
        maxPrice: maxPrice ? +maxPrice : null,
        minStock: minStock ? +minStock : null,
        maxStock: maxStock ? +maxStock : null,
        sort: sortBy ?? 'pricedown',
        display: displayState === 'list' ? 'list' : 'table',
      };
    });
  };

  const checkRouting = useCallback((pathname: string) => {
    const pathChunksInitial = parsePathname(pathname);
    setCategoryPath(pathChunksInitial[0]);

    setIsPathError(false);

    if (
      categoryRoutes.includes(pathChunksInitial[0]) ||
      pathChunksInitial[0] === undefined ||
      pathChunksInitial[0] === 'cart'
    ) {
      if (pathChunksInitial.length < 2) {
        setIsProductPageView(false);
      } else if (
        pathChunksInitial.length === 2 &&
        productRoutes.filter(
          (prod) => prod[0] === pathChunksInitial[0] && prod[1] === +pathChunksInitial[1],
        ).length > 0
      ) {
        setIsProductPageView(true);
      } else {
        setIsProductPageView(false);
        setIsPathError(true);
      }
    } else {
      setIsPathError(true);
    }

    updateFilterState();
  }, []);

  useEffect(() => {
    checkRouting(history.location.pathname);

    const unlisten = history.listen(({ location }) => {
      checkRouting(location.pathname);
    });

    return unlisten;
  }, [checkRouting]);

  const filteredProducts = useMemo(() => {
    const filteredProductsArray = products.filter((el) => {
      return (
        (categoryPath ? el.catPath === categoryPath : el) &&
        (filterState.brand ? filterState.brand.includes(el.brand) : el) &&
        (filterState.product ? filterState.product.includes(el.type) : el) &&
        (filterState.searchField
          ? el.brand.toLowerCase().includes(filterState.searchField) ||
            el.category.toLowerCase().includes(filterState.searchField) ||
            el.description.toLowerCase().includes(filterState.searchField) ||
            el.title.toLowerCase().includes(filterState.searchField) ||
            el.type.toLowerCase().includes(filterState.searchField) ||
            el.price.toString().includes(filterState.searchField) ||
            el.stock.toString().includes(filterState.searchField)
          : el) &&
        (filterState.minPrice ? el.price > filterState.minPrice : el) &&
        (filterState.maxPrice ? el.price < filterState.maxPrice : el) &&
        (filterState.minStock ? el.stock > filterState.minStock : el) &&
        (filterState.maxStock ? el.stock < filterState.maxStock : el)
      );
    });

    const sortValue = filterState.sort;
    if (sortValue) {
      if (sortValue === 'nameup') {
        sortArray(filteredProductsArray, 'title', 'up');
      }
      if (sortValue === 'namedown') {
        sortArray(filteredProductsArray, 'title', 'down');
      }
      if (sortValue === 'priceup') {
        sortArray(filteredProductsArray, 'price', 'up');
      }
      if (sortValue === 'pricedown') {
        sortArray(filteredProductsArray, 'price', 'down');
      }
    }
    return filteredProductsArray;
  }, [filterState, categoryPath]);

  const product = products.find((el) => el.id === +parsePathname(history.location.pathname)[1]);

  const isCartOpen = categoryPath === 'cart';
  const isProductPageOpen = !isCartOpen && isProductPageView && product;
  const isCatalogOpen = !isCartOpen && !isProductPageView;

  return (
    <FilterState.Provider value={filterState}>
      <main className={style.main}>
        <div className={style.mainWrapper}>
          {isPathError ? (
            <Page404 />
          ) : (
            <>
              {isCartOpen && <Cart />}
              {isProductPageOpen && <ProductPage product={product} />}
              {isCatalogOpen && (
                <>
                  <Filter filteredProducts={filteredProducts} />
                  <section className={style.catalogWrapper}>
                    <CategoriesMenu products={products} activeCategory={categoryPath} />
                    <CatalogMenu />
                    {checkFilterState(filterState) && <Matches length={filteredProducts.length} />}
                    <div
                      className={classNames(style.productsWrapper, {
                        [style.list]: filterState.display === 'list',
                      })}
                    >
                      {filteredProducts.map((item) => {
                        return (
                          <ProductCard
                            key={item.id}
                            product={item}
                            layout={filterState.display}
                            path={`/${item.catPath}/${item.id}`}
                          />
                        );
                      })}
                      <BackToTop />
                    </div>
                  </section>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </FilterState.Provider>
  );
};
