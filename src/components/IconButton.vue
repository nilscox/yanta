<script>
export default {
  name: 'IconButton',
  props: {
    icon: String,
    click: Function,
    class: String,
  },
};
</script>

<template>
  <button :class="['button', 'button-icon', this.class]" @click="click">
    <img :src="icon" />
  </button>
</template>

<style scoped>
button {
  width: 4rem;
  height: 4rem;
  margin: 6px;
  padding: 0;
  background-color: transparent;
  border: 1px solid #CCC;
  border-radius: 2rem;
}

button:hover,
button:focus {
  background-color: transparent;
  border-color: #CCC;
}

button img {
  padding: 8px;
}

button.icon-small img {
  transform: scale(0.9);
}

button.icon-big img {
  transform: scale(1.2);
}
</style>
