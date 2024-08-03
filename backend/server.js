const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// Serve GeoJSON file
app.get('/api/geojson', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'lga_acc_count.geojson');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading GeoJSON file:', err.message);
      res.status(500).send('Server error');
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
