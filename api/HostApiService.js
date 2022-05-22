/*
    Developer and Maintainer
    Ryednap(Ujjwal Pandey)
    05-22-2022
 */

const axios = require('axios').default;
const fs = require("fs");
const path = require("path");
const FormData = require('form-data')

const auth_generator = require('../util/auth_generator');

/**
 * Service Class to communicate with /api/v1/host endpoint.
 * All the exposed methods here are static.
 *
 * @type {HostApiService}
 */
module.exports = class HostApiService {

    /**
     *
     * Function to list the saved image in the user's workspace.
     * If successful returns list of list with following structure
     * [image_name, image_referenceUrl, created-date]
     *
     * @param {object} credentials - object containing user's username and password field
     * @returns {Promise<{data: any, status: number}>} - list of images in user's workspace or error string
     */
    static async list(credentials) {
        let response;
        try {
            response = await axios({
                method: 'GET',
                url: "https://imagen-heist.herokuapp.com/api/v1/host/",
                headers: {
                    'Authorization' : auth_generator(credentials.username, credentials.password),
                    'Connection' : 'keep-alive',
                },
                responseType: 'json'
            });
        } catch (error) {
            response = error.response;
        }

        let data = await response.data;
        const status = response.status;
        return {
            'status' : status,
            'data' : JSON.parse(JSON.stringify(data))
        };
    }

    /**
     * Function to upload the specified file to the server.
     *
     * @param {object} credentials - object containing username and password field
     * @param {string} filepath - fullPath of the file to be uploaded
     * @returns {Promise<{data: string, status: number}>} - returns referenceURL on success or string on server error.
     */
    static async upload(credentials, filepath) {
        if (!fs.existsSync(filepath)) {
            console.log('No Such file exists');
            process.exit(0);
        }

        // create form-data to push the imageFile as the server accepts RequestParameter of "image" field-name.
        const formData = new FormData();
        formData.append("image", fs.createReadStream(filepath), path.basename(filepath));

        let response;
        try {
            response = await axios({
                method: 'POST',
                url: "https://imagen-heist.herokuapp.com/api/v1/host/",
                headers: {
                    'Authorization' : auth_generator(credentials.username, credentials.password),
                    'Connection' : 'keep-alive',
                    ...formData.getHeaders()
                },
                data: formData
            });
        } catch (error) {
            response = error.response;
        }


        const data = await response.data;
        const status = response.status;

        return {
            'data' : JSON.parse(JSON.stringify(data)),
            'status' : status
        };
    }


    /**
     * Downloads the file from server into specified file provided as filename parameter.
     *
     * @param {string} referenceUrl - reference url of the image to be queried with server.
     * @param {string} filename - name of downloaded file to be kept in directory
     * @returns {Promise<{data: (string|string), status: number}>}
     */
    static async download(referenceUrl, filename) {


        if(typeof referenceUrl !== "string" || referenceUrl.length === 0) {
            console.log('Invalid or no reference url provided');
            process.exit(3);
        }

        let response;
        try {
            response = await axios({
                method: 'GET',
                url: referenceUrl,
                headers: {
                    'Connection': 'keep-alive',
                },
                responseType: 'stream'
            });

        } catch (e) {
            response = e.response;
        }

        const status = response.status;
        if (status === 200) {
            try {
                // create a pipe stream to transfer the byte array to file provided.

                const writer = fs.createWriteStream(filename);
                response.data.pipe(writer);
                writer.on('close', () => {
                    writer.close();
                })

            } catch (error) {
                console.log("No such directory exists or invalid filename");
                process.exit(2);
            }
        }

        return {
            'data' : status === 200 ? 'File has been downloaded to the location : ' + filename : 'Error retrieving file',
            'status' : status
        };
    }

    /**
     *
     * Function to remove the image pointing to the referenceUrl. Protected Endpoint
     * hence credentials must be specified {username, password}
     *
     * @param {object} credentials - credentials object containing username and password
     * @param {string} referenceUrl - referenceUrl for the image to be deleted on the server
     * @returns {Promise<{data: any, status: number}>}
     */
    static async remove(credentials, referenceUrl) {
        let response;
        try {
            response = await axios({
                method: 'DELETE',
                url: referenceUrl,
                headers: {
                    'Connection' : 'keep-alive',
                    'Authorization' : auth_generator(credentials.username, credentials.password)
                }
            });
        } catch (error) {
            response = error.response;
        }


        const data = await response.data;
        const status = response.status;

        return {
            'data' : data,
            'status' : status
        };
    }
}