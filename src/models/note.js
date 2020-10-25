export default class Note {
  constructor(note, folder) {
    this.folder = folder;
    this.name = note.name;
    this.text = note.text;
    this.created = note.created ? new Date(note.created) : new Date();
    this.updated = note.updated ? new Date(note.updated) : new Date();
  }

  getPath() {
    return [this.folder.getPath(), this.name].join('/');
  }

  toJSON() {
    const obj = { ...this };

    delete obj.folder;

    return obj;
  }
}
