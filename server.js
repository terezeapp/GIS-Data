const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files like dashboard.html

// Read data from data.json
app.get('/data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data file' });
        }
        res.json(JSON.parse(data));
    });
});

// Save a single row
app.post('/data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, fileData) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data file' });
        }

        let data = JSON.parse(fileData);
        data.push(req.body);

        fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8', err => {
            if (err) {
                return res.status(500).json({ error: 'Error saving data' });
            }
            res.json({ message: 'Row added successfully' });
        });
    });
});

// Update a row
app.put('/data/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);

    fs.readFile('data.json', 'utf8', (err, fileData) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data file' });
        }

        let data = JSON.parse(fileData);
        data[index] = req.body;

        fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8', err => {
            if (err) {
                return res.status(500).json({ error: 'Error updating data' });
            }
            res.json({ message: 'Row updated successfully' });
        });
    });
});

// Delete a row
app.delete('/data/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);

    fs.readFile('data.json', 'utf8', (err, fileData) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data file' });
        }

        let data = JSON.parse(fileData);
        data.splice(index, 1);

        fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8', err => {
            if (err) {
                return res.status(500).json({ error: 'Error deleting data' });
            }
            res.json({ message: 'Row deleted successfully' });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
