import axios from "axios";
import {updateFontSettings} from "../../../redux/actions/auth";

class FontSettingsAPI {

    static baseEndpoint = "/api/v1/font-settings";

    static retrieve(callback) {
        axios.get(this.baseEndpoint).then(response => callback(response))
    }

    static resetFont(dispatch) {
        const defaultFont = {
            "fontFamily": "Roboto-Regular",
            "fontSize": 14,
            "color": "#7F7F7F",
            "backgroundColor": "#FFFFFF",
            "fontWeight": "normal",
            "fontStyle": "normal",
        }
        axios.put(this.baseEndpoint, defaultFont).then(response => dispatch(updateFontSettings(response)))
    }

    static update(data, dispatch) {
        axios.put(this.baseEndpoint, data).then(response => dispatch(updateFontSettings(response)))
    }

    static offlineUpdate(data, dispatch) {
        // The offlineUpdate function updates the font
        // online as well but the redux state update is done
        // before the HTTP request giving the user
        // a faster button transition
        const response = { data: data, status: 200}
        dispatch(updateFontSettings(response))
        axios.put(this.baseEndpoint, data)
    }
}

export default FontSettingsAPI;
