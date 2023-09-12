import { useCallback, useState, useReducer, useEffect } from "react";
import axios from "axios";

const useRequest = ({ url, method, body, fields, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  // Make initial state dynamicaly
  const getInitialErrorState = useCallback(() => {
    const initialState = {};
    fields &&
      fields.forEach((field) => {
        initialState[field] = { error: "" };
      });
    initialState.general = { error: "" };
    return initialState;
  }, [fields]);

  // REDUCER FOR FIELD ERRORS
  const formReducer = (state, action) => {
    const field = action.payload?.field ? action.payload.field : "general";
    if (action.type === "INIT_ERROR") {
      return getInitialErrorState();
    } else {
      const newState = { ...state, [field]: { error: action.payload.message } };
      return newState;
    }
  };

  const [errorState, dispatch] = useReducer(
    formReducer,
    getInitialErrorState()
  );

  // Fill reducers state with errors, if there is any
  useEffect(() => {
    errors &&
      errors.forEach((err) => {
        if (err.field) {
          dispatch({
            type: `${err.field.toUpperCase()}_ERROR`,
            payload: {
              field: err.field,
              message: err.message,
            },
          });
        } else {
          dispatch({
            type: "GENERAL_ERROR",
            payload: {
              field: "general",
              message: err.message,
            },
          });
        }
      });
  }, [errors]);

  const doRequest = async (props) => {
    setErrors(null);
    dispatch({
      type: "INIT_ERROR",
    });
    try {
      const response = await axios[method](url, {
        ...body,
        ...props,
      });
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      const response = await error.response;
      setErrors(response.data.errors);
    }
  };

  return { doRequest, errorState };
};

export default useRequest;
