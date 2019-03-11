const PDFDocument = require('pdfkit');
const fs = require('fs');
const moment = require('moment');
const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const handlebars = require('handlebars');

const { timesheetSchema, Timesheet } = require('../models/timesheet/timesheet');
timesheetSchema.plugin(deepPopulate);

const { isValidObjectId } = require('../helpers/controller_helper');

const errorHelper = require('../helpers/error_helper');

module.exports = {
    generate: async (req, res) => {
        
        console.log('Hit the PDF generate endpoint');
        
        // Find the timesheet from the database
       const { timesheetId } = req.value.params;
       if (!isValidObjectId(timesheetId)) { errorHelper.timesheet.invalidId(res); }
        const foundTimesheet = await Timesheet.find({ _id: timesheetId })
          .deepPopulate('bookedHours.projectId bookedHours.projectId.package userId');
        if (!foundTimesheet || foundTimesheet.length === 0) {
          errorHelper.timesheet.invalidTimesheetId(res);
        }
        
        const document = new PDFDocument({
          size: 'legal',
          layout: 'landscape',
          fontSize: 10,
        });
        
        const { firstName, lastName } = foundTimesheet[0].userId[0];
        
        module.exports.compileToHtml(foundTimesheet[0]);
        
        const parsedDate = moment.unix(foundTimesheet[0].weekEndingUnix).format("MM/DD/YYYY");
        
        // Format the outputted document
        document.fontSize(15).text(`${firstName} ${lastName} - Graham Timesheet for WE ${parsedDate}`, 50, 50);
        document.text(' ');
        
        await foundTimesheet[0].bookedHours.forEach((booking) => {
           document.text(`${booking.projectId[0].pinNumber} - ${booking.projectId[0].projectName}`);
           document.text(' ');
           document.text('Mon: ' + booking.mon);
           document.text('Tue: ' + booking.tue);
           document.text('Wed: ' + booking.wed);
           document.text('Thu: ' + booking.thu);
           document.text('Fri: ' + booking.fri);
           document.text('Sat: ' + booking.sat);
           document.text('Sun: ' + booking.sun);
           document.text(' ');
        });
        
        document.text(' ');
        
        const outputPath = './server/pdf-output/timesheet.pdf';
        const output = document.pipe(fs.createWriteStream(outputPath));
        document.end();
    },
    compileToHtml: (objectToProcess) => {

        const tpl = handlebars.compile(
            fs.readFileSync(__dirname +   '/templates/timesheet.hbs')
            .toString('utf-8'));
        
        console.log(objectToProcess);
        
        const result = tpl({
            title: `${objectToProcess.userId[0].firstName} ${objectToProcess.userId[0].lastName}`
        });
        
        fs.writeFile(`./server/pdf-output/${objectToProcess.userId[0]._id}_${Date.now()}.html`,
        result, (err, result) => {
            if(err) {
                console.log(err);
            }
        });
    }
}