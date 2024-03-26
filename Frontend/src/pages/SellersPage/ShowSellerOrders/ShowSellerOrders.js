import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SlideBarBuyer from "../Dashboard/SlideBarBuyer";
import "./ShowSellerOrders.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllCarts } from "../../../store/cartSlice";
import { formatPrice } from "../../../utils/helpers";

function ShowSellerOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Change this to adjust the number of products per page
  const navigate = useNavigate();
  const carts = useSelector(getAllCarts);
  const dispatch = useDispatch();
  const [status, setStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("login"));
        const sellerId = user.id;

        // Fetch orders
        const ordersResponse = await axios.get("http://127.0.0.1:8000/orders/");
        setOrders(ordersResponse.data);

        // Extract product IDs from orders
        const productIds = ordersResponse.data.map((order) => order.product);
        console.log("productIds", productIds);

        // Fetch all products
        const allproductResponse = await axios.get(
          "http://127.0.0.1:8000/products/"
        );

        // Filter products based on productIds
        const filteredProducts = allproductResponse.data.filter((product) =>
          productIds.includes(product.id)
        );
        console.log("filteredProducts", filteredProducts);

        // Set filtered products to state or wherever needed
        setProducts(filteredProducts);

        // Filter products based on userId equal to sellerId
        const sellerProducts = filteredProducts.filter(
          (product) => product.user === sellerId
        );
        setSellerProducts(sellerProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (localStorage.getItem("login") !== null) {
      fetchData();
    } else {
      navigate("/user");
    }
  }, [navigate]);

  const updateProductStock = async (productId, quantity) => {
    try {
      // Fetch the current product data
      const productResponse = await axios.get(
        `http://127.0.0.1:8000/products/${productId}/`
      );
      const currentStock = productResponse.data.stock;

      // Calculate the new stock after subtracting the quantity ordered
      const newStock = currentStock - quantity;

      // Update the product with the new stock value
      await axios.patch(`http://127.0.0.1:8000/products/${productId}/`, {
        stock: newStock,
      });
    } catch (error) {
      console.error("Error updating product stock:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/orders/${orderId}/`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handlePaymentSuccess = async (orderId, productId, quantity) => {
    const acceptanceServiceId = "service_ke1k7vh";
    const acceptanceTemplateId = "template_zlqf4pn";
    const acceptancePublicKey = "snpUPfWKIHXJScN_e";

    try {
      // Fetch the specific order
      const orderResponse = await axios.get(
        `http://127.0.0.1:8000/orders/${orderId}`
      );
      const message = orderResponse.data.message;

      // Update product stock
      await updateProductStock(productId, quantity);

      // Update order status locally
      setStatus((prevStatus) => ({ ...prevStatus, [orderId]: "Accepted" }));

      // Update order status on server
      await updateOrderStatus(orderId, "Accepted");

      const acceptanceData = {
        service_id: acceptanceServiceId,
        template_id: acceptanceTemplateId,
        user_id: acceptancePublicKey,
        template_params: {
          email: "ramymedhat97@gmail.com",
          message: message,
          status: "Approved",
        },
      };

      await axios.post(
        "https://api.emailjs.com/api/v1.0/email/send",
        acceptanceData
      );
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handlePaymentFailed = async (orderId) => {
    const acceptanceServiceId = "service_ke1k7vh";
    const acceptanceTemplateId = "template_zlqf4pn";
    const acceptancePublicKey = "snpUPfWKIHXJScN_e";

    try {
      // Fetch the specific order
      const orderResponse = await axios.get(
        `http://127.0.0.1:8000/orders/${orderId}`
      );
      const message = orderResponse.data.message;

      const acceptanceData = {
        service_id: acceptanceServiceId,
        template_id: acceptanceTemplateId,
        user_id: acceptancePublicKey,
        template_params: {
          email: "ramymedhat97@gmail.com",
          message: message,
          status: "Rejected",
        },
      };

      await axios.post(
        "https://api.emailjs.com/api/v1.0/email/send",
        acceptanceData
      );

      setStatus((prevStatus) => ({ ...prevStatus, [orderId]: "Rejected" }));
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Pagination logic here...

  return (
    <>
      <div className="grid-containerwa">
        <SlideBarBuyer />
        <div className="product-list-container-buyer">
          <h1 className="buyerheader">Ordering List</h1>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Image</th>
                  <th>Product</th>
                  {/* <th>Unit Price</th> */}
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Render your products here */}
                {sellerProducts.map((product, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <img
                        src={product.thumbnail}
                        alt=""
                        className="cart-modal-item-img"
                      />
                    </td>
                    <td>{product.title}</td>
                    {/* <td>{formatPrice(product.discountedPrice)}</td> */}
                    {/* Use quantity and total price from orders */}
                    <td>{orders[idx].quantity}</td>
                    <td>{formatPrice(orders[idx].totalPrice)}</td>
                    <td>
                      {status[orders[idx].id] === "Accepted" && (
                        <p>Order Accepted</p>
                      )}
                      {status[orders[idx].id] === "Rejected" && (
                        <p>Order Rejected</p>
                      )}
                      {(!status[orders[idx].id] ||
                        (status[orders[idx].id] !== "Accepted" &&
                          status[orders[idx].id] !== "Rejected")) && (
                        <>
                          <button
                            className="primarys-btn"
                            onClick={() =>
                              handlePaymentSuccess(
                                orders[idx].id,
                                product.id,
                                orders[idx].quantity
                              )
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="dangerssq-btn"
                            onClick={() => handlePaymentFailed(orders[idx].id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination component */}
        </div>
      </div>
    </>
  );
}

export default ShowSellerOrders;
