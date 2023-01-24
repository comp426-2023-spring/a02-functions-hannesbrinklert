#!/usr/bin/env node

import minimist from "minimist";

import moment from "moment-timezone";

import fetch from 'node-fetch';

const args = minimist(process.argv.slice(2));

if (args.h) {
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`);
    process.exit(0);
}

const timezone = args.z || moment.tz.guess();

const lat = Math.abs(args.n) || -1 * Math.abs(args.s)

const lon = Math.abs(args.e) || -1 * Math.abs(args.w)

if (isNaN(lat) && isNaN(lon)) {
    console.error("Missing parameters");
    process.exit(1);
} else if (Math.abs(lat) > 180) {
    console.log("Latitud must be in range");
    process.exit(1);
} else if (Math.abs(lon) > 180) {
    console.log("Longitud must be in range");
    process.exit(1);
}

const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${lon.toFixed(2)}&daily=precipitation_hours&timezone=${timezone}`);

const data = await response.json();

if (isNaN(lat) && isNaN(lon) && args.j) {
    console.error();
    process.exit(1);
}

if (args.j) {
    console.log(data);
    process.exit(0);
}

const days = args.d || 1;

let str = "";

if (data.daily.precipitation_hours[days] > 0) {
    str = "You might need your galoshes ";
} else {
    str = "You will not need your galoshes ";
}

if (days == 0) {
    console.log(str + "today.")
} else if (days > 1) {
    console.log(str + "in " + days + " days.")
} else {
    console.log(str + "tomorrow.")
}


