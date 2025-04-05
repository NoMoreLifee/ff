const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 8000;


const visitsFile = path.join('/tmp', 'visits.json');


if (!fs.existsSync(visitsFile)) {
    fs.writeFileSync(visitsFile, JSON.stringify({ count: 0, visitors: [] }));
}


app.use(cors({
    origin: '*',  
    credentials: true
}));

app.use(cookieParser());

app.get('/visit', (req, res) => {
    const visitorID = req.cookies.visitorID;
    let data;
    
    try {
        data = JSON.parse(fs.readFileSync(visitsFile));
    } catch (err) {
        data = { count: 0, visitors: [] };
    }

    if (!visitorID) {
        const newVisitorID = Date.now(); 
        res.cookie('visitorID', newVisitorID, { maxAge: 86400000, sameSite: 'None', secure: true }); 
        
        data.count += 1;
        try {
            fs.writeFileSync(visitsFile, JSON.stringify(data));
        } catch (err) {
            console.error("Error writing to visits file:", err);
        }
    }

    res.json({ count: data.count });
});

app.get('/', (req, res) => {
    res.send('Visitor Counter API is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});