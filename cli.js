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

const timezone = args.t || moment.tz.guess();

const lat = args.n || -1 * args.s

const lon = args.e || -1 * args.w
/*
if (isNaN(lat) && isNaN(lon)) {
    console.error("Missing parameters");
    process.exit(1);
} else */
/*
if (Math.abs(lat) > 90) {
    console.log("Latitud must be in range");
    process.exit(1);
} else if (Math.abs(lon) > 180) {
    console.log("Longitud must be in range");
    process.exit(1);
} */

if (isNaN(lat) && isNaN(lon) && args.j) {
    console.error();
    process.exit(1);
}

const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon.toFixed(2) + "&daily=precipitation_hours&timezone=" + timezone);

const data = await response.json();


if (args.j) {
    console.log(data);
    process.exit(0);
}
//test
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


