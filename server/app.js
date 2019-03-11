const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://adamcuffe:zPBBnGp5dDNbJ3n@grahamportal-w2yk4.mongodb.net/test?retryWrites=true', { 
  useCreateIndex: true, 
  useNewUrlParser: true 
});

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/users', require('./routes/users'));
app.use('/projects', require('./routes/projects'));
app.use('/packages', require('./routes/packages'));
app.use('/roles', require('./routes/roles'));
app.use('/timesheets', require('./routes/timesheet'));
app.use('/emails', require('./routes/emails'));

module.exports = app;
