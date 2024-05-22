CREATE TABLE IF NOT EXISTS files(
  id int AUTO_INCREMENT PRIMARY KEY,
  filename varchar(255) NOT NULL,
  extension VARCHAR(50) NOT NULL,
  mime_type varchar(100) NOT NULL,
  size int NOT NULL,
  path varchar(255) NOT NULL,
  upload_date timestamp DEFAULT CURRENT_TIMESTAMP,
  user_id varchar(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

