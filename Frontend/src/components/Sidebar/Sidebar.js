// Sidebar.js

import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSidebarStatus, setSidebarOff } from "../../store/sidebarSlice";
import {
  fetchAsyncCategories,
  getAllCategories,
} from "../../store/categorySlice";
import {
  fetchAsyncProducts,
  getAllProducts,
  getAllProductsStatus,
} from "../../store/productSlice";
import { setPriceFilter, setFilteredProducts } from "../../store/filterSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isSidebarOn = useSelector(getSidebarStatus);
  const categories = useSelector(getAllCategories);
  const products = useSelector(getAllProducts);
  const navigate = useNavigate();

  // State variables for minPrice and maxPrice
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    dispatch(fetchAsyncCategories());
  }, [dispatch]);

  const handlePriceRangeFilter = () => {
    const filteredProducts = filterProductsByPriceAndCategory(
      products,
      parseInt(minPrice),
      parseInt(maxPrice)
    );
    dispatch(setPriceFilter({ minPrice: parseInt(minPrice), maxPrice: parseInt(maxPrice) }));
    dispatch(setFilteredProducts(filteredProducts)); // Dispatch setFilteredProducts action
    dispatch(setSidebarOff()); // Close sidebar after selecting price range
    navigate("/filtered-products"); // Navigate to filtered products page
  };

  function filterProductsByPriceAndCategory(products, minPrice, maxPrice) {
    return products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
  }

  return (
    <aside className={`sidebar ${isSidebarOn ? "hide-sidebar" : ""}`}>
      <button
        type="button"
        className="sidebar-hide-btn"
        onClick={() => dispatch(setSidebarOff())}
      >
        <i className="fas fa-times"></i>
      </button>
      <div className="sidebar-cnt">
        {/* Price Range Filter */}
        <div className="price-filter">
          <span>Price Range:</span>
          <div className="range-slider">
            {/* Input for minimum price */}
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="min-price-input"
            />
            {/* Input for maximum price */}
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="max-price-input"
            />
          </div>
          {/* Apply button */}
          <button type="button" onClick={handlePriceRangeFilter}>
            Apply
          </button>
        </div>
        {/* Price labels */}
        <div className="price-labels">
          <span>EGP{minPrice}</span>
          <span>EGP{maxPrice}</span>
        </div>
        {/* Category List */}
        <div className="cat-title fs-17 text-uppercase fw-6 ls-1h">
          All Categories
        </div>
        <ul className="cat-list">
          {categories.map((category, idx) => (
            <li key={idx} onClick={() => dispatch(setSidebarOff())}>
              <Link
                to={`category/${category}`}
                className="cat-list-link text-capitalize"
              >
                {category.replace("-", " ")}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;