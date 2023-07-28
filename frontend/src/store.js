import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { productDetailsReducer, productsReducer } from "./reducers/productReducer";
import { userReducer } from "./reducers/userReducer";
// import {
//   newProductReducer,
//   newReviewReducer,
//   productDetailsReducer,
//   productReducer,
//   productReviewsReducer,
//   productsReducer,
//   reviewReducer,
// } from "./reducers/productReducer";

// import {
  // allUsersReducer,
  // forgotPasswordReducer,
  // profileReducer,
  // userDetailsReducer,
//   userReducer,
// } from "./reducer/userReducer";

// import { cartReducer } from "./reducers/cartReducer";
// import {
//   allOrdersReducer,
//   myOrdersReducer,
//   newOrderReducer,
//   orderDetailsReducer,
//   orderReducer,
// } from "./reducers/orderReducer";

const reducer = combineReducers({
  products:productsReducer,
  productDetails:productDetailsReducer,
  user:userReducer
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;