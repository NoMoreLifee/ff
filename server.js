const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

const visitsFile = path.join(__dirname, 'visits.json');

if (!fs.existsSync(visitsFile)) {
    fs.writeFileSync(visitsFile, JSON.stringify({ count: 0, visitors: [] }));
}

app.use(cookieParser());


app.get('/visit', (req, res) => {
    const visitorID = req.cookies.visitorID;
    const data = JSON.parse(fs.readFileSync(visitsFile));


    if (!visitorID) {
        const newVisitorID = Date.now(); 
        res.cookie('visitorID', newVisitorID, { maxAge: 86400000 }); 
        
        data.count += 1;
        fs.writeFileSync(visitsFile, JSON.stringify(data));
    }

    res.json({ count: data.count });
});


app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
