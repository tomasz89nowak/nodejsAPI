var Note = require('../../models/note');
var auth = require('./../auth');
var upload = require('../../../config/uploadStorage');
var router = require('express').Router();


  router.get('/', auth.optional, (req, res)=>{
    Note.find(req.query, (err, notes) => {
        if(err){
          res.send({'error': 'An error occured'});
        }

        res.send(notes);
    });
  });

  router.get('/:id', (req, res)=>{
    var id = req.params.id;
    Note.findById(id, function(err, note){
      if(err){
        res.send({'error': 'An error occured'});
      }

      res.send(note || {error:'There is no item that matches given ID'});
    });
  });

    router.delete('/:id', (req, res)=>{
      var id = req.params.id;
      Note.findById(id, function(err, note){
        if(err){
          res.send({'error': 'An error occured'});
        }

        res.send('Note ' + id + ' deleted!');
      });
  });

  router.post('/', auth.optional, upload.single('image'), (req, res) => {
    var file = null;
    if(req.file){
      file = {
        name: req.file.filename,
        size: req.file.size,
        path: req.file.path,
        type: req.file.mimetype
      };

      if(file && file.size > 1048576){ // 1 MB
        res.send({error: {file: `File is too large, it has ${(file.size / 1048576).toFixed(2)} MB! Make sure that file is smaller than 1 MB.`}});
      }
    }
    var newNote = new Note(Object.assign({}, req.body, {image: file}));

    newNote.save(function(err, note){
      if(err){
        console.log(err);
        res.send(err);
      }

      res.send(note);
    });
  });

  router.put('/:id', upload.single('image'), (req, res) => {
    var id = req.params.id;

    Note.findById(id, function(err, note){
      if(err){
        res.send(err);
      }

      var file = null;
      if(req.file){
        file = {
          name: req.file.filename,
          size: req.file.size,
          path: req.file.path,
          type: req.file.mimetype
        };

        if(file && file.size > 1048576){ // 1 MB
          res.send({error: {file: `File is too large, it has ${(file.size / 1048576).toFixed(2)} MB! Make sure that file is smaller than 1 MB.`}});
        }
      }

      note.update(req.body, file);
      res.send(note);
    });
  });

module.exports = router;