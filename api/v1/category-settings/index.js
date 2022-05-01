import axios from "axios";
import {updateCategorySettings, updateCategorySettingsOffline} from "../../../redux/actions/auth";

function cloneNestedArray(data) {
    const ouputArray = []
    data.forEach((item) => {
        const tempItem = {codigos: []}
        tempItem.id = item.id
        tempItem.themeColor = item.themeColor
        tempItem.thumbnail = item.thumbnail_text
        tempItem.title = item.title
        item.codigos.forEach((item1, index) => {
            tempItem.codigos.push(item1.code.toLowerCase())
        })
        ouputArray.push(tempItem)
    })
    return ouputArray;
}

class CategorySettingsAPI {

    static baseEndpoint = "/api/v1/category-settings";

    static retrieve(callback) {
        axios.get(this.baseEndpoint).then(response => callback(response))
    }

    static update(data, dispatch) {
        axios.put(this.baseEndpoint, data).then(response => dispatch(updateCategorySettings(response)))
    }

    static offlineUpdate(data, dispatch) {
        // The offlineUpdate function updates the categories
        // online as well but the redux state update is done
        // before the HTTP request giving the user
        // a better experience
        dispatch(updateCategorySettingsOffline(data))
        axios.put(this.baseEndpoint, {categorySettings: cloneNestedArray(data)})
    }
}

export default CategorySettingsAPI;
