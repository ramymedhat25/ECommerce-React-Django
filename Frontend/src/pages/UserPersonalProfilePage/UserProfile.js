import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import UserSidebar from "../../components/UserProfileComponents/UserSidebar";
import AccountSettings from "../../components/UserProfileComponents/AccountSettings";
import LegalNotice from "../../components/UserProfileComponents/LegalNotice";
import "./UserProfile.css";

const UserProfile = () => {
  const { activepage } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("login"));
        if (!user || user.role === "seller") {
          navigate("/user");
          return;
        }
        setFormData({
          name: user.name,
          email: user.email,
        });

        const ordersResponse = await axios.get("http://127.0.0.1:8000/orders/");
        setOrders(
          ordersResponse.data.filter((order) => order.user === user.id)
        );

        const productsResponse = await axios.get(
          "http://127.0.0.1:8000/products/"
        );
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const getProductById = (productId) => {
    return products.find((product) => product.id === productId) || {};
  };

  return (
    <div className="userprofile">
      <div className="userprofilein">
        <div className="left">
          <div className="card">
            <img
              height="250px"
              src="https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png"
              alt="Person"
              className="card__image"
            />
            <h1 style={{ textAlign: "center", fontSize: "20px" }}>
              Welcome {formData.name}
            </h1>
          </div>
          <UserSidebar activepage={activepage} />
        </div>
        <div className="right">
          {activepage === "accountsettings" && <AccountSettings />}
          {activepage === "legalnotice" && <LegalNotice />}
          {activepage === "yourorders" && (
            <div className="order-list">
              <h2>Your Orders</h2>
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-details">
                    <h3>Product Name: {getProductById(order.product).name}</h3>
                    <p>Quantity: {order.quantity}</p>
                    <p>Total Price: {order.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
