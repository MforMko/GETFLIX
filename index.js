const express = require('express'),
morgan = require('morgan'), 
fs = require('fs'), 
path = require('path');

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

const topMovies = [
    { title: "The Shawshank Redemption", director: "Frank Darabont" },
    { title: "The Godfather", director: "Francis Ford Coppola" },
    { title: "The Dark Knight", director: "Christopher Nolan" },
    { title: "Pulp Fiction", director: "Quentin Tarantino" },
    { title: "Schindler's List", director: "Steven Spielberg" },
    { title: "The Lord of the Rings: The Return of the King", director: "Peter Jackson" },
    { title: "Fight Club", director: "David Fincher" },
    { title: "Forrest Gump", director: "Robert Zemeckis" },
    { title: "Inception", director: "Christopher Nolan" },
    { title: "The Matrix", director: "The Wachowskis" }
];



app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to my movies app....GETFLIX!');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('The movie app has loaded and is listening on port 8080');
});