const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'database-1.cdm6uyc6ggru.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'password', // Use your PostgreSQL password
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  },
});

// Test database connection and fetch database name
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }
  client.query('SELECT current_database()', (err, result) => {
    if (err) {
      release();
      console.error('Error executing query', err.stack);
      return;
    }
    console.log('Connected to the database:', result.rows[0].current_database);

    // Perform a simple query to list tables
    client.query('SELECT tablename FROM pg_tables WHERE schemaname = \'public\'', (err, result) => {
      release();
      if (err) {
        console.error('Error executing query', err.stack);
        return;
      }
      console.log('Tables in the database:');
      result.rows.forEach(row => {
        console.log(row.tablename);
      });
    });
  });
});

// Serve GeoJSON file
app.get('/api/geojson', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'lga_acc_count.geojson');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading GeoJSON file:', err.message);
      res.status(500).send('Server error');
      return;
    }
    console.log('GeoJSON data sent successfully');
    res.json(JSON.parse(data));
  });
});

// Endpoint to fetch accident severity data based on LGA_NAME
app.get('/api/postgres/:lgaName', async (req, res) => {
  const lgaName = req.params.lgaName;
  console.log(`Received request for LGA: ${lgaName}`);

  try {
    console.log(`Connecting to the database to get data for LGA: ${lgaName}`);
    const result = await pool.query(`
      SELECT severity, "count" as count 
      FROM lga_accidents 
      WHERE lga_name = $1`, [lgaName]);

    console.log('Query result:', result.rows);

    if (result.rows.length === 0) {
      console.log(`No data found for LGA: ${lgaName}`);
      res.status(404).send(`No data found for LGA: ${lgaName}`);
      return;
    }

    const severityCounts = {
      'Serious injury accident': 0,
      'Other injury accident': 0,
      'Non-injury accident': 0
    };

    result.rows.forEach(row => {
      if (row.severity == 3) {
        severityCounts['Serious injury accident'] = parseInt(row.count, 10);
      } else if (row.severity == 2) {
        severityCounts['Other injury accident'] = parseInt(row.count, 10);
      } else if (row.severity == 1) {
        severityCounts['Non-injury accident'] = parseInt(row.count, 10);
      }
    });

    console.log(`Data for LGA ${lgaName}:`, severityCounts);
    res.json(severityCounts);
  } catch (error) {
    console.error('Error querying database:', error.message);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});