const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();

const allNotes = require("./db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// notes should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.json(JSON.parse(data));
  });
});

//function to create new note
// used uuidv4 to create unique id for each note
//  https://www.npmjs.com/package/uuid
function createNewNote(body, notesArray) {
  const newNote = {
    ...body,
    id: uuidv4(),
  };
  notesArray.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesArray, null, 2)
  );
  return newNote;
}

// notes should receive a new note to save on the request body,

app.post("/api/notes", (req, res) => {
  //add note to json file and notes array in this function
  const newNote = createNewNote(req.body, allNotes);
  res.json(newNote);
});

// function to delete notes
function deleteNote(id, notesArray) {
  const deletedNote = notesArray.filter((note) => note.id !== id);
  fs.writeFile(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(deletedNote, null, 2)
  );
  return deletedNote;
}

//notes/should receive a query parameter containing the id of a note to delete.
app.delete("/api/notes/:id", (req, res) => {
  //remove note from json file and notes array in this function
  const deletedNote = deleteNote(req.params.id, allNotes);
  res.json(deletedNote);
});

// "get" /notes should return the notes.html file.
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// "get *" should return the index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
