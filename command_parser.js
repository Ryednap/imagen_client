
const {
    MULTIPLE_COMMANDS_ERROR,
    COMMAND_WITH_FLAG_ERROR,
    UNKNOWN_COMMAND_ERROR,
    MULTIPLE_FLAGS_ERROR,
    UNKNOWN_FLAG_ERROR, NO_ARGS_ERROR, EXTRA_REQ_FLAG
} = require("./util/error");


/**
 * Function to validate and parse the passed command line arguments
 *
 * @param args {object} - command line argument parsed by yargs module
 * @returns {null|*[]|*}
 */

const command_parser = function (args) {

    // commands without flags are specified in '_' field by yargs
    const commands_list = args['_'];

    // flags are stored as key:value pair in the args object.
    // there are two garbage keys '_' and '$0' and these have been avoided
    // rest are stored in options_list as list of [key, value]
    const options_list = [];
    for (const [key, value] of Object.entries(args)) {
        if (key === '_' || key === '$0') continue;
        options_list.push([key, value]);
    }

    // ******* LOGIC FLOW ********
    /*
        Requirement:
            Only one command must be provided without any flags. Accepted commands : [register, remove].
            Flags such as 'rm' and 'upload' required no other consecutive flag.
            Flags such as 'ls' and 'download' required one extra other flag.
            Anything other than provided above is an ERROR and specified error.js file
     */

    // multiple commands provided
    if (commands_list.length > 1) {
        console.log(MULTIPLE_COMMANDS_ERROR);

      // valid number of commands arguments
    } else if(commands_list.length === 1) {

        // flags provided with command
        if(options_list.length) {
            console.log(COMMAND_WITH_FLAG_ERROR);
        } else {
            const command = commands_list[0];
            if (command !== 'register' && command !== 'remove') {
                console.log(UNKNOWN_COMMAND_ERROR);
                return null;
            }
            return command;
        }

        // no commands in the argument. Now check if options are provided are not
    } else {

        if (options_list.length === 0) {
            console.log(NO_ARGS_ERROR);
            return null;
        }


        if (options_list[0][0] === 'download' || options_list[0][0] === 'ls') {
            // Extra flag is required
            if (options_list.length !== 2) {
                console.log(EXTRA_REQ_FLAG);
                return null;
            }

            // here we will verify the compatibility the second flag provided with the first flag
            if (options_list[0][0] === 'ls') {
                if (options_list[1][0] !== 'head' && options_list[1][0] !== 'tails') {
                    console.log(UNKNOWN_FLAG_ERROR + ` ${options_list[1][0]} required --head or --tails`);
                    return null;
                }

            } else if (options_list[0[0] === 'download']) {
                if (options_list[1][0] !== 'filename') {
                    console.log(UNKNOWN_FLAG_ERROR + ` ${options_list[1][0]} required --filename`);
                    return null;
                }
            }

            return [
                options_list[0][0], // first key
                options_list[0][1], // first value
                options_list[1][0], // second key
                options_list[1][1], // second value
            ]

        } else if (options_list[0][0] === 'rm' || options_list[0][0] === 'upload') {
            if (options_list.length !== 1) {
                console.log(MULTIPLE_FLAGS_ERROR);
                return null;
            }
            return [
                options_list[0][0],
                options_list[0][1]
            ];
        } else {
            console.log(UNKNOWN_FLAG_ERROR);
        }
    }
}

module.exports = command_parser;