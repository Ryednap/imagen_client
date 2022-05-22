const colorette = require('colorette');

/**
 *
 */
module.exports = function consoleOutput(status, value) {
    if(value.status === 401 || value.status === 403) {
        console.log(
            colorette.redBright(colorette.bold(`${value.status} : `) + colorette.yellowBright("Invalid Username or password"))
        );
    }
    else if (value.status === status) {
        console.log(
            colorette.greenBright(colorette.bold(`${status} : `)) + colorette.yellowBright(value.data)
        )
    } else {
        console.log(
            colorette.redBright(colorette.bold(value.status)) + " : " + colorette.yellowBright(value.data)
        );
    }
}
