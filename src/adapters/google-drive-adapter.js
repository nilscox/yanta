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

  async save() {
    console.log('save', this.fileId, this.root);
    await this.client.updateFile(this.fileId, JSON.stringify(this.root));
  }

  async sync() {
    if (!this.fileId) {
      const filesIds = await this.client.getFilesIds('yanta.json');

      if (filesIds.length === 0) {
        const file = await this.client.createFile('yanta.json', 'Yanta Filesystem', 'application/json');

        this.fileId = file.id;
        this.root = Folder.root();

        await this.save();
      } else if (filesIds.length === 1) {
        this.fileId = filesIds[0];
      } else {
        throw new Error('expected to find one file');
      }
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
