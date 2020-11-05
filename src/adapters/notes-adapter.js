import Folder from '../models/folder';
import Note from '../models/note';

const splitFilePath = (path) => {
  const lastSlash = path.lastIndexOf('/');

  if (lastSlash < 0)
    return [];

  return [
    lastSlash === 0 ? '/' : path.slice(0, lastSlash),
    path.slice(lastSlash + 1),
  ];
};

export class NotesAdapter {

  init() {
    throw new Error('not implemented');
  }

  teardown() {
    throw new Error('not implemented');
  }

  getRootFolder() {
    throw new Error('not implemented');
  }

  save() {
    throw new Error('not implemented');
  }

  static getEntryFrom(folder, path) {
    const entry = folder.getEntry(path[0]);

    if (!entry) {
      return null;
    }

    if (path.length === 1) {
      return entry;
    }

    if (entry.constructor !== Folder) {
      return null;
    }

    return NotesAdapter.getEntryFrom(entry, path.slice(1));
  };

  getEntry(path) {
    if (!path.startsWith('/')) {
      throw new Error('invalid path');
    }

    const root = this.getRootFolder();

    if (path === '/') {
      return root;
    }

    return NotesAdapter.getEntryFrom(root, path.slice(1).split('/'));
  }

  getFolder(path) {
    const entry = this.getEntry(path);

    if (!entry || entry.constructor !== Folder) {
      throw new Error('folder does not exist');
    }

    return entry;
  }

  getNote(path) {
    const entry = this.getEntry(path);

    if (!entry || entry.constructor !== Note) {
      throw new Error('note does not exist');
    }

    return entry;
  }

  saveNote(path, text) {
    const [dirname, filename] = splitFilePath(path);

    if (!dirname) {
      throw new Error('invalid path');
    }

    const folder = this.getFolder(dirname);
    const note = folder.getEntry(filename);

    if (note) {
      if (note.constructor !== Note) {
        throw new Error('note does not exsit');
      }

      note.text = text;
      note.updated = new Date();
    } else {
      folder.add(new Note({ name: filename, text }, folder));
    }

    this.save();
  }

  moveEntry(oldPath, newPath) {
    const entry = this.getEntry(oldPath);

    if (!entry) {
      throw new Error('source does not exist');
    }

    const source = entry.constructor === Note ? entry.folder : entry.parent;

    const [dirname, filename] = splitFilePath(newPath);
    const dest = this.getFolder(dirname);

    if (source !== dest) {
      dest.add(entry);
      source.remove(entry);
    }

    entry.name = filename;

    this.save();
  }

  deleteEntry(path) {
    const entry = this.getEntry(path);

    if (!entry) {
      throw new Error('entry does not exist');
    }

    const folder = entry.constructor === Note ? entry.folder : entry.parent;

    if (!folder) {
      throw new Error('invalid path');
    }

    folder.remove(entry);

    this.save();
  }
}
