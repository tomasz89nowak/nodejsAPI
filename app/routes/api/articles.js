var Article = require('../../models/article');
var auth = require('./../auth');
var upload = require('../../../config/uploadStorage');
var router = require('express').Router();


router.get('/', auth.optional, (req, res)=>{
  Article.find(req.query, (err, articles) => {
    const arts = articles.map(art => {
      art.content = '';
      return art;
    });
    if(err){
      res.send({'error': 'An error occured'});
    }

    res.send(arts);
  });
});

router.get('/:id', (req, res)=>{
  const id = req.params.id;
  Article.findById(id, function(err, article){
    if(err){
      res.send({'error': 'An error occured'});
    }

    res.send(article || {error:'There is no item that matches given ID'});
  });
});

router.delete('/:id', (req, res)=>{
  const id = req.params.id;
  Article.findById(id, function(err, article){
    if(err){
      res.send({'error': 'An error occured'});
    }

    res.send('Article ' + id + ' deleted!');
  });
});

router.post('/', auth.optional, upload.single('image'), (req, res) => {
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
  const newArticle = new Article(Object.assign({}, req.body, {image: file}));

  newArticle.save(function(err, note){
    if(err){
      console.log(err);
      res.send(err);
    }

    res.send(note);
  });
});

router.put('/:id', upload.single('image'), (req, res) => {
  const id = req.params.id;

  Article.findById(id, function(err, note){
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

    note.update(req.body, file);
    res.send(note);
  });
});

module.exports = router;