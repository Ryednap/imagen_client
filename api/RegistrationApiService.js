/**
 * Developer and Maintainer
 * @author Ryednap (Ujjwal Pandey)
 * @created-at 03-22-2022
 */

const axios = require('axios').default;
const auth_generator = require('../util/auth_generator');

/**
 * Service class to provide api service concerning the registration and removal of user from the core-server.
 * Each and every method exposed by this service is static.
 */
module.exports = class RegistrationApiService {

    /**
     * Create POST request to register the user to the server
     *
     * @param {object} credentials - credentials object containing username, password and email field (username and email must be unique
     * @returns {Promise<{data: JSON, status: number}>} - object containing the status code and the JSON parsed data
     */
    static async register(credentials) {

        // generate payload of the credentials
        const payload = JSON.stringify(credentials);

        const response = await axios({
            method: "POST",
            url : "https://imagen-heist.herokuapp.com/api/register/",
            data : payload,
            headers : {
                'Connection' : 'keep-alive',
                'Content-Type' : 'application/json'
            }
        });

        const data = await response.data;
        const status = response.status;
        return {
            'data' : JSON.parse(JSON.stringify(data)),
            'status' : status
        };
    }

    /**
     * Creates DELETE request to remove the user from the server.
     * Note: this endpoint is protected hence the api call requires strict credentials
     *
     * @param {object} credentials - credentials object containing username and password field
     * @returns {Promise<{data: JSON, status: number}>} - object containing the status code and the JSON parsed data
     */

    static async remove(credentials) {

        const response = await axios({
            method: 'DELETE',
            url: "https://imagen-heist.herokuapp.com/api/register/?username=" + credentials.username,
            headers : {
                // call the auth_generator to provide base64 encode to generate basic auth string
                'Authorization' : auth_generator(credentials.username, credentials.password),
                'Content-Type' : 'application/json',
                'Connection' : 'keep-alive'
            }
        });
        const data = await response.data;
        const status = response.status;

        return {
            'data' : JSON.parse(JSON.stringify(data)),
            'status' : status
        };
    }
}