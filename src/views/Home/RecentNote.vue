<template>
  <note-card class="recent-note" :to="note.getPath()">
    <h2>{{ note.name }}</h2>
    <div class="text markdown-github" v-html="html" />
  </note-card>
</template>

<script>
import NoteCard from '../../components/NoteCard';
import showdownMixin from '../../mixins/showdown.mixin';

export default {
  name: 'RecentNote',
  props: {
    note: Object,
  },
  components: {
    NoteCard,
  },
  mixins: [
    showdownMixin,
  ],
  computed: {
    html() {
      return this.makeHtml(this.note.text);
    },
  },
};
</script>

<style scoped>
.recent-note {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.text {
  overflow: hidden;
  flex: 1;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}

.markdown-github h1,
.markdown-github h2,
.markdown-github h3,
.markdown-github h4,
.markdown-github h5,
.markdown-github h6 {
  font-size: 1rem;
}
</style>
