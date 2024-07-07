// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const sequelize = require('./config/database');
// const userRoutes = require('./routes/userRoutes');

import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import organizationRoute from './routes/organizationRoute.js'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', userRoutes);
app.use('/api', organizationRoute);

const PORT = process.env.PORT || 4000;

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.log(err));

    export default app
