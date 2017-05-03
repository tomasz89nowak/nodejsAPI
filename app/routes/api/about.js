var About = require('../../models/about');
var Skill = require('../../models/skill');
var auth = require('./../auth');
var upload = require('../../../config/uploadStorage');
var router = require('express').Router();


// there can be only one instance of About;
router.get('/', auth.optional, (req, res)=>{
  About.find({}, (err, abouts) => {
    if(err){
      res.send({'error': 'An error occured'});
    }

    if(!abouts.length){
      const newAbout = new About();
      newAbout.save(function(err, about){
        if(err){
          console.log(err);
          res.send(err);
        } else {
          res.send(about);
        }
      });
    } else {
      res.send(abouts[0]);
    }
  });
});

// TODO: delete should not be here
router.delete('/:id', (req, res)=>{
  const id = req.params.id;
  About.findById(id, function(err, about){
    if(err){
      res.send({'error': 'An error occured'});
    }

    return about.remove().then(function(){
      return res.sendStatus(204);
    });
  });
});

router.put('/', upload.single('image'), (req, res) => {
  const id = req.params.id;

  About.find({}, function(err, abouts){
    const about = abouts[0];

    if(err){
      res.send(err);
    } else {
      var file = null;
      if(req.file){
        file = {
          name: req.file.filename,
          size: req.file.size,
          path: req.file.path,
          type: req.file.mimetype
        };

      }

      if(!about){
        res.sendStatus(404);
      } else {
        if(file && file.size > 1048576){ // 1 MB
          res.send({error: {file: `File is too large, it has ${(file.size / 1048576).toFixed(2)} MB! Make sure that file is smaller than 1 MB.`}});
        } else {
          about.update(req.body, file);
          about.save();
          res.send(about);
        }
      }
    }
  });
});

router.get('/skills', auth.optional, (req, res)=>{
  Skill.find(req.query, (err, skills) => {
    if(err){
      res.send({'error': 'An error occured'});
    }

    res.send(skills);
  });
});

router.get('/skills/:id', auth.optional, (req, res)=>{
  const id = req.params.id;
  Skill.findById(id, (err, skill) => {
    if(err){
      res.status(400).send(err);
    } else {
      res.send(skill);
    }
  });
});


router.post('/skills', auth.optional, function(req, res){
  var newSkill = new Skill(req.body);
  var errors = {};
  if(!req.body.name.length) {
    errors.name = 'This field cannot be empty';
  }
  if(!req.body.progress) {
    errors.progress = 'This field cannot be empty';
  } else
  if(req.body.progress > 100 || req.body.progress < 0) {
    errors.progress = 'Value must be greater than 0 and less or equal 100.'
  }
  if(Object.keys(errors).length) {
    res.status(400).send(errors);
    return;
  }

  About.findOne({}).populate('about').exec(function(err, about){
    newSkill.about = about._id;
    newSkill.save();
    about.skills.push(newSkill);
    about.save(function(err){
      if(err){
        console.log(err);
        res.status(400).send(err);
      } else {
        res.send(newSkill);
      }
    });

  });

});

router.put('/skills/:id', auth.optional, function(req, res){
  const id = req.params.id;
  var errors = {};
  if(!req.body.name.length) {
    errors.name = 'This field cannot be empty';
  }
  if(!req.body.progress) {
    errors.progress = 'This field cannot be empty';
  } else
  if(req.body.progress > 100 || req.body.progress < 0) {
    errors.progress = 'Value must be greater than 0 and less or equal 100.'
  }
  if(Object.keys(errors).length) {
    res.status(400).send(errors);
    return;
  }

  Skill.findById(id, (err, skill) => {
    skill.update(req.body);
    res.send(skill);
  });
});

router.delete('/skills/:id', (req, res)=>{
  const id = req.params.id;
  Skill.findById(id, function(err, skill){
    if(err){
      res.send({'error': 'An error occured'});
    }
    if(skill){
      return skill.remove().then(function(){
        return res.send({success: true});
      });
    } else {
      return res.sendStatus(404);
    }
  });
});

module.exports = router;