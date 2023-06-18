import { createStore,combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  getAllPizzaReducer,
  addPizzaReducer,
  getPizzaByIdReducer,
  updatePizzaByIdReducer,
} from "./reducers/pizzaReducer";
import { cartReducer } from "./reducers/cartReducer";
import {
  registerUserReducer,
  loginUserReducer,
  // getAllUsersReducer,
} from "./reducers/userReducer";
import {
  placeOrderReducer,
  // getUserOrdersReducer,
  // allUserOrdersReducer,
} from "./reducers/orderReducer";
// const cartItems = localStorage.getItem("cartItems")
//   ? JSON.parse(localStorage.getItem("cartItems"))
//   : [];

// const rootReducer = combineReducers({
//   getAllPizzaReducer: getAllPizzaReducer,
//   cartReducer: cartReducer,
//   registerUserReducer: registerUserReducer,
//   loginUserReducer: loginUserReducer,
//   placeOrderReducer: placeOrderReducer,
//   getUserOrdersReducer: getUserOrdersReducer,
//   addPizzaReducer: addPizzaReducer,
//   getPizzaByIdReducer: getPizzaByIdReducer,
//   updatePizzaByIdReducer: updatePizzaByIdReducer,
//   allUserOrdersReducer: allUserOrdersReducer,
//   getAllUsersReducer: getAllUsersReducer, 
// });


const cartItemsString = localStorage.getItem("cartItems");
const cartItems = cartItemsString && cartItemsString !== "undefined"
  ? JSON.parse(cartItemsString)
  : [];

const currentUserString = localStorage.getItem("currentUser");
const currentUser = currentUserString && currentUserString !== "undefined"
  ? JSON.parse(currentUserString)
  : null;
  

const rootReducer= combineReducers({
  getAllPizzaReducer:getAllPizzaReducer,
  cartReducer:cartReducer,
  registerUserReducer: registerUserReducer,
  loginUserReducer:loginUserReducer,
  placeOrderReducer: placeOrderReducer,
  addPizzaReducer:addPizzaReducer,
  getPizzaByIdReducer:getPizzaByIdReducer,
  updatePizzaByIdReducer: updatePizzaByIdReducer,
});

const initialState = {
  cartReducer: {
    cartItems: cartItems,
  },
  loginUserReducer: {
    currentUser: currentUser,
  },
};
const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;