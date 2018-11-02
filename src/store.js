import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { localeReducer as locale } from 'react-localize-redux';
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import { combineReducers } from 'redux'
import { combineForms } from 'react-redux-form';
import createSagaMiddleware from 'redux-saga'
// import jwtDecode from 'jwt-decode';
// import moment from "moment";

// import identity, {initialState as identityFormInit, logout} from './modules/identity';
import identity, {initialState as identityFormInit} from './modules/identity';
import users from './modules/users';


import companies from './modules/companies';
import productOffers, {initialState as addProductsInit} from './modules/productOffers';
import popup from './modules/popup';
import filter, {initialState as filterInit} from './modules/filter';
import packageTypes from './modules/packageTypes';
import broadcastRules, {initialState as broadcastRulesInit} from "./modules/broadcastRule";
import broadcast, {initialState as broadcastInit} from "./modules/broadcast";
import cart, {initialState as cartInit} from "./modules/cart";
import merchants, {initialState as merchantsInit} from "./modules/merchants";
import products, {initialState as productsInit} from './modules/products';
import location from './modules/location';
import errors from "./modules/errors";
import dataTables from "./modules/dataTables";

import companiesSaga from "./saga/companies";
import officesSaga from "./saga/offices";
import merchantsSaga from "./saga/merchants";
import usersSaga from "./pages/administration/users/saga/users";
import operatorsSaga from "./pages/administration/operators/saga/operators";
import cartSaga from "./pages/cart/saga/cart";
import locationsSaga from "./saga/locations";
import broadcastSaga from "./saga/broadcast";

const reducer = combineReducers({
    identity,
    broadcast,
    companies,
    locale,
    users,
    location,
    productOffers,
    products,
    packageTypes,
    cart,
    popup,
    broadcastRules,
    merchants,
    filter,
    errors,
    dataTables,
    forms: combineForms({
        filter: filterInit.data,
        broadcastRules: broadcastRulesInit,
        addProductOffer: addProductsInit.addProductOffer,
        productMapping: productsInit.productsMapping,
        productOffering: productsInit.productOffering,
        loginForm: identityFormInit.loginForm.data,
        registrationForm: identityFormInit.registrationForm.data,
        merchants: merchantsInit,
        cart: cartInit,
        shippingEdit: {},
    }, 'forms'),
});

const logger = createLogger({
    predicate: (getState, action) => process.env.NODE_ENV === "development"
});

// Middleware to check token expiration and potentially redirect user to login package
// const checkTokenExpirationMiddleware = store => next => action => {
//     const token = localStorage.getItem('jwtoken');
//     if (token) {
//         const expirationTime = moment(jwtDecode(token).exp);
//         const nowTime = moment(Date.now() / 1000)
//       if (expirationTime < nowTime) {
//         next(action);
//         store.dispatch(logout());
//       }
//     }
//     next(action);
//   };

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const middleware = applyMiddleware(thunk, promise(), sagaMiddleware, logger);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
export default createStore(reducer, composeEnhancers, middleware)

sagaMiddleware.run(companiesSaga);
sagaMiddleware.run(officesSaga);
sagaMiddleware.run(usersSaga);
sagaMiddleware.run(operatorsSaga);
sagaMiddleware.run(merchantsSaga);
sagaMiddleware.run(cartSaga);
sagaMiddleware.run(locationsSaga);
sagaMiddleware.run(broadcastSaga);