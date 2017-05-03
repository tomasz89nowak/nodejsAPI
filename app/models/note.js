var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var noteSchema = new Schema({
  name: String,
  title: { type: String, required: true },
  published: Boolean,
  image: Schema.Types.Mixed,
}, {timestamps: true});

noteSchema.methods = {
  update: function(data, file){
    var newFile = {};
    if(file){
      newFile = {image: file};
    }
    Object.assign(this, data, newFile);
    this.save();
  }
};

// the schema is useless so far
// we need to create a model using it
var Note = mongoose.model('Note', noteSchema);

// make this available to our notes in our Node applications
module.exports = Note;