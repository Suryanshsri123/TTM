const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    project: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Project",
  required: false   
},

    assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false
},

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo"
    },

    deadline: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);