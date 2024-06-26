import React, { useEffect, useState } from "react";
import "./ProductDetailsPage.css";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAsyncProductSingle,
  getProductSingle,
  getSingleProductStatus,
} from "../../store/productSlice";
import { STATUS } from "../../utils/status";
import Loader from "../../components/Loader/Loader";
import { formatPrice } from "../../utils/helpers";
import {
  addToCart,
  getCartMessageStatus,
  setCartMessageOff,
  setCartMessageOn,
} from "../../store/cartSlice";
import CartMessage from "../../components/CartMessage/CartMessage";
import Rev from "../../components/reviews/reviews";
import Popup from "../../components/Popup/Popup";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../store/actions/ToggleFav";

const ProductDetailsPage = () => {
  // param of id
  const { id } = useParams();

  // send action with dispatcher
  const dispatch = useDispatch();

  // useSelector
  const product = useSelector(getProductSingle);
  const productSingleStatus = useSelector(getSingleProductStatus);
  const favorites = useSelector((state) => state.favorites);

  // use state
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const cartMessageStatus = useSelector(getCartMessageStatus);
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [sessionLogin, setSessionLogin] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  console.log(product.images)

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const isMovieInFavorites = () => {
    return favorites.some((favMovie) => favMovie.id === product?.id);
  };

  const handleToggleFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMovieInFavorites()) {
      dispatch(removeFromFavorites(product?.id));
    } else {
      dispatch(addToFavorites(product));
    }
  };

  // getting single product
  useEffect(() => {
    dispatch(fetchAsyncProductSingle(id));
  }, [id, dispatch]);

  // Handle cart message
  useEffect(() => {
    if (cartMessageStatus) {
      const timer = setTimeout(() => {
        dispatch(setCartMessageOff());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [cartMessageStatus, dispatch]);

  useEffect(() => {
    let sessionLogin = JSON.parse(localStorage.getItem("login") || "[]");
    setSessionLogin(sessionLogin);
    console.log(sessionLogin);
  }, []);

  let discountedPrice =
    product?.price - product?.price * (product?.discountPercentage / 100);

  if (productSingleStatus === STATUS.LOADING) {
    return <Loader />;
  }

  const increaseQty = () => {
    setQuantity((prevQty) => {
      let tempQty = prevQty + 1;
      if (tempQty > product?.stock) tempQty = product?.stock;
      return tempQty;
    });
  };

  const decreaseQty = () => {
    setQuantity((prevQty) => {
      let tempQty = prevQty - 1;
      if (tempQty < 1) tempQty = 1;
      return tempQty;
    });
  };

  const addToCartHandler = (product) => {
    let discountedPrice =
      product?.price - product?.price * (product?.discountPercentage / 100);
    let totalPrice = quantity * discountedPrice;

    dispatch(
      addToCart({ ...product, quantity: quantity, totalPrice, discountedPrice })
    );
    dispatch(setCartMessageOn(true));
  };

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  
  const handleClosePopup = () => {
    setShowPopup(false); 
  };

  function renderStars(rating) {
    const maxStars = 5;
    const roundedRating = Math.round(rating * 2) / 2; 

    const stars = [];

    for (let i = 1; i <= maxStars; i++) {
      if (i <= roundedRating) {
        stars.push(<span key={i}>&#9733;</span>); 
      } else {
        stars.push(<span key={i}>&#9734;</span>); 
      }
    }

    return stars;
  }

  return (
    <main className="py-5 bg-whitesmoke">
      <div className="product-single">
        <div className="container">
          <div className="product-single-content bg-white grid">
            <div className="product-single-l">
              <div className="product-img ">
                <div className="product-img-zoom img-fluid">
                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[selectedImage]}
                      alt=""
                      className="img-cover"
                    />
                  )}
                </div>

                <div className="product-img-thumbs flex align-center my-2 img-fluid">
                  {product.images &&
                    product.images.map((image, index) => (
                      <div
                        className="thumb-item img-fluid"
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <img
                          src={image}
                          alt=""
                          className="img-cover img-fluid"
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="product-single-r">
              <div className="product-details font-manrope">
                <div className="your-store-title fs-20 fw-5">
                  {product?.title}

                  <button
                    className="badges"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleToggleFavorites}
                  >
                    {isMovieInFavorites() ? (
                      <img
                        src={
                          isHovered
                            ? "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Empty_Star.svg/2048px-Empty_Star.svg.png"
                            : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Star_full.svg/754px-Star_full.svg.png"
                        }
                        alt="Filled Star"
                        height={24}
                      />
                    ) : (
                      <img
                        src={
                          isHovered
                            ? "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Star_full.svg/754px-Star_full.svg.png"
                            : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Empty_Star.svg/2048px-Empty_Star.svg.png"
                        }
                        alt="Empty Star"
                        height={24}
                      />
                    )}
                  </button>
                </div>

                <div>
                  <p className="your-store-para fw-3 fs-15">
                    {product?.description}
                  </p>
                </div>

                <div className="your-store-product-info flex align-center flex-wrap fs-14">
                  <span className="text-orange fw-5" style={{ color: "black" }}>
                    Rating:
                  </span>
                  <div className="your-store-rating">
                    {renderStars(product?.rating)}
                  </div>
                  <div className="your-store-vert-line"></div>
                  <div className="your-store-brand">
                    <span className="text-orange fw-5">Brand:</span>
                    <span className="mx-1">{product?.brand}</span>
                  </div>
                  <div className="your-store-vert-line"></div>
                  <div className="your-store-category">
                    <span className="text-orange fw-5">Category:</span>
                    <span className="mx-1 text-capitalize">
                      {product?.category_name
                        ? product.category_name.replace("-", " ")
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="price">
                  <div className="flex align-center">
                    <div className="old-price text-gray">
                      {formatPrice(product?.price)}
                    </div>
                    <span className="fs-14 mx-2 text-dark">
                      Inclusive of all taxes
                    </span>
                  </div>

                  <div className="flex align-center my-1">
                    <div className="new-price fw-5 font-poppins fs-24 text-orange">
                      {formatPrice(discountedPrice)}
                    </div>
                    <div className="discount bg-orange fs-13 text-white fw-6 font-poppins">
                      {product?.discountPercentage}% OFF
                    </div>
                  </div>
                </div>

                <div className="qty flex align-center my-4">
                  <div className="qty-text">Quantity:</div>
                  <div className="qty-change flex align-center mx-3">
                    <button
                      type="button"
                      className="qty-decrease flex align-center justify-center"
                      onClick={() => decreaseQty()}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <div className="qty-value flex align-center justify-center">
                      {quantity}
                    </div>
                    <button
                      type="button"
                      className="qty-increase flex align-center justify-center"
                      onClick={() => increaseQty()}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  {product?.stock === 0 ? (
                    <div className="qty-error text-uppercase bg-danger text-white fs-12 ls-1 mx-2 fw-5">
                      Out of Stock
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="btns">
                  <button
                    type="button"
                    className="your-store-add-to-cart-btn"
                    onClick={() => {
                      addToCartHandler(product);
                    }}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    <span className="your-store-add-to-cart-text">
                      Add to Cart
                    </span>
                  </button>
                  <button type="button" className="your-store-buy-now-btn mx-3">
                    <span className="your-store-buy-now-text">Buy Now</span>
                  </button>
                  {localStorage.getItem("login") !== null && (
                    <button
                      type="button"
                      className="your-popup-btn"
                      onClick={togglePopup}
                    >
                      Add Rating and Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Rev />
        </div>
      </div>

      {cartMessageStatus && <CartMessage />}
      {showPopup && <Popup isOpen={showPopup} onClose={handleClosePopup} />}
    </main>
  );
};

export default ProductDetailsPage;
