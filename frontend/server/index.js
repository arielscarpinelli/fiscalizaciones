const express = require("express");
const path = require("path");
const app = express(); // create express app

// add middleware
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/../build/index.html'));
});

const PORT = process.env.PORT || 3000;

// start express server
app.listen(PORT, () => {
  console.log(
    `Ejecutando el frontend del backoffice en http://localhost:${PORT}`
  );
});
