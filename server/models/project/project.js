const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
   pinNumber: {
       type: String,
       required: true
   },
   projectName: {
       type: String,
       required: true
   },
   package: {
    type: [{ type: Schema.Types.ObjectId, ref: 'package' }],
    required: true
   },
   plannedStartDate: {
       type: Date
   },
   plannedCompletionDate: {
     type: Date
   },
   actualStartDate: {
       type: Date
   },
   actualCompletionDate: {
       type: Date
   },
   active: {
       type: Boolean,
       required: true
   }
});

const Project = mongoose.model('project', projectSchema);

module.exports = Project;