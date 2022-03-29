const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("./public"));

app.use(express.json());
app.get("/images", (req, res) => {
    db.getAllImages()
        .then(({ rows: images }) => {
            res.json(images);
        })
        .catch(() => {
            res.sendStatus(500);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
