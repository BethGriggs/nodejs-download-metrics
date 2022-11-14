/* eslint-disable no-console */
import { fetch } from 'undici';

// Google Storage Location for Node.js download metrics
const DOWNLOAD_LOCATION = 'https://storage.googleapis.com/access-logs-summaries-nodejs/';

// Date to collect data for
const DATE = process.argv[2];

function getTotalsByVersion(versions) {
  const majorVersions = {
      'v0': 0,
      'v4': 0,
      'v5': 0,
      'v6': 0,
      'v7': 0,
      'v8': 0,
      'v9': 0,
      'v10': 0,
      'v11': 0,
      'v12': 0,
      'v13': 0,
      'v14': 0,
      'v15': 0,
      'v16': 0,
      'v17': 0,
      'v18': 0, 
      'v19': 0,
  }

  for (let version of Object.keys(versions)) {   
      let majorVersion = version.split('.')[0];
      if (Object.keys(majorVersions).includes(majorVersion)) {
          majorVersions[majorVersion] += versions[version];
      }
  }
  return majorVersions;
}

async function getDownloadsByDate(date) {
  try {
    const logFile = `${DOWNLOAD_LOCATION}nodejs.org-access.log.${DATE.replace(/-/g, '')}.json`;
    const res = await fetch(logFile);
    const json = await res.json();

    console.log(`${DATE} has ${json.total} downloads:`);
    const totalsByVersion = getTotalsByVersion(json.version);
    console.log(totalsByVersion);

  } catch (e) {
    console.log(`Error fetching ${DATE}`);
    return 'No Data';
  }
}

getDownloadsByDate(DATE);