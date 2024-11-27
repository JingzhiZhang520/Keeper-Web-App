import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios"; // Axios for API calls

function App() {
  const [notes, setNotes] = useState([]);

  // Fetch notes from the backend
  useEffect(() => {
    axios.get("http://localhost:3000/notes") // Use backend API
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  }, []);

  // Add a new note
  function addNote(newNote) {
    axios.post("http://localhost:3000/notes", newNote)
      .then((response) => {
        setNotes((prevNotes) => [...prevNotes, response.data]);
      })
      .catch((error) => {
        console.error("Error adding note:", error);
      });
  }

  // Delete a note
  function deleteNote(id) {
    axios.delete(`http://localhost:3000/notes/${id}`)
      .then(() => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          title={note.title}
          content={note.content}
          onDelete={deleteNote}
        />
      ))}
      <Footer />
    </div>
  );
}

export default App;