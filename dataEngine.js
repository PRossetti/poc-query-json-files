const fs = require('fs').promises;
const path = require('path');
const jsonQuery = require('json-query');

const filesDir = path.join(__dirname, 'files');

let data = { items: [] };

(async () => {
  try {
    const filesList = await fs.readdir(filesDir);
    console.table(filesList);

    const filePromises = filesList.map((fileName) => {
      const filePath = path.join(filesDir, fileName);
      return fs.readFile(filePath);
    });

    const streamDataList = await Promise.all(filePromises);
    data = streamDataList.reduce((itemsAcc, streamData) => {
      const jsonData = JSON.parse(streamData.toString());
      const items = [...itemsAcc.items, ...jsonData.items];
      return { items };
    }, data);

    console.log(`${data.items.length} records load in memory ready to be query`);
  } catch (err) {
    console.error('sorry, something wrong happened, no records processed.', err);
  }
})();

const queryData = (params) => {
  const queryString = Object.entries(params).reduce((acc, [key, value]) => {
    return `items[*${key}=${value}]`;
  }, '');
  console.log('query strig', queryString);
  const result = jsonQuery(queryString, { data });
  return result.value;
};

module.exports = { queryData };
