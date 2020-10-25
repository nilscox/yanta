export default {
  inject: ['notesAdapter'],
  computed: {
    adapter() {
      return this.notesAdapter.value;
    },
  },
  methods: {
    entryExists(path) {
      return this.getEntry(path) !== null;
    },
    getCurrentNote() {
      if (!this.$route)
        return null;

      return this.getNote('/' + this.$route.params.path);
    },
    getRootFolder() {
      return this.adapter.getRootFolder();
    },
    getEntry(path) {
      return this.adapter.getEntry(path);
    },
    getFolder(path) {
      return this.adapter.getFolder(path);
    },
    getNote(path) {
      return this.adapter.getNote(path);
    },
    saveNote(path, text) {
      console.log('saveNote', path);
      return this.adapter.saveNote(path, text);
    },
    moveEntry(oldPath, newPath) {
      console.log('moveEntry', oldPath, newPath);
      return this.adapter.moveEntry(oldPath, newPath);
    },
    deleteEntry(path) {
      console.log('deleteEntry', path);
      return this.adapter.deleteEntry(path);
    },
  }
};
