import React from 'react';
import { useSelector } from 'react-redux';
import { getFilteredProducts } from '../../store/filterSlice';
import ProductList from '../../components/ProductList/ProductList';

const FilteredProductsPage = () => {
  const filteredProducts = useSelector(getFilteredProducts);

  return (
    <div>
      <h2>Filtered Products</h2>
      <ProductList products={filteredProducts} />
    </div>
  );
};

export default FilteredProductsPage;
