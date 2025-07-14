// main.js
import { requireAuth, logout } from './auth.js';
import {
  loadNotes,
  handleNewNote,
  saveNote,
  deleteNote,
  shareNote
} from './notes.js';
import { applyTheme, toggleTheme } from './theme.js';

document.addEventListener("DOMContentLoaded", () => {
  const user = requireAuth();
  console.log("Usuario en sesión:", user); 

  document.getElementById("welcome-title").textContent = `Hola, ${user.name}`;

  // Botones
  document.getElementById("new-note-btn").addEventListener("click", handleNewNote);
  document.getElementById("back-home").addEventListener("click", () => {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById("home-view").classList.add("active");
  });

  document.getElementById("save-note-btn").addEventListener("click", saveNote);
  document.getElementById("delete-note-btn").addEventListener("click", deleteNote);
  document.getElementById("logout-btn").addEventListener("click", logout);
  document.getElementById("confirm-share-btn").addEventListener("click", shareNote);

  document.querySelectorAll("[data-tab]").forEach(tab => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
      e.target.classList.add("active");
      loadNotes(e.target.dataset.tab);
    });

    applyTheme();

    document.getElementById("theme-toggle").addEventListener("change", toggleTheme);

  });

  loadNotes();
});