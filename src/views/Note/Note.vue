<template>
  <note-not-found v-if="notFound" @note-created="reloadNote" />
  <note v-if="note" :path="path" :note="note" />
</template>

<script>
import Note from '../../components/Note/Note.vue';
import notesMixin from '../../mixins/notes.mixin';
import NoteNotFound from './NoteNotFound';

export default {
  name: 'NoteView',
  components: {
    Note,
    NoteNotFound,
  },
  mixins: [
    notesMixin,
  ],
  data() {
    const path = '/' + this.$route.params.path;
    const [note, notFound] = this.getNoteOrNotFound(path);

    return {
      path,
      note,
      notFound,
      create: false,
    };
  },
  methods: {
    getNoteOrNotFound(path) {
      try {
        return [this.getNote(path), false];
      } catch (e) {
        if (e.message !== 'note does not exist') {
          throw e;
        }

        return [, true];
      }
    },
    reloadNote() {
      const [note, notFound] = this.getNoteOrNotFound(this.path);

      this.note = note;
      this.notFound = notFound;
    },
  },
  watch: {
    $route() {
      this.path = '/' + this.$route.params.path;
    },
    path() {
      this.reloadNote();
    },
  },
};
</script>
