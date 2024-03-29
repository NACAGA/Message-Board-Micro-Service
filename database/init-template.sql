CREATE TABLE Groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE GroupMembers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES Groups(id)
);

CREATE TABLE Posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES Groups(id)
);

CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(id)
);

CREATE TABLE Likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    media_type ENUM('POST', 'COMMENT') NOT NULL,
    media_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Groups (name, description) VALUES ('General', 'General discussion group');
INSERT INTO GroupMembers (group_id, user_id) VALUES (1, 1);
INSERT INTO GroupMembers (group_id, user_id) VALUES (1, 2);
INSERT INTO Posts (group_id, user_id, content) VALUES (1, 1, 'Hello, World!');
INSERT INTO Posts (group_id, user_id, content) VALUES (1, 1, 'A second post by the same user!');
INSERT INTO Likes (media_type, media_id, user_id) VALUES ('POST', 1, 1);
INSERT INTO Likes (media_type, media_id, user_id) VALUES ('POST', 2, 1);
