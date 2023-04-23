const fs = require('fs');
const Mustache = require('mustache');
const data = require('./assets/resume.json');

async function fetchGistJson() {
  console.log("Fetching resume Gist")

  await fetch('https://api.github.com/gists/bc9b8dd8959b352699aa258a7924b729')
  .then(results => {
    return results.json();
  })
  .then(data => {
    console.log("Getting data from resume.json")
    gistData = data.files["resume.json"].content;
  });

  return gistData
}

async function updateLocalJson(data) {
  console.log("Updating local resume.json file")

  fs.writeFile('./src/assets/resume.json', data,  function writeJSON(err) {
    if (err){
      console.error("Couldn't write data on json file:", err)
      return console.log(err);
    }
  });
}

async function fetchGithubApiData() {
  console.log("Fetching Github Api Data")

  await fetch('https://api.github.com/users/serapagranchose/repos', { method: "Get" }).then(
    res => {
      githubApiData = res.json()
    }
  );
  return githubApiData
}

async function mergeGhGistData(json) {
  console.log("Updating Gist with Github Api Data")

  mergeData = data

  for (let index = 0; index < json.length; index++) {
    if (json[index].language && !json[index].topics.some(elem => elem.toLowerCase() === json[index].language.toLowerCase()))
      json[index].topics.push(json[index].language.toLowerCase())
    mergeData.projects[index] = {
      "name": json[index].name,
      "description": json[index].description,
      "language": json[index].language,
      "topics": json[index].topics,
      "keywords": json[index].topics,
      "startDate": json[index].created_at.substring(0, 10),
      "updatedDate": json[index].updated_at.substring(0, 10),
      "url": json[index].html_url,
    }
    console.log("Getting data from \"" + json[index].name + "\" project")
  }

  return JSON.stringify(mergeData, null, 2)
}

async function generateReadMe() {
  console.log("Generating ReadMe file with Gist Data")

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
  updateLocalJson(await fetchGistJson());
  updateLocalJson(await mergeGhGistData(await fetchGithubApiData()));

  await generateReadMe();
}

main()
