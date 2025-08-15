const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json()); // untuk JSON body
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const fieldRoutes = require('./routes/fields');
app.use('/api/fields', fieldRoutes);


app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});
