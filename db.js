const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);
exports.getAllImages = () => {
    return db.query(`SELECT id, url, title 
                    FROM 
                    images ORDER BY id DESC LIMIT 3;`);
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
    // return db.query(`SELECT * FROM images WHERE id=$1;`, [imageId]);
    return db.query(
        `SELECT *,
        (SELECT id FROM images WHERE id > $1 ORDER BY id ASC LIMIT 1) AS nextId,
        (SELECT id FROM images WHERE id < $1 ORDER BY id DESC LIMIT 1) AS prevId 
        FROM images 
        WHERE id = $1;`,
        [imageId]
    );
};

exports.getMoreImages = (lastId) => {
    return db.query(
        `SELECT id, url, title, 
        (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS "lowestId" 
        FROM images 
        WHERE id < $1 
        ORDER BY id DESC 
        LIMIT 3;`,
        [lastId]
    );
};
exports.addCommentForImage = (imageId, username, comment) => {
    return db.query(
        `INSERT INTO comments (image_id, username, comment) 
                    VALUES ($1, $2, $3) 
                    RETURNING *`,
        [imageId, username, comment]
    );
};
exports.getCommentsForImage = (imageId) => {
    return db.query(
        `SELECT id, username, comment, created_at FROM comments where image_id = $1 ORDER BY created_at DESC;`,
        [imageId]
    );
};
