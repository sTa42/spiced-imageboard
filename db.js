const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);
exports.getAllImages = () => {
    return db.query(`SELECT * 
                    FROM 
                    images ORDER BY id DESC;`);
};
exports.insertImage = (url, title, username, description) => {
    return db.query(
        `INSERT INTO images (url, title, username, description) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;`,
        [url, title, username, description]
    );
};
exports.getDataFromImage = (imageId) => {
    return db.query(`SELECT * FROM images WHERE id=$1;`, [imageId]);
};
