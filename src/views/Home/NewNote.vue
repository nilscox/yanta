<template>
  <note-card class="new-note" to="?new=true">
    +
  </note-card>
</template>

<script>
import NoteCard from '../../components/NoteCard';

export default {
  name: 'NewNote',
  components: {
    NoteCard,
  },
};
</script>

<style scoped>
.new-note {
  font-size: 8rem;
  text-align: center;
}
</style>
