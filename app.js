require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./Routes/Auth');
const taskRoutes = require('./Routes/tasks');

const app = express();
const PORT = process.env.PORT || 2001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(morgan('dev'));

if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not set in the environment variables.');
    process.exit(1); 
}

if (!process.env.SESSION_SECRET) {
    console.error('Error: SESSION_SECRET is not set in the environment variables.');
    process.exit(1); 
}

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
    })
);


app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
  }))
  .catch(err => console.error('Database connection error:', err));
