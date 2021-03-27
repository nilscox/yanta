import Folder from '../models/folder';
import { NotesAdapter } from './notes-adapter';

export class InMemoryAdapter extends NotesAdapter {

  constructor() {
    super();
  }

  init() {
    this.root = Folder.root();
  }

  teardown() {}

  save() {}
}
