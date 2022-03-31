const express = require("express");
const app = express();
const db = require("./db");
const { uploader } = require("./upload");
const s3 = require("./s3");

app.use(express.static("./public"));

app.use(express.json());
app.get("/images", (req, res) => {
    db.getAllImages()
        .then(({ rows: images }) => {
            console.log({ images });
            res.json(images);
        })
        .catch(() => {
            res.sendStatus(500);
        });
});
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("the body", req.body);
    console.log("the file", req.file);
    console.log(`https://s3.amazonaws.com/spicedling/${req.file.filename}`);
    if (req.file) {
        db.insertImage(
            `https://s3.amazonaws.com/spicedling/${req.file.filename}`,
            req.body.title,
            req.body.username,
            req.body.description
        )
            .then(({ rows }) => {
                console.log(rows);
                res.json({ success: true, image: rows[0] });
            })
            .catch(() => {
                res.sendStatus(500);
            });
    } else {
        res.json({ success: false });
    }
});
app.get("/image/:imageId", (req, res) => {
    if (isNaN(req.params.imageId)) {
        return res.json({ success: false, message: "no valid input" });
    }
    db.getDataFromImage(req.params.imageId)
        .then((result) => {
            if (!result.rows[0]) {
                return res.json({ success: false, message: "no valid id" });
            }
            res.json({ success: true, image: result.rows[0] });
        })
        .catch(() => {
            res.json({ success: false });
        });
});
app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
