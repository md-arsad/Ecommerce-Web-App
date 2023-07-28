import axios from "axios";
import {
    LOGIN_REQUEST,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    CLEAR_ERRORS,
  } from "../constants/userConstant";

export const login = (email, password) => async (dispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
  
      const config = { headers: { "Content-Type": "application/json" } };
  
      const { data } = await axios.post(
        `/api/v1/login`,
        { email, password }, 
        config
      );
  
      dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    } catch (error) {
        console.log("from user action catch part",error.response.data);
      dispatch({ type: LOGIN_FAIL, payload:error.response.data.message });
    }
  };

export const clearErrors=async(dispatch)=>{     
    dispatch({type:CLEAR_ERRORS})
}