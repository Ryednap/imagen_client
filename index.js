const yargs = require('yargs');
const inquirer = require('inquirer');
const colorette = require('colorette');


const command_parser = require('./command_parser');
const RegistrationApiService = require("./api/RegistrationApiService");
const HostApiService = require('./api/HostApiService');
const printer = require('./util/printer');


/**
 * Complete Question list to be inquired to user.
 * Used by inquirer's prompt method.
 *
 * @type {[
 * 		{name: string, type: string},
 * 		{name: string, type: string},
 * 		{name: string, type: string}
 * 	]}
 */
const full_question = [
	{
		type: 'input',
		name: 'username'
	},
	{
		type: 'email',
		name: 'email'
	},
	{
		type: 'password',
		name: 'password'
	}
];

// Part-Question only containing username and password to be inquired with user.
const question = [full_question[0], full_question[2]];

// Argument parsing with yargs

const args = yargs
	.command('register', 'To register for the service')
	.command('remove', 'To delete your account')
	.options('upload', {
		description: 'Upload the current file:- requires the location of the file',
		type: 'string'
	})
	.options('download', {
		description: 'Download the file:- requires the hosted url',
		type: 'string'
	})
	.options('ls', {
		description: 'List the hosted urls in your account also provide --h or --t flag'
	})
	.options('rm', {
		description: 'remove the file from serer: requires hosted url',
		type: 'string'
	})
	.options('head', {
		description: 'must be used after --ls flag with value of integer to specify the number of list to show from top\n' +
			colorette.cyan('example: --head 5 for top 5 result')
	})
	.options('tails', {
		description:  'must be used after --ls flag with value of integer to specify the number of list to show from bottom\n' +
			colorette.cyan('example: --tail 5 for bottom 5 result')
	})
	.options('filename', {
		description:  'must be used after --download flag with value of path with filename of downloaded image \n' +
			colorette.cyan('example: --download ./temp.png will download the file in current directory with filename temp.png')
	})
	.help()
	.alias('help', 'h')
	.argv;



// calls the command_parser module to parse the argument
const result = command_parser(args);

// ******** PROCESSING LOGIC **********

// If the command parsing failed
if (result == null) {
	process.exit(1);

	// If the returned type is string meaning the user has specified command
} else if (typeof result === 'string') {
	const flag = result === 'register';
	const question_to_be_asked =  flag ? full_question : question;

	inquirer.prompt(question_to_be_asked)
		.then(credentials => {
			if (flag) {
				RegistrationApiService.register(credentials).then(
					value => printer(201, value)
				);
			} else {
				RegistrationApiService.remove(credentials).then(
					value => printer(200, value)
				);
			}
		});

	// If the returned type is a list meaning user has specified one or more flag options
	/*
		The structure of return type is as follows
		[
			first-flag-name,
			first-flag-value,
			second-flag-name,
			second-flag-value,
			.....
		]

	 */
} else {
	// First two values of the array contains the first flag name and value
	const option = result[0]; // flag-name
	const value = result[1]; // flag-value

	// We branch here because download endpoint doesn't require credentials
	if (option === 'download') {
		// Note that download flag requires additional flag of the filename where the content will be downloaded
		const filename = result[3];
		if (typeof filename !== 'string' || filename.length === 0) {
			console.log('provided name must be a valid filename');
			process.exit(2);
		}
		HostApiService.download(value, filename)
			.then(result => {
				printer(200, result);
			});

		// All the below options require credentials of user
	} else {
		inquirer.prompt(question)
			.then(credentials => {
				if (option === 'upload') {
					HostApiService.upload(credentials, value)
						.then(result => {
							printer(201, result);
							process.exit(0);
						})


				} else if (option === 'ls') {
					// fromWhere is either 'head' or 'tails'
					// limit specifies the value of 'head' or 'tails'
					const fromWhere = result[2];
					const limit = parseInt(result[3]);


					if (isNaN(limit)) {
						console.log('second argument must be a number');
						process.exit(1);
					}

					HostApiService.list(credentials)
						.then(result => {
							if (result.status === 200) {
								console.log(colorette.greenBright(colorette.bold(200)));

								/*
									Start from top if fromWhere is head or from bottom
									increment is positive if from head or negative if from bottom.
								 */
								let start = fromWhere === 'head' ? 0 : result.data.length - 1;
								const update = fromWhere === 'head' ? 1 : -1;

								for (let _ = 0; _ < Math.min(limit, result.data.length); ++_) {
									const array = result.data[start];
									start = start + update;
									console.log(
										colorette.magentaBright('name: ') +
										colorette.yellowBright(array[0])
									);
									console.log(
										colorette.magentaBright('url: ') +
										colorette.yellowBright(array[1])
									);
									console.log(
										colorette.magentaBright('created: ') +
										colorette.yellowBright(array[2])
									);
									console.log('\n');
								}
							} else {
								printer(result.status, {status: result.status, data: 'Service Not available'})
							}
							process.exit(0);
						})
				} else if (option === 'rm') {
					HostApiService.remove(credentials, value)
						.then(result => {
							printer(200,
								{status: result.status, data: (200 === result.status ? 'Deleted' : 'Error removing file')}
							);
							process.exit(0);
						});
				}
			});
	}
}
