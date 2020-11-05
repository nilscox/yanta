export class GoogleDriveClient {

  constructor() {
    this.isSignedIn = undefined;
  }

  init() {
    return new Promise(resolve => {
      gapi.load('client:auth2', async () => {
        await this.initClient();
        resolve();
      });
    });
  }

  async initClient() {
    const apiKey = process.env.VUE_APP_API_KEY;
    const clientId = process.env.VUE_APP_CLIENT_ID;
    const discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
    const scope = 'https://www.googleapis.com/auth/drive';

    await gapi.client.init({
      apiKey,
      clientId,
      discoveryDocs,
      scope,
    });

    this.isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();

    gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => {
      this.isSignedIn = isSignedIn;
    });
  };

  signIn() {
    return gapi.auth2.getAuthInstance().signIn();
  }

  signOut() {
    return gapi.auth2.getAuthInstance().signOut();
  }

  async getFileId(name) {
    const listResponse = await gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)",
      'q': `name = '${name}'`,
    });

    const files = listResponse.result.files;

    if (files.length !== 1) {
      throw new Error('expected to find one file');
    }

    return files[0].id;
  }

  async getFileMetadata(fileId) {
    const response = await gapi.client.drive.files.get({
      fileId: fileId,
      fields: '*',
    });

    return response.result;
  }

  async getFileContent(fileId) {
    const response = await gapi.client.drive.files.get({
      fileId: fileId,
      fields: '*',
      alt: 'media'
    });

    return response.result;
  }
}
