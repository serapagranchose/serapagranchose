const fs = require('fs');
const Mustache = require('mustache');
const data = require('./assets/serapagranchose.json');

async function updateJSON() {
  console.log("Scraping datas...")
  const newData = data

  await fetch('https://api.github.com/users/serapagranchose/repos', { method: "Get" }).then(
    res => res.json()
    ).then((json) => {
      console.log("Sucessfully scrapped Github API datas.")
      console.log("Updating JSON projects section...")
    for (let index = 0; index < json.length; index++) {
      newData.projects[index] = {
        "name": json[index].name,
        "description": json[index].description,
        "highlights": [
        ],
        "language": json[index].language,
        "topics": [
          json[index].topics
        ],
        "keywords": [
          json[index].language,
          json[index].topics
        ],
        "startDate": json[index].created_at.substring(0, 10).replace(/T/, ' ').replace(/\..+/, ''),
        "updatedDate": json[index].updated_at.substring(0, 10).replace(/T/, ' ').replace(/\..+/, ''),
        "url": json[index].html_url,
        "roles": [
        ],
        "entity": "",
        "type": ""
      }      
      console.log("Project \"" + json[index].name + "\" updated.")
    }
    console.log("Writing data on JSON file.")
    fs.writeFile('src/assets/serapagranchose.json', JSON.stringify(newData, null, 2), function writeJSON(err) {
      if (err){
        console.error("Couldn't write data on JSON file:", err)
        return console.log(err);
      }
    });
  });
}

async function generateReadMe() {
  console.log("Generating README with json data")
  fs.readFile('src/assets/main.mustache', (err, dataRead) =>  {
    if (err) throw err;
    fs.writeFile('README.md', Mustache.render(dataRead.toString(), data),  function writeJSON(err) {
      if (err){
        console.error("Couldn't write data on README file:", err)
        return console.log(err);
      }
    });
  });
}

async function main() {
  await updateJSON();
  await generateReadMe();
}

main()
