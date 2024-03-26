import React, { useEffect, useState } from "react";
import "./UserComponent.css";
import { Link, useNavigate } from "react-router-dom";
// import RegisterComponent from "./RegisterComponent";
// import LoginComponent from "./LoginComponent";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const loginPatx = /^[a-zA-Z0-9._]+@[a-z]{1,8}\.(com|eg|gov|edu)$/;
const passwordRegexx =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=])(?=.*[^\w\d\s]).{8,}$/;

const ValidSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please Enter a Valid Email")
    .required("Must Add Email")
    .matches(loginPatx, "Email Didn't Meet Requirements should contain @ and ."),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .matches(
      passwordRegexx,
      "Password must contain at least a uppercase letter, a lowercase letter, a number, a special character, and be at least 8 characters long"
    )
    .required("Must Fill this Field"),
  name: yup
    .string()
    .min(3, "Name must be at least 3 letters")
    .max(15, "Name must be maximum 15 letters")
    .required("Must Fill this Field"),
});

function RegisterComponent() {
  const [isError, setIsError] = useState(false);
  // const [type, setType] = useState("signUp");
  const {
    type, setType } = useAuth();

  const { values, errors, handleChange, handleSubmit, touched, handleBlur } =
    useFormik({
      initialValues: {
        id: "",
        email: "",
        name: "",
        password: "",
        role: "",
      },
      validationSchema: ValidSchema,

      onSubmit: async (values, { resetForm }) => {
        if (!values.email || !values.name || !values.password || !values.role) {
          setIsError(true);
          console.log(values);
          return;
        }

        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/users/",
            values
          );
          console.log("User registered:", response.data);
          setType("signIn");
          resetForm();
        } catch (error) {
          console.error("Error registering user:", error);
          setIsError(true);
        }
      },
    });

  const [showRegPassword, setRegShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setRegShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <div className="form-containerx sign-up-containerx">
        <form className="form" onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          <div className="social-containerx">
            <a href="#" className="icon a">
              <i id="id-btn-register-phone" className="fa-solid fa-phone"></i>
            </a>
            <a href="#" className="icon a">
              <i
                id="id-btn-register-google"
                className="fa-brands fa-google"
              ></i>
            </a>
          </div>
          <span>or use your email for registration</span>
          <input
            type="text"
            className="input"
            name="name"
            value={values.name}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Please, enter your name"
            class={errors.name && touched.name ? "input-error" : ""}
          />
          {errors.name && touched.name && (
            <p className="error">{errors.name}</p>
          )}
          <input
            type="email"
            className="input"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Please, enter your email"
            class={errors.email && touched.email ? "input-error" : ""}
          />
          {errors.email && touched.email && (
            <p className="error">{errors.email}</p>
          )}
          <input
            type={showRegPassword ? "text" : "password"}
            className="input"
            name="password"
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Please, enter your password"
            class={errors.password && touched.password ? "input-error" : ""}
          />
          <span
            className="password-toggle-iconx"
            onClick={togglePasswordVisibility}
          >
            {showRegPassword ? (
              <i class="fas fa-eye" />
            ) : (
              <i class="fas fa-eye-slash" />
            )}
          </span>

          {errors.password && touched.password && (
            <p className="error1">{errors.password}</p>
          )}
          <select
            className="input"
            name="role"
            value={values.role}
            onBlur={handleBlur}
            onChange={handleChange}
            class={errors.role && touched.role ? "input-error" : ""}
          >
            <option value="">Select Role</option>
            {/* <option value="admin">Admin</option> */}
            <option value="seller">Seller</option>
            <option value="customer">Customer</option>
          </select>
          {errors.role && touched.role && (
            <p className="error">{errors.role}</p>
          )}
          {isError && <p className="error">Please, fill all data.</p>}
          <button type="submit" className="button">
            Register
          </button>
        </form>
      </div>
    </>
  );
}

