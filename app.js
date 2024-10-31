
/******************************************************************************
***
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Aayush Gautam Student ID: N01704876 Date: 2024-10-30
*
*
******************************************************************************
**/
const express = require("express"); // Import the Express framework
const path = require("path");// Import Node's path module for file and directory paths
const { engine } = require("express-handlebars");// Import the Handlebars engine for templating


const movieData = require("./movie-dataset-a2-.json"); // Load JSON data for movies

const port = process.env.PORT || 3000;// Define the port, using environment variable or defaulting to 3000

const app = express();// Create an instance of an Express application

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views',path.join(__dirname,'/views'));

// Register a custom Handlebars helper
app.engine("hbs", engine({
    extname: ".hbs",
    helpers: {
        highlightBlankWebsite: function(website){
            return !website || website.toLowerCase() === 'n/a' ? 'highlight' : ';'
        },
        ifNotEmpty: function(value, options) {
            if (value && value.trim() !== "") {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        isBlankOrNA: function(website) {
            return !website || website.toLowerCase() === 'n/a';
        }
    }
}));

//Handlebars
app.set("view engine", "hbs");

//Home Page
app.get("/", (req, res) => {
    res.render("index", { title: "Home Page" });
});

//viewData Route
app.get("/viewAllMovies", (req, res) => {
    res.render("viewAllMovies", { movies: movieData, title: "Movie Data Information" });
});

// Route for viewing filtered movies with non-empty websites
app.get("/viewData", (req, res) => {
    res.render("viewData", { title: "Filtered Movie Data", movies: movieData });
});

//Search By Id route
app.get("/data/search/id", (req, res) => {
    res.render("searchById", { title: "Search Movie by Id" });
});

app.post("/data/search/id", (req, res) => {
    const movieId = parseInt(req.body.movie_id);
    const movie = movieData.find((m) => m.Movie_ID === movieId);

    if (movie) {
        res.render("movieDetails", { movie });
    } else {
        res.status(404).render("error", { message: `Movie with ID ${movieId} not found` });
    }
});


//Search By Title route
app.get("/data/search/title", (req, res) => {
    res.render("searchByTitle", { title: "Search Movies by Title" });
});

app.post("/data/search/title", (req, res) => {
    const searchTitle = req.body.movie_title.toLowerCase();
    const matchingMovies = movieData.filter((m) => m.Title.toLowerCase().includes(searchTitle));

    if (matchingMovies.length > 0) {
        res.render("movieList", { movies: matchingMovies });
    } else {
        res.status(404).render("error", { message: `No movies found with the title "${req.body.movie_title}".` });
    }
});

//Search Invoice route
app.get("/search/invoiceNo", (req, res) => {
    res.render("invoiceSearch", { title: "Search by Invoice Number" });
});

app.post("/search/invoiceNo", (req, res) => {
    const invoiceNo = req.body.invoiceNo; // Assuming invoiceNo is a string 
    const invoice = movieData.find((entry) => entry.invoiceNo === invoiceNo);


    if (invoiceNo) { // Simple condition, replace with actual check
        res.render("invoiceDetails", { invoice, title: "Invoice Details" });
    } else {
        // If not found, render an error page with a message
        res.status(404).render("error", { message: `Invoice with number ${invoiceNo} not found`, title: "Error" });
    }
});

//Error handler
app.get("*", (req, res) => {
    res.status(404).render("error", { title: "Error", message: "Wrong Route, search not found" });
});

//Execution in Port 3000
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
