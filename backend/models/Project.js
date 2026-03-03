const mongoose = require('mongoose');

// Project Schema Definition
const projectSchema = new mongoose.Schema({
    project_name: {
        type: String,
        required: [true, 'Please add a project name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

module.exports = mongoose.model('Project', projectSchema);
