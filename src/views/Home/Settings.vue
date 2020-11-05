<template>
  <main>
    <h1>Settings</h1>
    <h2>Synchronization</h2>
    <form>
      <label>
        <input type="radio" name="syncAdapter" value="LOCAL_STORAGE" v-model="adapter" />
        Local Storage
      </label>
      <label>
        <input type="radio" name="syncAdapter" value="GOOGLE_DRIVE" v-model="adapter" />
        Google Drive
      </label>
    </form>
  </main>
</template>

<script>
import adapters from '../../adapters';

export default {
  name: 'Settings',
  inject: ['notesAdapter', 'setNotesAdapter'],
  components: {
  },
  data() {
    return {
      adapter: localStorage.getItem('adapter') || 'LOCAL_STORAGE',
    };
  },
  watch: {
    async adapter() {
      const oldAdapter = this.notesAdapter.value;

      const Adapter = adapters[this.adapter];
      const adapter = new Adapter(oldAdapter.getRootFolder());

      await oldAdapter.teardown();
      await adapter.init();

      await adapter.save();

      this.setNotesAdapter(adapter);
      localStorage.setItem('adapter', this.adapter);
    },
  },
};
</script>

<style scoped>
h2 {
  margin-top: 4rem;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
}

label {
  font-weight: normal;
}
</style>
