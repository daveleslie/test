const Sentry = require('@sentry/node');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv === 'development';
if (!isDev) {
	console.log('Sentry initializing...');
	Sentry.init({
		dsn: 'https://da955d4da29b4243a9566cf6643365b4@o1365838.ingest.sentry.io/4504049113300992',
		environment: nodeEnv,
	});
}

// npm modules
const Mysql = require('mysql2');
const Request = require('request');
const fs = require('fs');
const relativePath = '../..';
const config = require(relativePath + '/insight.config.js');

// app setup
const app = {
	name: 'ww-ups-gen-fetch',
	path: __dirname,
	env: process.env.NODE_ENV || 'development',
	// eslint-disable-next-line
	config: config[process.env.NODE_ENV || 'development'],
	// eslint-disable-next-line
	log: require(relativePath + '/util/logger'),
	dbAdmin: null,
	dbAdminPool: null,
	dbData: null,
	dbDataPool: null,
	dbData3: null,
	dbDataPool3: null,
	mongo: null,
	phpAPI: null,

	throw: (status, msg) => {
		const error = new Error(msg);
		error.status = status;
		error.expose = true;
		throw error;
	},
};

// lock and track file paths
const lockFile = app.path + '/job.lock';
const trackFile = app.path + '/job-track.json';

// MySQL Pool
app.dbAdminPool = Mysql.createPool({
	host: app.config.dbAdmin.host,
	user: app.config.dbAdmin.user,
	password: app.config.dbAdmin.pass,
	waitForConnections: true,
	connectionLimit: 10,
});
app.dbAdmin = app.dbAdminPool.promise();

app.dbDataPool = Mysql.createPool({
	host: app.config.dbData.host,
	user: app.config.dbData.user,
	port: app.config.dbData.port,
	password: app.config.dbData.pass,
	waitForConnections: true,
	connectionLimit: 10,
});
app.dbData = app.dbDataPool.promise();

app.dbDataPool3 = Mysql.createPool({
	host: app.config.dbData3.host,
	user: app.config.dbData3.user,
	port: app.config.dbData3.port,
	password: app.config.dbData3.pass,
	waitForConnections: true,
	connectionLimit: 10,
});
app.dbData3 = app.dbDataPool3.promise();

// PHP API
app.phpAPI = require(relativePath + '/services/phpAPI')(
	app.config.phpAPI,
	app.log,
);

// load controllers and models
app.controls = require(relativePath + '/controls/index')(app);
app.models = require(relativePath + '/models/index')(app);

// startup hello
app.log('SYS', `ENV : ${app.env}`);

// fetch schedule
const schedule = require(trackFile);

// check lock file
const lock = fs.readFileSync(lockFile);

// process ups / generator
const schedulerProcess = async () => {
	// lock file
	// fs.writeFileSync(lockFile, 'true');
	const nowTime = Date.now();

	// app.log('UPS', '--------------------> START upsId > ' + schedule.upsId);

	// // fetch + load ups
	// const ups = await app.models.ups.selectForScheduler(schedule.upsId);
	// if (ups !== null) {
	// 	console.log(ups);

	// 	// call PHP API to fetch from WW
	// 	const resultWW = await app.phpAPI.get('/wwapi/wwapi_ups.php', {
	// 		upsIp: ups.upsUECIP,
	// 		upsHtmlVer: ups.upsHtmlVer,
	// 		upsTimestamp: ups.upsTimestamp,
	// 		/*genBasicId: ups.genBasicId,
	// 		genPowerId: ups.genPowerId,
	// 		genPhaseId: ups.genPhaseId,
	// 		genEventId: ups.genEventId*/
	// 	});

	// 	console.log('ups resultWW');
	// 	console.log(resultWW);

	// 	// insert to db
	// 	if (resultWW?.status === 200 && resultWW.hasOwnProperty('data')) {
	// 		const resultInsert = await app.models.ups.insertUpsDataEntryWW(
	// 			ups.upsId,
	// 			resultWW.data,
	// 			resultWW.error,
	// 		);
	// 		app.log('UPS', 'msg=' + resultInsert.msg);
	// 	} else {
	// 		app.log('UPS', 'msg=fail');
	// 	}

	// 	// scheduler next ups
	// 	schedule.upsId = ups.upsId;
	// } else {
	// 	// reset schedule
	// 	schedule.upsId = 0;
	// }

	// // setup scheduler for next ups
	// fs.writeFileSync(trackFile, JSON.stringify(schedule, null, '\t'));

	// app.log(
	// 	'UPS',
	// 	'--------------------> FINISH [' + (Date.now() - nowTime) + 'ms]',
	// );

	app.log(
		'GENERATORS',
		'--------------------> START genId > ' + schedule.genId,
	);

	// fetch + load ups
	const gen = await app.models.generators.selectForScheduler(schedule.genId);
	if (gen !== null) {
		// console.log(gen);

		const query = {
			upsIp: gen.genGatewayIP,
			upsHtmlVer: gen.genHtmlVer,
			upsTimestamp: gen.genTimestamp,
			genBasicId: gen.genBasicId,
			genPowerId: gen.genPowerId,
			genPhaseId: gen.genPhaseId,
			genEventId: gen.genEventId,
		};

		// call PHP API to fetch from WW
		const resultWW = await app.phpAPI.get('/wwapi/wwapi_ups.php', query);
		// console.log('gen resultWW');
		// console.log(resultWW);

		const toWrite = { gen, query, resultWW };

		fs.writeFileSync(
			app.path + `/log/gen-${gen.genId}-${Date.now()}.log`,
			JSON.stringify(toWrite, null, 2),
		);

		// insert to db
		if (resultWW?.status === 200 && resultWW.hasOwnProperty('data')) {
			const resultStatus =
				await app.models.generators.insertGeneratorDataEntryWW(
					gen.genId,
					resultWW.data,
					gen.genFuelProbeMissing,
				);
			app.log('GENERATORS', 'msg=' + resultStatus);
		} else {
			app.log('GENERATORS', 'msg=fail');
		}

		// scheduler next ups
		schedule.genId = gen.genId;
	} else {
		// reset schedule
		schedule.genId = 0;
	}

	// setup scheduler for next ups
	fs.writeFileSync(trackFile, JSON.stringify(schedule, null, '\t'));

	app.log(
		'GENERATORS',
		'--------------------> FINISH [' + (Date.now() - nowTime) + 'ms]',
	);

	process.exit();

	// unlock file
	setTimeout(() => {
		fs.writeFileSync(lockFile, 'false');
		process.exit(1);
	}, 600);
};

// end of program
process.on('SIGINT', function () {
	fs.writeFileSync(lockFile, 'false');
	process.exit(1);
});
process.on('SIGUSR1', function () {
	fs.writeFileSync(lockFile, 'false');
	process.exit(1);
});
process.on('SIGUSR2', function () {
	fs.writeFileSync(lockFile, 'false');
	process.exit(1);
});
process.on('uncaughtException', function (err) {
	fs.writeFileSync(lockFile, 'false');
	console.log(err);
	process.exit(1);
});

// run if not locked
if (lock.toString().substr(0, 5) === 'false') {
	schedulerProcess();
} else {
	app.log('SYS', 'job locked, goodbye!');
	setTimeout(() => {
		process.exit(1);
	}, 600);
}
