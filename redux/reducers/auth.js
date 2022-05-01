import {updateObject} from "../utility";
import {dummyData} from "../../constants";

const initialState = {
    token: null,
    username: null,
    pictureURI: null,
    versionName: null,
    dateJoined: null,
    isPremium: null,
    onInitRoute: "LoadingScreen",
    fontSettings: {
        fontFamily: "Roboto-Regular",
        fontSize: 14,
        lineHeight: 14,
        color: "#7F7F7F",
        fontWeight: "normal",
        fontStyle: "normal",
        backgroundColor: "#FFFFFF"
    },
    categorySettings: []
}

const authSuccess = (state, action) => {
    console.log(action)
    let pictureURI;
    try {
        pictureURI = JSON.parse(action.data.social_account.extra_data).picture
    } catch (error) {
        pictureURI = null
    }

    action.data.category_settings.forEach(item => {
        item.thumbnail_text = item.thumbnail
        item.thumbnail = dummyData.categories_thumbnails[item.thumbnail]
        item.codigos.forEach((obj, index) => (item.codigos[index] = dummyData.codigos_dict[obj]))
    })

    return updateObject(state, {
        token: action.data.key,
        username: action.data.username,
        pictureURI: pictureURI,
        versionName: action.data.android_version_name,
        dateJoined: action.data.date_joined,
        isPremium: action.data.premium,
        onInitRoute: "Dashboard",
        fontSettings: action.data.font_settings,
        categorySettings: action.data.category_settings
    })
}

const updateFontSettings = (state, action) => {
    return updateObject(state, {fontSettings: action.data})
}

const updateCategorySettings = (state, action) => {
    return updateObject(state, {categorySettings: action.data})
}

const authNetworkError = () => updateObject(initialState, { onInitRoute: "NetworkError" })

const authLogout = () => updateObject(initialState, { onInitRoute: "Welcome" })

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case "AUTH_SUCCESS":
            return authSuccess(state, action);
        case "FONT_SETTINGS_UPDATE":
            return updateFontSettings(state, action);
        case "CATEGORY_SETTINGS_UPDATE":
            return updateCategorySettings(state, action);
        case "AUTH_LOGOUT":
            return authLogout();
        case "AUTH_NETWORK_ERROR":
            return authNetworkError();
        default:
            return state;
    }
}

export default reducer;
