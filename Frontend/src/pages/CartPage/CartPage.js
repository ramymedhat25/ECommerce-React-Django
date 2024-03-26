import React, { useState, useEffect } from "react";
import "./CartPage.css";
import { useSelector, useDispatch } from "react-redux";
import { shopping_cart } from "../../utils/images";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import {
  getAllCarts,
  removeFromCart,
  toggleCartQty,
  clearCart,
  getCartTotal,
  getCartItemsCount,
} from "../../store/cartSlice";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import GalaxyButton from "../../components/GalaxyButton/GalaxyButton";
import axios from "axios";

const CartPage = () => {
  const dispatch = useDispatch();
  const carts = useSelector(getAllCarts);
  const { itemsCount, totalAmount } = useSelector((state) => state.cart);
  const itemsCounts = useSelector(getCartItemsCount);
  const navigate = useNavigate();
  const [successPopup, setSuccessPopup] = useState(false);
  const [userid, setuserid] = useState(0);

  /** Redirection */
  useEffect(() => {
    if (localStorage.getItem("login") !== null) {
      const user = JSON.parse(localStorage.getItem("login"));
      if (user.role === "seller") {
        navigate("/Dashboard");
      }
    }
  }, []);
  /** End of Redirection */

  // new senario
  const user = JSON.parse(localStorage.getItem("login"));
  const CustomerId = user.id;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    card_number: "",
    exp_date: "",
    cvv: "",
    total_items: 0,
    total_amount: 0,
  });

  useEffect(() => {
    if (localStorage.getItem("login") !== null) {
      const user = JSON.parse(localStorage.getItem("login"));
      if (user.role === "seller") {
        navigate("/Dashboard");
      } else {
        // Set name and email from local storage
        setuserid(user.id);
        setFormData((prevData) => ({
          ...prevData,
          name: user.name,
          email: user.email,
        }));
      }
    } else {
      navigate("/user");
    }
  });

  const handleCheckout = async (e) => {
    e.preventDefault();
    const queryParams = {
      itemsCount,
      totalAmount,
      carts: encodeURIComponent(JSON.stringify(carts)),
    };

    const queryString = new URLSearchParams(queryParams).toString();

    try {
      // Post each product individually
      for (const cart of carts) {
        const orderAPI = {
          name: formData.name,
          quantity: cart.quantity,
          totalPrice: cart.totalPrice,
          status: "pending",
          product: cart.id,
          user: CustomerId,
          message: queryString,
        };
        const response = await axios.post(
          "http://127.0.0.1:8000/orders/",
          orderAPI
        );
        if (response.status === 201) {
          setSuccessPopup(true);
          setTimeout(() => {
            clearCart(); // Clear the cart after successful payment
            navigate("/");
            localStorage.removeItem("cart");
          }, 6000); // Redirect to home after 5 seconds
        } else {
          console.error("Failed to submit order:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);
    }
  };
  // navigate(`/CheckoutPage?${queryString}`);

  if (carts.length === 0) {
    return (
      <div className="container my-5">
        <div className="empty-cart flex justify-center align-center flex-column font-manrope">
          <img src={shopping_cart} alt="" />
          <span className="fw-6 fs-15 text-gray">
            Your shopping cart is empty.
          </span>
          <Link to="/" className="shopping-btn bg-orange text-white fw-5">
            Go shopping Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart bg-whitesmoke">
      <div className="container">
        <div className="cart-ctable">
          <div className="cart-chead bg-white">
            <div className="cart-ctr fw-6 font-manrope fs-15">
              <div className="cart-cth">
                <span className="cart-ctxt">No.</span>
              </div>

              <div className="cart-cth">
                <span className="cart-ctxt">Image</span>
              </div>

              <div className="cart-cth">
                <span className="cart-ctxt">Product</span>
              </div>

              <div className="cart-cth">
                <span className="cart-ctxt">Unit Price</span>
              </div>
              <div className="cart-cth">
                <span className="cart-ctxt">Quantity</span>
              </div>
              <div className="cart-cth">
                <span className="cart-ctxt">Total Price</span>
              </div>
              <div className="cart-cth">
                <span className="cart-ctxt">Actions</span>
              </div>
            </div>
          </div>

          <div className="cart-cbody bg-white">
            {carts.map((cart, idx) => {
              return (
                <div className="cart-ctr py-4" key={cart?.id}>
                  <div className="cart-ctd">
                    <span className="cart-ctxt">{idx + 1}</span>
                  </div>

                  <div className="cart-ctd ">
                    <img
                      src={cart?.thumbnail}
                      alt=""
                      className="cart-modal-item-img"
                    />
                  </div>

                  <div className="cart-ctd">
                    <span className="cart-ctxt">{cart?.title}</span>
                  </div>
                  <div className="cart-ctd">
                    <span className="cart-ctxt">
                      {formatPrice(cart?.discountedPrice)}
                    </span>
                  </div>
                  <div className="cart-ctd">
                    <div className="qty-change flex align-center">
                      <button
                        type="button"
                        className="qty-decrease flex align-center justify-center"
                        onClick={() => {
                          if (cart.quantity > 1) {
                            dispatch(
                              toggleCartQty({ id: cart?.id, type: "DEC" })
                            );
                          } else {
                            dispatch(removeFromCart(cart?.id));
                          }
                        }}
                      >
                        <i className="fas fa-minus"></i>
                      </button>

                      <div className="qty-value flex align-center justify-center">
                        {cart?.quantity}
                      </div>

                      <button
                        type="button"
                        className="qty-increase flex align-center justify-center"
                        onClick={() =>
                          dispatch(toggleCartQty({ id: cart?.id, type: "INC" }))
                        }
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  <div className="cart-ctd">
                    <span className="cart-ctxt text-orange fw-5">
                      {formatPrice(cart?.totalPrice)}
                    </span>
                  </div>

                  <div className="cart-ctd">
                    <button
                      type="button"
                      className="delete-btn text-dark"
                      onClick={() => dispatch(removeFromCart(cart?.id))}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-cfoot flex align-start justify-between py-3 bg-white">
            <div onClick={() => dispatch(clearCart())}>
              <DeleteButton />
            </div>
            {/* <div className="cart-cfoot-l">
              <button
                type="button"
                className="clear-cart-btn text-danger fs-15 text-uppercase fw-4"
                onClick={() => dispatch(clearCart())}
              >
                <i className="fas fa-trash"></i>
                <span className="mx-1">Clear Cart</span>
              </button>
            </div>
            <DeleteButton /> */}

            <div className="cart-cfoot-r flex flex-column justify-end">
              <div className="total-txt flex align-center justify-end">
                <div className="font-manrope fw-5">
                  Total ({itemsCounts}) items:{" "}
                </div>
                <span className="text-orange fs-22 mx-2 fw-6">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              {/* <button
                type="button"
                className="checkout-btn text-white bg-orange fs-16"
                
              >
                Check Out
              </button> */}
              {!successPopup && (
                <div onClick={handleCheckout}>
                  <GalaxyButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Success message popup */}
      {successPopup && (
        <div className="success-popup">
          <p>Order Submitted successful!</p>
          <p>Please, Check your email for approval</p>
          <p> Redirecting to home page...</p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
