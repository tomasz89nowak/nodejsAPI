var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var aboutSchema = new Schema({
  name: {type: String,},
  title: {type: String,},
  text: {type: String,},
  published: Boolean,
  image: Schema.Types.Mixed,
  linkedin: String,
  facebook: String,
  github: String,
  twitter: String,
  // skills: [{type: mongoose.Schema.Types.ObjectId, ref: 'Skill'}]
}, {timestamps: true});

aboutSchema.methods = {
  update: function(data, file){
    let newFile = {};
    if(file){
      newFile = {image: file};
    }
    Object.assign(this, data, newFile);
    this.save();
  }
};

// the schema is useless so far
// we need to create a model using it
var About = mongoose.model('About', aboutSchema);

// make this available to our notes in our Node applications
module.exports = About;