import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError
} from './noticeSlice';
const REACT_APP_BASE_URL = "http://localhost:5000";
export const getAllNotices = (id, address) => async (dispatch) => {
    dispatch(getRequest());
 console.log("📡 Fetching notices with:", { id, address });
   // Prevent invalid API call if ID is missing
    if (!id) {
        dispatch(getError("Invalid ID — cannot fetch notices."));
        return;
    }
    try {
        const url = await axios.get(`${REACT_APP_BASE_URL}/${address}List/${id}`);
          console.log("➡️ API URL:", url);

        const result = await axios.get(url);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message));
    }
}