import Folder from '../models/folder';
import { NotesAdapter } from './notes-adapter';

export class LocalStorageAdapter extends NotesAdapter {

  constructor(initialData) {
    super();
    this.initialData = initialData;
  }

  init() {
    const dataJson = window.localStorage.getItem('notes');
    const data = dataJson ? JSON.parse(dataJson) : this.initialData;

    if (data) {
      this.root = new Folder(data, null);
    } else {
      this.root = new Folder({
        name: '/',
        entries: [],
      });
    }
  }

  teardown() {
    window.localStorage.removeItem('notes');
  }

  getRootFolder() {
    return this.root;
  }

  save() {
    window.localStorage.setItem('notes', JSON.stringify(this.root));
  }
}
