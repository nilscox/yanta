import Folder from '../models/folder';
import { NotesAdapter } from './notes-adapter';
import { GoogleDriveClient } from './google-drive-client';

export class GoogleDriveAdapter extends NotesAdapter {

  constructor() {
    super();

    this.client = new GoogleDriveClient();

    this.fileId = undefined;
    this.fileMetadata = undefined;
    this.fileContent = undefined;

    this.root = undefined;
    this.root = new Folder({ name: '/', entries: [] });
  }

  async init() {
    await this.client.init();

    if (!this.client.isSignedIn) {
      await this.client.signIn();
    }

    await this.sync();
  }

  async teardown() {
    await this.client.signOut();
  }

  async sync() {
    if (!this.fileId) {
      this.fileId = await this.client.getFileId('yanta.json');
    }

    if (!this.fileMetadata) {
      this.fileMetadata = await this.client.getFileMetadata(this.fileId);
    }

    if (!this.fileContent) {
      this.fileContent = await this.client.getFileContent(this.fileId);
    }

    this.root = new Folder(this.fileContent);
  }

  getRootFolder() {
    return this.root;
  }
}
