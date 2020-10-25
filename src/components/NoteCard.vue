<template>
  <router-link :class="['note-card', this.class]" :to="to">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  name: 'NoteCard',
  props: {
    to: String,
    class: String,
  },
};
</script>

<style scoped>
a.note-card {
  position: relative;
  min-width: 320px;
  max-width: 480px;
  max-height: 220px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  padding: 2rem;
  margin: 4rem;
  background-color: #FFF;
}

a.note-card::after {
  content: '';
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  top: 0;
  background: linear-gradient(#FFFFFF00 90%, #FFFFFFFF);
}
</style>
