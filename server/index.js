const app = require('./app');

// Start the server
const port = process.env.PORT || 3050;
app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});