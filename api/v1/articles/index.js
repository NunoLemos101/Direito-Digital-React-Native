import axios from "axios";

class ArticlesAPI {

    static baseEndpoint = "/api/v1/articles/";

    static retrieve(id, callback) {
        axios.get(this.baseEndpoint + id).then(response => callback(response))
    }

    static addToFavorites(id) {
        axios.post(this.baseEndpoint + "add-to-favorites/", {id: id}).then(response => {})
    }
}

export default ArticlesAPI;
