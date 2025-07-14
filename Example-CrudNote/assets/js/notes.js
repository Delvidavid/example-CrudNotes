// notes.js
import { getCurrentUser } from './auth.js';

const apiNotes = "http://localhost:3000/notes";
const apiUsers = "http://localhost:3000/user";
const apiShared = "http://localhost:3000/sharedNotes";

export async function loadNotes(tab = "all") {
  const user = getCurrentUser();
  const [notesRes, sharedRes] = await Promise.all([
    fetch(apiNotes),
    fetch(apiShared)
  ]);

  const [notes, shared] = await Promise.all([
    notesRes.json(),
    sharedRes.json()
  ]);

  const sharedWithMe = shared.filter(s => s.sharedWithId === user.id);
  const sharedNoteIds = sharedWithMe.map(s => s.noteId);
  const myNotes = notes.filter(n => n.ownerId === user.id);
  const sharedNotes = notes.filter(n => sharedNoteIds.includes(n.id));

  let filtered = [];
  if (tab === "all") filtered = [...myNotes, ...sharedNotes];
  else if (tab === "personal") filtered = myNotes;
  else if (tab === "shared") filtered = sharedNotes;

  renderNotes(filtered, sharedWithMe);
}

export function renderNotes(notes, sharedList = []) {
  const user = getCurrentUser();
  const notesContainer = document.getElementById("notes-container");
  notesContainer.innerHTML = "";

  notes.forEach(n => {
    const isShared = n.ownerId !== user.id;
    const perm = sharedList.find(s => s.noteId === n.id)?.permission;

    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";

    col.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h5 class="card-title">${n.title || "Sin título"}</h5>
          <p class="card-text text-truncate">${n.content}</p>
          <span class="badge ${isShared ? 'bg-info' : 'bg-secondary'}">
            ${isShared ? `Compartida (${perm})` : "Personal"}
          </span>
          <button class="btn btn-sm btn-outline-primary mt-2" data-id="${n.id}" ${isShared && perm === 'read' ? 'disabled' : ''}>Abrir</button>
        </div>
      </div>
    `;

    col.querySelector("button").addEventListener("click", () => openEditor(n));
    notesContainer.appendChild(col);
  });
}

let currentNoteId = null;

function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function openEditor(note = null) {
  const noteContent = document.getElementById("note-content");
  currentNoteId = note?.id || null;
  noteContent.value = note?.content || "";
  showView("editor-view");
}

export function handleNewNote() {
  currentNoteId = null;
  openEditor();
}

export async function saveNote() {
  const noteContent = document.getElementById("note-content").value.trim();
  if (!noteContent) return alert("Escribe algo.");

  const user = getCurrentUser();
  if (currentNoteId) {
    await fetch(`${apiNotes}/${currentNoteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: noteContent })
    });
  } else {
    await fetch(apiNotes, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: noteContent, ownerId: user.id })
    });
  }

  currentNoteId = null;
  showView("home-view");
  loadNotes();
}

export async function deleteNote() {
  if (!currentNoteId) return;
  if (!confirm("¿Eliminar esta nota?")) return;

  await fetch(`${apiNotes}/${currentNoteId}`, { method: "DELETE" });
  currentNoteId = null;
  showView("home-view");
  loadNotes();
}

export async function shareNote() {
  const user = getCurrentUser();
  const input = document.getElementById("share-user").value.trim();
  const perm = document.getElementById("share-permission").value;
  if (!input || !currentNoteId) return alert("Completa los campos.");

  const users = await fetch(apiUsers).then(res => res.json());
  const target = users.find(u => u.email === input || u.userName === input);
  if (!target) return alert("Usuario no encontrado.");

  const res = await fetch(apiShared, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      noteId: currentNoteId,
      ownerId: user.id,
      sharedWithId: target.id,
      permission: perm
    })
  });

  if (res.ok) {
    alert("Nota compartida.");
    bootstrap.Modal.getInstance(document.getElementById("shareModal")).hide();
    document.getElementById("share-user").value = "";
  } else {
    alert("Error al compartir.");
  }
}