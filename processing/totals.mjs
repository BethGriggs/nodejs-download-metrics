/* eslint-disable no-console */
import { fetch } from 'undici';
import { readFileSync, appendFileSync } from 'fs';

// Google Storage Location for Node.js download metrics
const DOWNLOAD_LOCATION = 'https://storage.googleapis.com/access-logs-summaries-nodejs/';

// Return YYYY-MM-DD string
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

async function getDownloadsByDate(date) {
  const dateString = formatDate(date);

  try {
    const logFile = `${DOWNLOAD_LOCATION}nodejs.org-access.log.${dateString.replace(/-/g, '')}.json`;
    const res = await fetch(logFile);
    const json = await res.json();

    return {
      total: json.total,
    };
  } catch (e) {
    console.log(`Error fetching ${dateString}`);
    return 'No Data';
  }
}

// Returns the date of the last entry in the total.csv file
function getDateOfLastEntry() {
  const totalSummary = readFileSync('./summaries/total.csv', 'utf8');
  const entries = totalSummary.toString().split('\n');
  const lastEntry = entries.pop();
  const lastDate = lastEntry.split(',')[0];
  return new Date(lastDate);
}

// Returns the next date after the given date
function getNextDate(date) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate;
}

function getTotalCSV(newEntries) {
  let toAppend = '';
  Object.keys(newEntries).forEach((entry) => {
    toAppend += `\n${entry},${newEntries[entry].total}`;
  });
  return toAppend;
}

async function updateTotalSummary() {
  const lastDate = getDateOfLastEntry();
  console.log(`Last date: ${lastDate}`);
  const nextDateToCheck = new Date(lastDate.setDate(lastDate.getDate() + 1));
  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));
  console.log(`Yesterday: ${yesterday}`);

  const newEntries = {};

  for (let date = nextDateToCheck; date <= yesterday; date = getNextDate(date)) {
    /* eslint-disable no-await-in-loop */
    const downloads = await getDownloadsByDate(date);
    console.log(`${date.toISOString().split('T')[0]} has ${downloads.total} downloads`);
    newEntries[date.toISOString().split('T')[0]] = downloads;
  }

  appendFileSync('./summaries/total.csv', getTotalCSV(newEntries));
}

updateTotalSummary();
