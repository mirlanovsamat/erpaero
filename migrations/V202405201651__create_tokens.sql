CREATE TABLE IF NOT EXISTS tokens(
  id int AUTO_INCREMENT PRIMARY KEY,
  user_id varchar(255) NOT NULL,
  token varchar(255) NOT NULL,
  fingerprint varchar(255) NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  expires_at timestamp NOT NULL,
  blocked_at timestamp DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS blacklist_tokens(
  id int AUTO_INCREMENT PRIMARY KEY,
  user_id varchar(255) NOT NULL,
  fingerprint varchar(255) NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

