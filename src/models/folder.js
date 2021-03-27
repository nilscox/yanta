import Note from './note';

export default class Folder {
  constructor(folder, parent) {
    this.name = folder.name;
    this.parent = parent;

    this.entries = folder.entries.map(entry => {
      if ('text' in entry)
        return new Note(entry, this);
      else
        return new Folder(entry, this);
    });
  }

  static root() {
    return new Folder({ name: '/', entries: [] }, null);
  }

  getPath() {
    if (!this.parent) {
      return '';
    }

    return [this.parent.getPath(), this.name].join('/');
  }

  getEntry(name) {
    return this.entries.find(Entry => Entry.name === name);
  }

  getFolders() {
    return this.entries.filter(entry => entry.constructor === Folder);
  }

  searchFolders(search) {
    const searchFilter = (folder) => {
      return folder.name.match(search) || folder.entries.length > 0;
    };

    return this.getFolders().filter(searchFilter);
  }

  getNotes() {
    return this.entries.filter(entry => entry.constructor === Note);
  }

  searchNotes(search) {
    const searchFilter = (note) => {
      return note.name.match(search) || note.text.match(search);
    };

    return this.getNotes().filter(searchFilter);
  }

  getFolder(name) {
    const Entry = this.getEntry(name);

    if (!Entry || Entry.constructor !== Folder) {
      throw new Error('folder does not exist');
    }

    return Entry;
  }

  getNote(name) {
    const Entry = this.getEntry(name);

    if (!Entry || Entry.constructor !== Note) {
      throw new Error('note does not exist');
    }

    return Entry;
  }

  add(entry) {
    if (this.getEntry(entry.name)) {
      throw new Error('name conflict');
    }

    this.entries.push(entry);
  }

  remove(entry) {
    const index = this.entries.indexOf(entry);

    if (index < 0) {
      throw new Error('entry does not exist');
    }

    this.entries.splice(index, 1);
  }

  toJSON() {
    const obj = { ...this };

    delete obj.parent;

    return obj;
  }
};
