import axios from "axios";
// import jwt from "jsonwebtoken";
import {setAuthToken, deleteAuthToken} from '../utils/auth'
import '../utils/constants';
import {ROLE_GUEST} from "../utils/constants";

const GET_IDENTITY = 'GET_IDENTITY';
const GET_IDENTITY_PENDING = 'GET_IDENTITY_PENDING';
const GET_IDENTITY_FULFILLED = 'GET_IDENTITY_FULFILLED';
const GET_IDENTITY_REJECTED = 'GET_IDENTITY_REJECTED';
const LOGIN = 'LOGIN';
const LOGIN_PENDING = 'LOGIN_PENDING';
const LOGIN_REJECTED = 'LOGIN_REJECTED';
const LOGIN_FULFILLED = 'LOGIN_FULFILLED';
const REGISTRATION = 'REGISTRATION';
const REGISTRATION_PENDING = 'REGISTRATION_PENDING';
const REGISTRATION_REJECTED = 'REGISTRATION_REJECTED';
const REGISTRATION_FULFILLED = 'REGISTRATION_FULFILLED';

export const initialState = {
    isAuthenticated: false,
    loginForm: {
        isFetching: false,
        hasError: false,
        isValid: false,
        data: {
            email: "",
            password: "",
            role: ROLE_GUEST
        }
    },
    registrationForm: {
        isFetching: false,
        hasError: false,
        isValid: false,
        data: {
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            password: "",
        }
    },
    identity:{
        isFetching: false,
        data:{
            role: ROLE_GUEST
        }
    }

};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_IDENTITY_PENDING: {
            return {
                ...state,
                isAuthenticated: false,
                identity: {isFetching: true, data: {role: ROLE_GUEST}}
            }
        }
        case GET_IDENTITY_FULFILLED: {
            return {
                ...state,
                isAuthenticated: true,
                identity: {isFetching: false, data: action.paylmoad.data.data}
            }
        }
        case GET_IDENTITY_REJECTED: {
            return {
                ...state,
                isAuthenticated: false,
                identity: {isFetching: false, data: {role: ROLE_GUEST}}
            }
        }
        case LOGIN_PENDING: {
            return {...state, loginForm: {isFetching: true, hasError: false, isValid: false}}
        }
        case LOGIN_REJECTED: {
            return {...state, loginForm: {isFetching: false, hasError: true, isValid: false}}
        }
        case LOGIN_FULFILLED: {
            return {
                ...state,
                loginForm: {
                    isFetching: false,
                    hasError: false,
                    isValid: true,
                    // data: action.data
                }
            }
        }
        case REGISTRATION_PENDING: {
            return {...state, registrationForm: {isFetching: true, hasError: false, isValid: false}}
        }
        case REGISTRATION_REJECTED: {
            return {...state, registrationForm: {isFetching: false, hasError: true, isValid: false}}
        }
        case REGISTRATION_FULFILLED: {
            return {
                ...state,
                registrationForm: {
                    isFetching: false,
                    hasError: false,
                    isValid: true,
                    // data: action.data
                }
            }
        }
        default: {
            return state
        }
    }
}

export function getIdentity() {
    return {
        type: GET_IDENTITY,
        payload: axios.get("/api/v1/users/me/").then((response) => {
            // return jwt.decode(localStorage.jwtoken);
            return response;
        }).catch((er)=>{
            deleteAuthToken();
            return Promise.reject(new Error(er))
        })
    }
}

export function login(email, password) {
    return {
        type: LOGIN,
        payload: axios({
            method: 'post',
            url: "/api/v1/auth/login/",
            data: {
                email: email,
                password: password
            }
        }).then((response) => {
            setAuthToken(response.data.data.token);
        })
    }
}

export function registration(email, password, firstName, middleName, lastName) {
    return {
        type: REGISTRATION,
        payload: axios({
            method: 'post',
            url: "/api/v1/users/",
            data: {
                email: email,
                password: password,
                firstname: firstName,
                middlename: middleName,
                lastname: lastName
            }
        })
    }
}

