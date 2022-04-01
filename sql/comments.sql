DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    image_id INTEGER NOT NULL REFERENCES images(id),
    username VARCHAR(255) NOT NULL CHECK (username != ''),
    comment TEXT NOT NULL CHECK (comment != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO comments (image_id, username, comment) VALUES (
    11,
    'Will',
    'Nice'
);

INSERT INTO comments (image_id, username, comment) VALUES (
    11,
    'John',
    'Cool'
);
INSERT INTO comments (image_id, username, comment) VALUES (
    10,
    'Chris',
    'Rock'
);