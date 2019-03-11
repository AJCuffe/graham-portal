const mongoose = require('mongoose');

const { Schema } = mongoose;

const timesheetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  weekEnding: {
    type: Date,
    required: true,
  },
  weekEndingUnix: {
    type: Number,
  },
  bookedHours: [{
    projectId: {
      type: [{ type: Schema.Types.ObjectId, ref: 'project' }],
      required: true,
    },
    mon: {
      type: Number,
    },
    tue: {
      type: Number,
    },
    wed: {
      type: Number,
    },
    thu: {
      type: Number,
    },
    fri: {
      type: Number,
    },
    sat: {
      type: Number,
    },
    sun: {
      type: Number,
    },
    desc: {
      type: String,
    },
  }],
  totalHours: {
    type: Number,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  submitted: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
});

timesheetSchema.pre('save', async (next) => {
  try {
    // Total up all the hours
    let grandTotalHours = 0;
    this.bookedHours.forEach((booking) => {
      grandTotalHours += booking.mon + booking.tue + booking.wed + booking.thu
      + booking.fri + booking.sat + booking.sun;
    });
    this.totalHours = grandTotalHours;
    this.weekEndingUnix = Date.parse(this.weekEnding);
    next();
  } catch (error) {
    next(error);
  }
});

const Timesheet = mongoose.model('timesheet', timesheetSchema);

module.exports = {
  timesheetSchema,
  Timesheet,
};

