import React, { Fragment,useEffect } from "react";
// import { CgMouse } from "react-icons";
import "./Home.css";

import Product from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import {  getProduct } from "../../actions/productActions";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loder/Loder";

import { useAlert } from "react-alert";

// const product={
//   name:"Blue tshirt",
//   images:[{url:"https://i.ibb.co/DRST11n/1.webp"}],  
//   price:"3000",
//   _id:"abhishek"   
// }
const Home = () => {
  const dispatch=useDispatch();
  const alert = useAlert();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      return  alert.error(error);
      // dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {loading?(
        // "loading"
        <Loader/>
        ):
      (<Fragment>
        <MetaData title="Ecommers"/>
            <div className="banner">
              <p>Welcome to Ecommerce</p>
              <h1>FIND AMAZING PRODUCTS BELOW</h1>
  
              <a href="#container">
                <button>
                  Scroll 
                </button>
              </a>
            </div>
            <h2 className="homeHeading">Featured Products</h2>
  
            <div className="container" id="container">          
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}           
            </div>
      </Fragment>)}
    </Fragment>
    
  );
};

export default Home;