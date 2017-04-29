var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var articleSchema = new Schema({
  title: {type: String, required: true},
  description: String,
  content: {type: String, required: true},
  published: Boolean,
  image: Schema.Types.Mixed,
}, {timestamps: true});

articleSchema.methods = {
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
var Article = mongoose.model('Article', articleSchema);

// make this available to our notes in our Node applications
module.exports = Article;