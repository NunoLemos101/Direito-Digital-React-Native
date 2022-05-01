import axios from "axios";

class SupportTicketsAPI {

    static baseEndpoint = "/api/v1/support-tickets"

    static list(callback) {
        axios.get(this.baseEndpoint).then(response => callback(response))
    }

    static retrieve(id, callback) {
        axios.get(`${this.baseEndpoint}/${id}`).then(response => callback(response))
    }

    static create(data, callback) {
        axios.post(this.baseEndpoint, data).then(response => callback(response))
    }

    static answer(data, callback) {
        axios.post(`${this.baseEndpoint}/answer`, data).then(response => callback(response))
    }
}

export default SupportTicketsAPI;
