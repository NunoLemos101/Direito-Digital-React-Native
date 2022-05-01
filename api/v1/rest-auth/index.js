import axios from "axios";
import {onReceiveToken, authAutoLogin, authAutoNetworkError} from "../../../redux/actions/auth";

class RestAuthAPI {

    static baseEndpoint = "/api/v1/rest-auth";

    static autoSignIn(dispatch) {
        axios.get(`${this.baseEndpoint}/user/`).then(response => dispatch(authAutoLogin(response))).catch(error => dispatch(authAutoNetworkError(error)));
    }

    static login(data, dispatch, errorCallback) {
        axios.post(`${this.baseEndpoint}/login/`, data)
            .then(response => dispatch(onReceiveToken(response)))
            .catch(error => errorCallback(error))
    }

    static register(data, dispatch, errorCallback) {
        axios.post(`${this.baseEndpoint}/registration/`, data)
            .then(response => dispatch(onReceiveToken(response)))
            .catch(error => errorCallback(error))
    }

    static googleOAuth(data, dispatch) {
        axios.post(`${this.baseEndpoint}/oauth/google/`, data).then(response => dispatch(onReceiveToken(response)))
    }
}

export default RestAuthAPI
