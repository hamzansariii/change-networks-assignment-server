// routes/index.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Automatically require and use all route files in the current directory
fs.readdirSync(__dirname).forEach(file => {
    // Skip the current file to avoid infinite loop
    if (file === 'index.js') return;
    if (file.slice(-3) !== '.js') {
        const externalPath = path.join(__dirname, file)
        fs.readdirSync(externalPath).forEach(externalFile => {
            const route = require(path.join(externalPath, externalFile));
            router.use(route);
        })
    } else {
        const route = require(path.join(__dirname, file));
        router.use(route);
    }
});

module.exports = router;
