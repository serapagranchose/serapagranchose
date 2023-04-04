const fs = require('fs');
const Mustache = require('mustache');

const Data = './assets/serapagranchose.json';
const DataFile = require(Data);
const Template = './assets/main.mustache';

async function updateJSON() {
  console.log("Scraping datas...")
  await fetch('https://api.github.com/users/serapagranchose/repos', { method: "Get" }).then(
    res => res.json()
    ).then((json) => {
      console.log("Sucessfully scrapped Github API datas.")
      console.log("Updating JSON projects section...")
    for (let index = 0; index < json.length; index++) {
      DataFile.projects[index] = {
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
        "startDate": json[index].created_at,
        "endDate": "",
        "updatedDate": json[index].updated_at,
        "url": json[index].html_url,
        "roles": [
        ],
        "entity": "",
        "type": ""
      }      
      console.log("Project \"" + json[index].name + "\" updated.")
    }
    console.log("Writing data on JSON file.")
    fs.writeFile(Data , JSON.stringify(DataFile, null, 2), function writeJSON(err) {
      if (err){
        console.error("Couldn't write data on JSON file:", err)
        return console.log(err);
      }
    });
  });
}

async function generateReadMe() {
  console.log("Generating README with json data")
  await fs.readFile(Template, (err, data) =>  {
    if (err) throw err;
    fs.writeFileSync('README.md', Mustache.render(data.toString(), DataFile));
  });
}

async function main() {
    await updateJSON();
    await generateReadMe();
}

main()