const loginPat = /^[a-zA-Z0-9._]+@[a-z]{1,8}\.(com|eg|gov|edu)$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=])(?=.*[^\w\d\s]).{8,}$/;

const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please Enter a Valid Email")
    .required("Must Add Email")
    .matches(loginPat, "Email Doesn't Meet Requirements"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .matches(
      passwordRegex,
      "Password must contain at least one uppercase letter, lowercase letter, number, special character, and be at least 8 characters long"
    )
    .required("Must Fill this Field"),
});

const LoginComponent = () => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);

  const { handleSubmit, values, errors, handleBlur, touched, handleChange } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: LoginSchema,
      onSubmit: async (values) => {
        try {
          const response = await axios.post(
            `http://127.0.0.1:8000/login/`,
            values
          );
          if (response.status === 200) {
            const { access, refresh, user } = response.data;
            localStorage.setItem("accessToken", access); // Store access token
            localStorage.setItem("refreshToken", refresh); // Store refresh token
            localStorage.setItem(
              "login",
              JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              })
            );
            localStorage.setItem("cart", "[]");
            setIsError(false);
            // redirectBasedOnRole(user.role);
            navigate("/");
          } else {
            setIsError(true);
          }
        } catch (error) {
          console.error("Error logging in:", error);
          setIsError(true);
        }
      },
    });

  useEffect(() => {
    if (localStorage.getItem("login") !== null) {
      const user = JSON.parse(localStorage.getItem("login"));
      redirectBasedOnRole(user.role);
    }
  }, []);

  const redirectBasedOnRole = (role) => {
    if (role === "customer") {
      navigate("/");
    } else if (role === "seller") {
      navigate("/Dashboard");
    }
  };

  const redirectCounterRoleToUpdateNavbar = (role) => {
    if (role === "customer") {
      navigate("/");
    } else if (role === "seller") {
      navigate("/Dashboard");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="form-containerx sign-in-containerx">
      <Form className="form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="social-containerx">
          <a href="#" className="icon a">
            <i id="id-btn-login-phone" className="fa-solid fa-phone"></i>
          </a>
          <a href="#" className="icon a">
            <i id="id-btn-login-google" className="fa-brands fa-google"></i>
          </a>
        </div>
        <span>or use your email for registration</span>
        <Form.Control
          type="text"
          value={values.email}
          id="email"
          placeholder="Please, enter your email"
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.email && touched.email && (
          <p className="error">{errors.email}</p>
        )}

        <Form.Control
          value={values.password}
          id="password"
          type={showPassword ? "text" : "password"}
          onBlur={handleBlur}
          placeholder="Please, enter your password"
          onChange={handleChange}
          // className="user-box-login"
        />
        {/* <label>Password</label> */}
        <span
          className="password-toggle-iconx"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <i class="fas fa-eye" />
          ) : (
            <i class="fas fa-eye-slash" />
          )}
        </span>

        {errors.password && touched.password && (
          <p className="error2">{errors.password}</p>
        )}

        <a className="a3" href="#">
          Forgot your password?
        </a>

        <span className="span">
          By clicking " Login," you agree to our{" "}
          <a className="a1" href="http://">
            Terms of Use
          </a>{" "}
          and our{" "}
          <a className="a1" href="http://">
            Privacy Policy
          </a>
          .
        </span>
        {isError && <p className="error">Incorrect email or password</p>}
        <Button className="button my-3" variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
};

const UserComponent = () => {
  const {
    type, setType } = useAuth();
  // const [type, setType] = useState("signIn");
  const navigate = useNavigate();
  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  useEffect(() => {
    if (localStorage.getItem("login") != null) {
      navigate("/");
    }
  }, [navigate]);
  const containerxClass =
    "containerx " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="ghost body">
      <div className={containerxClass} id="containerx">
        <RegisterComponent />
        <LoginComponent />
        <div className="overlay-containerx">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us, please login with your personal info
              </p>
              <button
                className="ghost button"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Login
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start the journey with us</p>
              <button
                className="ghost button"
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
