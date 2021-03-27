import { InMemoryAdapter } from './in-memory-adapter';
import { LocalStorageAdapter } from './local-storage-adapter';
import { GoogleDriveAdapter } from './google-drive-adapter';

export default {
  IN_MEMORY: InMemoryAdapter,
  LOCAL_STORAGE: LocalStorageAdapter,
  GOOGLE_DRIVE: GoogleDriveAdapter,
};
