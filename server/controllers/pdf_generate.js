const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Handlebars = require('handlebars');
const pdf = require('html-pdf');

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
      
        let finalObjectToProcess = {
          timesheets: []
        };

        foundTimesheet.forEach((timesheet) => {

          let objectToProcess = {
            timesheet: [{
              firstName: timesheet.userId[0].firstName,
              lastName: timesheet.userId[0].lastName,
              locked: timesheet.locked,
              submitted: timesheet.submitted,
              approved: timesheet.approved,
              rejected: timesheet.rejected,
              weekEnding: timesheet.weekEnding,
            }]
          };

         let bookedHours = [];

        timesheet.bookedHours.forEach((item) => {
          let project = {
            pinNumber: item.projectId[0].pinNumber,
            projectName: item.projectId[0].projectName,
            mon: item.mon,
            tue: item.tue,
            wed: item.wed,
            thu: item.thu,
            fri: item.fri,
            sat: item.sat,
            sun: item.sun
          };
          bookedHours.push(project);
        });

         objectToProcess.timesheet[0].bookedHours = bookedHours;
         finalObjectToProcess.timesheets.push(objectToProcess);
        });

        // Pass the 'timesheet' object to the html compiler
        module.exports.compileToHtml(finalObjectToProcess);
        res.json(finalObjectToProcess);
      
    },
    compileToHtml: async (objectToProcess) => {

      const template = Handlebars.compile(
        fs.readFileSync(__dirname +   '/templates/timesheet.hbs')
        .toString('utf-8'));

        const result = template(objectToProcess);

      await fs.writeFile(`./server/pdf-output/output.html`,
        result, (err, result) => {
          if(err) {
            console.log(err);
          }

          console.log('wrote file');

          // convert to PDF and delete the HTML
          const html = fs.readFileSync(path.join(__dirname, '../pdf-output/output.html'), 'utf-8');
          var options = { format: 'A4', orientation: 'landscape', renderDelay: 500 };
          
          pdf.create(html, options).toFile(path.join(__dirname, '../pdf-output/output.pdf'), function(err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
          });

      });
        
    }
}