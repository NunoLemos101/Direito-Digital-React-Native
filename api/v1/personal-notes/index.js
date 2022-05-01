import axios from "axios";

class PersonalNotesAPI {

    static baseEndpoint = "/api/v1/personal-notes"

    static list(callback) {
        axios.get(this.baseEndpoint).then(response => callback(response))
    }

    static create(data, callback) {
        axios.post(this.baseEndpoint, data).then(response => callback(response))
    }

    static destroy(data, callback) {
        axios.delete(`${this.baseEndpoint}?ids=${data}`).then(response => callback(response))
    }

    static retrieve(id, callback) {
        axios.get(`${this.baseEndpoint}/${id}`).then(response => callback(response))
    }

    static update(id, data) {
        axios.put(`${this.baseEndpoint}/${id}`, data)
    }
}

export default PersonalNotesAPI;
