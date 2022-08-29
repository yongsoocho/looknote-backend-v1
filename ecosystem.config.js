module.exports = {
  apps: [
    {
      name: 'app1',
      script: './dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
