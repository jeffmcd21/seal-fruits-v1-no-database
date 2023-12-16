// import express
const express = require("express")
// import morgan
const morgan = require("morgan")
// import method override
const methodOverride = require("method-override")

// import our fruits
// require will return the value of module.exports
const fruits = require("./models/fruits.js")

// create our app object
const app = express()

// middleware
app.use(express.static("public")) // use a "public" folder for files
// public/style.css -> /style.css
// public/app.js -> /app.js
//express.urlencoded (parse url encoded bodies)
// add the data to req.body
app.use(express.urlencoded({extended: true}))
// morgan - will log data about each request for debugging
app.use(morgan("dev"))
// methodOverride - allows to override form post request
// as a different method like PUT or DELETE
// It will look for a _method url query
app.use(methodOverride("_method"))


// fruits index route
// get request to /fruits
// return all fruits
app.get("/fruits", (req, res) => {
    // res.send(fruits)
    // "index.ejs" => "./views/index.ejs"
    // {fruits} => {fruits:fruits}
    res.render("index.ejs", {fruits})
})


// New Route - Render a page with a form
// Get request to /fruits/new
// Allow us to have a form to create a new fruit
app.get("/fruits/new", (req, res) => {
    // Render a template with our form
    // new.ejs === ./views/ + new.ejs
    res.render("new.ejs")
})

// Create Route - Receives the form data, Create new fruit
// Post requet /fruits
// Create a fruit from the form data, then redirect back to index
app.post("/fruits", (req, res) => {
    // Get the form data from the request
    const body = req.body
    // Send back the form data as JSON
    //res.send(body)
    // conver the readyToEat to true or false
    if (body.readyToEat === "on") {
        body.readyToEat = true
    } else {
        body.readyToEat = false
    }
    
    // add the fruit to the array
    fruits.push(body)
    
    // redirect them back to index page
    res.redirect("/fruits")
})


// Destroy Route - Deletes a fruit
// Delete -> /fruits/:id
// Deletes a specified fruit, redirects to the index
app.delete("/fruits/:id", (req, res) => {
    // Get the id from params
    const id = req.params.id
    // Then we'll splice it from the array
    // arr.splice(index, numOfItemsToCut)
    fruits.splice(id, 1)
    // Redirect back to index
    res.redirect("/fruits")
})


// EDIT ROUTE - Render a Form to Edit a Specific Fruit
// GET to /fruits/:id/edit
// Render a Form with the existing values filled in
app.get("/fruits/:id/edit", (req, res) => {
    // get the id from params
    const id = req.params.id
    // get the fruit being updated
    const fruit = fruits[id]
    // send the id and fruit over to the template
    // edit.ejs -> ./views/edit.ejs
    res.render("edit.ejs",{fruit, id})
})


// UPDATE ROUTE - Receive the form data, updates the fruit
// PUT to /fruits/:id
// Update the specified fruit, then redirect to index
app.put("/fruits/:id", (req, res) => {
    // get the id
    const id = req.params.id
    // get the body
    const body = req.body
    // convert readyToEat to true or false
    if(body.readyToEat === "on"){
        body.readyToEat = true
    } else {
        body.readyToEat = false
    }
    // swap the old version with the new version
    fruits[id] = body
    // redirect back to the index page
    res.redirect("/fruits")
})


// SHOW Route - Fruits
// get request to /fruits/:id
// return a single fruit
app.get("/fruits/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    // get the fruit from the array
    const fruit = fruits[id]
    // send the fruit as the response
    // res.send(fruit)

    // render the show.ejs template
    // res.render(template, data)
    // for the template assume "/views/"
    // "show.ejs" =>  ./views/show.ejs
    res.render("show.ejs", {fruit, id})
    // {fruit} is the same as {fruit:fruit}
})

// server listener to turn our server
app.listen(3000, () => {
    console.log('listening on port 3000')
})