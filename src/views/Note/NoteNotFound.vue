<template>
  <main class="not-found">
    <h2>This note does not exist</h2>
    <button class="button button-outline button-dark" @click="create">Create</button>
  </main>
</template>

<script>
import notesMixin from '../../mixins/notes.mixin';

export default {
  name: 'NoteNotFound',
  mixins: [notesMixin],
  emits: ['note-created'],
  methods: {
    create() {
      const path = '/' + this.$route.params.path;

      this.saveNote(path, '');
      this.$emit('note-created');
    },
  },
};
</script>

<style>
.not-found {
  text-align: center;
  flex: 1;
  margin: auto;
  padding-bottom: 25%;
}

h2 {
  margin-bottom: 4rem;
}

.button.button-outline {
  background-color: #EEE;
  border-color: #CCC;
  color: inherit;
  transition: background-color, border-color 200ms ease-in-out;
}

.button:focus {
  color: inherit;
  border-color: inherit;
  background-color: inherit;
}
</style>
