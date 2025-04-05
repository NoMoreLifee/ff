const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();

const PORT = process.env.PORT || 8000;
const visitsFile = path.join(__dirname, 'visits.json');

let visitsData = { count: 0, visitors: [] };

try {
    if (fs.existsSync(visitsFile)) {
        visitsData = JSON.parse(fs.readFileSync(visitsFile));
        console.log('تم قراءة بيانات الزيارات:', visitsData);
    } else {
        fs.writeFileSync(visitsFile, JSON.stringify(visitsData));
        console.log('تم إنشاء ملف زيارات جديد');
    }
} catch (error) {
    console.error('خطأ في قراءة ملف الزيارات:', error);
}

setInterval(() => {
    try {
        fs.writeFileSync(visitsFile, JSON.stringify(visitsData));
        console.log('تم حفظ بيانات الزيارات في الملف');
    } catch (error) {
        console.error('خطأ في حفظ بيانات الزيارات:', error);
    }
}, 5 * 60 * 1000);

app.use(cookieParser());

app.get('/visit', (req, res) => {
    const visitorID = req.cookies.visitorID;

    if (!visitorID) {
        const newVisitorID = Date.now();
        res.cookie('visitorID', newVisitorID, { maxAge: 86400000 }); 
        
        visitsData.count += 1;
        visitsData.visitors.push(newVisitorID);
        console.log('زائر جديد! العدد الإجمالي:', visitsData.count);
    }

    res.json({ count: visitsData.count });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
    console.log(`يمكنك الوصول إليه عبر http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    try {
        fs.writeFileSync(visitsFile, JSON.stringify(visitsData));
        console.log('تم حفظ بيانات الزيارات قبل الإغلاق');
    } catch (error) {
        console.error('خطأ في حفظ بيانات الزيارات قبل الإغلاق:', error);
    }
    process.exit();
});