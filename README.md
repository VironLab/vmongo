# vmongo

`npm install --save vmongo`

[![License](https://img.shields.io/github/license/VironLab/jsondatabase.js)](LICENSE.txt)
[![Discord](https://img.shields.io/discord/785956343407181824.svg)](https://discord.gg/wvcX92VyEH)

---

vmongo is a simple and easy to use nodejs mongodb wrapper

---

### Example Usage

```js
const { VMongoDriver } = require('vmongo');
const connectionString = `mongodb://user:password@localhost:27017/admin`;

const dbHandler = new VMongoDriver(connectionString);
// or
dbHandler = VMongoDriver.simple('user', 'password', 'localhost', 27017, 'admin');

dbHandler.query(
    'database',
    'collection',
    {
        username: 'depascaldc',
    },
    (err, res) => {
        if (err) return console.error(err);
        if (!res[0]) return console.log('No Objects found in Result...');
        console.log(res);
    },
);

dbHandler
    .queryAsync('database', 'collection', {
        username: 'depascaldc',
    })
    .then((res) => {
        if (!res[0]) return console.log('No Objects found in Result...');
        console.log(res);
    })
    .catch((err) => {
        console.error(err);
    });
```

---

### Discord

<div align="center">
    <h1 style="color:#154444">Other Links:</h1>
    <a style="color:#00ff00" target="_blank" href="https://discord.gg/wvcX92VyEH"><img src="https://img.shields.io/discord/785956343407181824?label=vironlab.eu%20Discord&logo=Discord&logoColor=%23ffffff&style=flat-square"></img></a>
</div>
