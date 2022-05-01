import axios from "axios";
import {AsyncStorage} from "react-native";

export const onReceiveToken = (response) => {
    return async dispatch => {
        if (response.status === 200 || response.status === 201) {
            const token = response.data.key;
            await AsyncStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Token ${token}`
            dispatch({type: "AUTH_SUCCESS", data: response.data})
        }
    }
}

export const updateFontSettings = (response) => {
    return async dispatch => {
        if (response.status === 200 || response.status === 201) {
            dispatch({type: "FONT_SETTINGS_UPDATE", data: response.data})
        }
    }
}

export const updateFontSettingsOffline = (data) => {
    return async dispatch => {
        dispatch({type: "FONT_SETTINGS_UPDATE", data: data})
    }
}

export const updateCategorySettings = (response) => {
    return async dispatch => {
        if (response.status === 200 || response.status === 201) {
            dispatch({type: "CATEGORY_SETTINGS_UPDATE", data: response.data})
        }
    }
}

export const updateCategorySettingsOffline = (data) => {
    return async dispatch => {
        dispatch({type: "CATEGORY_SETTINGS_UPDATE", data: data})
    }
}

export const authAutoLogin = (response) => {
    return async dispatch => {
        if (response.status === 200) dispatch({type: "AUTH_SUCCESS", data: response.data})
    }
}

export const authAutoNetworkError = (error) => {
    return async dispatch => {
        if (error.message === "Network Error") dispatch({type: "AUTH_NETWORK_ERROR"})
    }
}

export const authLogout = () => {
    return async dispatch => {
        await AsyncStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
        dispatch({type: "AUTH_LOGOUT"})
    }
}
