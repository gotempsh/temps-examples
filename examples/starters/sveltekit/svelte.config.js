import adapter from '@sveltejs/adapter-node';

// adapter-node emits build/index.js, which honours PORT and HOST at runtime.
export default {
  kit: {
    adapter: adapter(),
  },
};
