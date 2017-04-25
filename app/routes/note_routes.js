var ObjectID = require('mongodb').ObjectID;

var multer  = require('multer');
var Note = require('../models/note');
var Article = require('../models/article');

var storage = multer.diskStorage({
  destination: 'uploads',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

var upload = multer({storage:storage});

module.exports = function(app, db) {

  app.get('/notes', (req, res)=>{
    // db.collection('notes').find().toArray((err, items) => {
    //   if(err){
    //     res.send({'error': 'An error occured'});
    //   } else {
    //     res.send(items);
    //   }
    // })

    Note.find(req.query, (err, notes) => {
        if(err){
          res.send({'error': 'An error occured'});
        }

        res.send(notes);
    });
  });

  app.get('/notes/:id', (req, res)=>{
    const id = req.params.id;
    Note.findById(id, function(err, note){
      if(err){
        res.send({'error': 'An error occured'});
      }

      res.send(note || {error:'There is no item that matches given ID'});
    });

    // const id = req.params.id;
    // if(id.length !== 12 && id.length !== 24){
    //   res.send('ID must have 12 or 24 characters!');
    // }
    // const details = {'_id': new ObjectID(id)};
    // db.collection('notes').findOne(details, (err, item) => {
    //   if(err){
    //     res.send({'error': 'An error occured'});
    //   } else {
    //     res.send(item || {error:'There is no item that matches given ID'});
    //   }
    // })
  });

    app.delete('/notes/:id', (req, res)=>{
      const id = req.params.id;
      Note.findById(id, function(err, note){
        if(err){
          res.send({'error': 'An error occured'});
        }

        res.send('Note ' + id + ' deleted!');
      });

    // const id = req.params.id;
    // const details = {'_id': new ObjectID(id)};
    // db.collection('notes').remove(details, (err, item) => {
    //   if(err){
    //     res.send({'error': 'An error occured'});
    //   } else {
    //     res.send('Item ' + id + ' deleted!');
    //   }
    // })
  });

  app.post('/notes', upload.single('image'), (req, res) => {
    let file = null;
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
    const newNote = new Note(Object.assign({}, req.body, {image: file}));

    newNote.save(function(err, note){
      if(err){
        console.log(err);
        res.send(err);
      }

      res.send(note);
    });
  });

  // app.post('/notes', upload.single('file'), (req, res) => {
  //   let file = null;
  //   if(req.file){
  //     file = {
  //       name: req.file.filename,
  //       size: req.file.size,
  //       path: req.file.path,
  //       type: req.file.mimetype
  //     };
  //
  //     if(file && file.size > 1048576){ // 1 MB
  //       res.send({error: {file: `File is too large, it has ${(file.size / 1048576).toFixed(2)} MB! Make sure that file is smaller than 1 MB.`}});
  //     }
  //   }
  //   const note = {text: req.body.body, title: req.body.title, file};
  //   console.log(req.file)
  //   db.collection('notes').insert(note, (err, result)=>{
  //     if(err){
  //       res.send({'error':'An error has occured.'});
  //     } else {
  //       res.send(result.ops[0]);
  //     }
  //   })
  // });

  app.put('/notes/:id', upload.single('image'), (req, res) => {
    const id = req.params.id;

    Note.findById(id, function(err, note){
      if(err){
        res.send(err);
      }

      let file = null;
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

      Object.assign(note, req.body, {image: file});
      note.save();
      res.send(note);
    });
    // const details = { '_id': new ObjectID(id) };
    // const note = { text: req.body.body, title: req.body.title };
    // db.collection('notes').update(details, note, (err, result) => {
    //   if (err) {
    //     res.send({'error':'An error has occurred'});
    //   } else {
    //     res.send(note);
    //   }
    // });
  });
};