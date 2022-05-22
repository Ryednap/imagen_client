const MULTIPLE_COMMANDS_ERROR = "Multiple commands can't be parsed\n" + "interface only accepts singleton command or args use -h flag for help";
const COMMAND_WITH_FLAG_ERROR = "Commands don't require flags use -h flag for help";
const MULTIPLE_FLAGS_ERROR = "interface ony requires single flag use -h flag for help";
const UNKNOWN_FLAG_ERROR = "Unknown flag passed use -h flag for help";
const UNKNOWN_COMMAND_ERROR = "Unknown command passed use -h flag for help";
const NO_ARGS_ERROR = "No Argument specified use -h flag for help";
const EXTRA_REQ_FLAG = "Extra flag must be specified with the given previous flag use -h flag for help"

module.exports = {
    MULTIPLE_COMMANDS_ERROR,
    COMMAND_WITH_FLAG_ERROR,
    MULTIPLE_FLAGS_ERROR,
    UNKNOWN_FLAG_ERROR,
    UNKNOWN_COMMAND_ERROR,
    NO_ARGS_ERROR,
    EXTRA_REQ_FLAG
};