const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

module.exports = (app) => {
  fs.readFile("notes.json", "utf8", (err, data) => {
    if (err) throw err;

    var notes = JSON.parse(data);

    app.get("/api/notes", function (req, res) {
      res.json(notes);
    });

    app.post("/api/notes", function (req, res) {
      let newNote = req.body;
      newNote.id = uuidv4();
      notes.push(newNote);
      updateDb();
      console.log("Added new note: " + newNote.title);
      return res.json(newNote);
    });

    app.delete("/api/notes/:id", function (req, res) {
      for (i = 0; i < notes.length; i++) {
        if (req.params.id === notes[i].id) {
          notes.splice(i, 1);
        }
      }
      updateDb();
      console.log("Deleted note with id " + req.params.id);
      res.json(notes);
    });

    app.get("/notes", function (req, res) {
      res.sendFile(path.join(__dirname, "../../notes.html"));
    });

    app.get("*", function (req, res) {
      res.sendFile(path.join(__dirname, "../../index.html"));
    });

    function updateDb() {
      fs.writeFile("notes.json", JSON.stringify(notes, "\t"), (err) => {
        if (err) throw err;
        return true;
      });
    }
  });
};
