export default {
  inject: [
    'registerKeybindingListener',
    'unregisterKeybindingListener',
    'setListening',
  ],
  mounted() {
    this.registerKeybindingListener(this.handleKeybinding);
  },
  unmounted() {
    this.unregisterKeybindingListener(this.handleKeybinding);
  },
  methods: {
    handleKeybinding() {},
    pauseListeners() {
      this.setListening(false);
    },
    unpauseListeners() {
      this.setListening(true);
    },
  },
};
