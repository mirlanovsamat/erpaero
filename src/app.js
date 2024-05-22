const cors = require('cors');
const express = require('express');
const env = require('env-var');
const path = require('path');

const middlewares = require('./core/middlewares');

const authRoutes = require('./auth/authRoute');
const fileRoutes = require('./file/fileRoute');

const app = express();
const port = env.get('PORT').required().asPortNumber();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'upload')));
app.use(cors());

app.use(authRoutes);
app.use(fileRoutes);

app.use(middlewares.errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
