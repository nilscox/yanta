<template>
  <settings />
  <note v-if="newNote" path="/" :creating="true" />
  <main v-if="false && !newNote">
    <h1>
      <span class="appname-chunk">yet</span>
      <span class="appname-chunk">another</span>
      <span class="appname-chunk">note</span>
      <span class="appname-chunk">taking</span>
      <span class="appname-chunk">app</span>
    </h1>
    <div class="recent-notes">
      <new-note />
      <recent-note v-for="note of recentNotes" :key="note.getPath()" :note="note" />
    </div>
  </main>
</template>

<script>
import notesMixin from '../../mixins/notes.mixin';
import Note from '../../components/Note/Note.vue';
import Settings from './Settings.vue';
import RecentNote from './RecentNote.vue';
import NewNote from './NewNote.vue';

export default {
  name: 'Home',
  components: {
    Settings,
    Note,
    NewNote,
    RecentNote,
  },
  mixins: [notesMixin],
  computed: {
    newNote() {
      return this.$route.query.new === 'true';
    },
    allNotes() {
      const getNotes = folder => {
        return [...folder.getFolders().map(getNotes), ...folder.getNotes()].flat();
      };

      return getNotes(this.getRootFolder());
    },
    recentNotes() {
      return this.allNotes
        .sort((a, b) => b.updated.getTime() - a.updated.getTime())
        .slice(0, 8);
    },
  },
};
</script>

<style scoped>
h1 {
  margin: 4rem 0;
  text-align: center;
}

h1 .appname-chunk {
  font-size: 1rem;
  text-transform: uppercase;
  display: inline-block;
  width: 8rem;
  font-weight: 600;
  text-align: left;
}

h1 .appname-chunk::first-letter {
  font-size: 6rem;
  font-weight: 400;
}

.recent-notes {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
}
</style>
