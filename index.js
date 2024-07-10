import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = new express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Practice ToDoList",
    password: "Sandeep@123",
    port: 5433
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let items = [];

// db.query("SELECT * FROM items", (err, res) => {
//     if(err) {
//         console.log("Error occurred", err);
//     } else {
//         // console.log(res);
//         items = res.rows;
//         // console.log(items);
//     }
// });

//we can simply write the above code 
//look the 1st line in app.get broo

app.get("/", async(req, res) => {
    const result = await db.query("SELECT * FROM items ORDER BY id");
    items = result.rows;
    res.render("index.ejs", {
        listTitle: "Today",
        listItems: items
    });
});

app.post("/add", async(req, res) => {
    const theItem = req.body["newItem"];
    try {
        await db.query("INSERT INTO items (title) VALUES ($1)", [theItem]);
    } catch(err) {
        console.log(err);
    }
    res.redirect("/");
});

app.post("/delete", async(req, res) => {
    const theId = req.body.deletedItemId;
    try {
        await db.query("DELETE FROM items WHERE id = $1", [theId]);
    } catch(err) {
        console.log(err);
    }
    res.redirect("/");
});

app.post("/edit", async(req, res) => {
    const updatedItemId = req.body.updatedItemId;
    // console.log(updatedItemId);
    const updatedItemTitle = req.body.updatedItemTitle;
    console.log(updatedItemTitle);
    try {
        await db.query("UPDATE items SET title = ($1) WHERE id = ($2)", [updatedItemTitle, updatedItemId])
    } catch(err) {
        console.log(err);
    }
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});