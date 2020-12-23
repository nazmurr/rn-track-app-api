//start db cmd: /Users/nazmur21/mongodb/bin/mongod --dbpath=/Users/nazmur21/mongodb-data
require('./models/User');
require('./models/Track');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');

const port = process.env.PORT;

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('connected to mongo instance');
});

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to mongo', err);
});

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

app.get('/', requireAuth, (req, res) => {
    res.send('hi');
});

app.listen(port, () => {
    console.log('listening on port ' + port);
});