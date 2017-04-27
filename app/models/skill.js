var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var skillSchema = new Schema({
  name: String,
  progress: Number,
  about: {type: mongoose.Schema.Types.ObjectId, ref: 'About'}
}, {timestamps: true});

skillSchema.methods = {
  update: function(data){
    Object.assign(this, data);
    this.save();
  }
};

// the schema is useless so far
// we need to create a model using it
var Skill = mongoose.model('Skill', skillSchema);

// make this available to our notes in our Node applications
module.exports = Skill;