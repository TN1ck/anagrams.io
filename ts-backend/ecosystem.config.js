module.exports = {
  apps: [
    {
      name: "anagrams-backend",
      script: "./dist/ts-backend/index.js",
      node_args: "--max_old_space_size=8192"
    }
  ]
};
