const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({

    projectName: {
        type: String,
        required:true
    },

    TaskName: {
        type: String,
        required: true
    },


    Description: {
        type: String,
        required: true
    },


    status: {
        type: String,
        enum: ['uncompleted','Completed'],
        required: true
    },

},
    {
        timestamps:true
    })

module.exports = task = mongoose.model("task", taskSchema);