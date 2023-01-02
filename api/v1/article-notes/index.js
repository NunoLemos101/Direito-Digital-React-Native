import axios from "axios";


class ArticleNotesAPI {

    static baseEndpoint = "/api/v1/article-notes";


    static create(data, callback) {
        axios.post(this.baseEndpoint, data).then(response => callback(response)).catch(err => console.log(err.response.data));
    }

    static update(id, data, callback) {
        axios.put(this.baseEndpoint + "/" + id, data).then(response => callback(response))
    }

    static delete(id) {
        axios.delete(this.baseEndpoint + "/" + id)
    }
}

export default ArticleNotesAPI;
