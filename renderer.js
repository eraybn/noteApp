const { ipcRenderer } = require('electron');

let editingNoteIndex = null;

document.addEventListener('DOMContentLoaded', async () => {
  const notlarim = await ipcRenderer.invoke('get-note');
  renderNotes(notlarim);
});


function renderNotes(notlarim) {
  const noteList = document.getElementById('noteList');
  noteList.innerHTML = ''; 
  notlarim.forEach((note, index) => {
    const li = document.createElement('li');
    
    
    li.textContent = note.length > 25 ? note.substring(0, 25) + '...' : note;

    
    const editButton = document.createElement('button');
    editButton.textContent = 'Düzenle';
    editButton.classList.add('edit');
    editButton.addEventListener('click', () => openEditModal(index, note));

    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Sil';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', () => deleteNote(index));

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    noteList.appendChild(li);
  });
}


const addButton = document.getElementById('addButton');
addButton.addEventListener('click', async () => {
  const noteInput = document.getElementById('note');
  const newNote = noteInput.value.trim();

  if (newNote) {
    const updatedNotes = await ipcRenderer.invoke('add-note', newNote);
    renderNotes(updatedNotes); 
    noteInput.value = ''; 
  }
});


function openEditModal(index, note) {
  editingNoteIndex = index;
  const modal = document.getElementById('editModal');
  const editTextarea = document.getElementById('editNoteTextarea');
  editTextarea.value = note;
  modal.style.display = 'flex';
}


const closeModalButton = document.getElementById('closeModal');
closeModalButton.addEventListener('click', () => {
  const modal = document.getElementById('editModal');
  modal.style.display = 'none';
});


const saveEditButton = document.getElementById('saveEditButton');
saveEditButton.addEventListener('click', async () => {
  const editTextarea = document.getElementById('editNoteTextarea');
  const editedNote = editTextarea.value.trim();

  if (editedNote && editingNoteIndex !== null) {
    const updatedNotes = await ipcRenderer.invoke('edit-note', {
      index: editingNoteIndex,
      note: editedNote,
    });
    renderNotes(updatedNotes);
    document.getElementById('editModal').style.display = 'none';
  }
});

Z
async function deleteNote(index) {
  const updatedNotes = await ipcRenderer.invoke('delete-note', index);
  renderNotes(updatedNotes);
}
