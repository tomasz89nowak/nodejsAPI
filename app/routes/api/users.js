var User = require('../../models/user');
var auth = require('./../auth');
var upload = require('../../../config/uploadStorage');
require('../../../config/passport');
var passport = require('passport');
var router = require('express').Router();

router.get('/', auth.required, function(req, res){
  User.find(req.query, function(err, users){
    if(err){
      res.status(400).send({'error': 'An error occured'});
    }
    users.forEach(user => {
      user.salt = 'Not available';
      user.hash = 'Not available';
    });
    res.send(users);
  });
});

router.get('/:id', auth.required, function(req, res){
  const id = req.params.id;
  User.findById(id, function(err, user){
    if(err){
      res.status(400).send({'error': 'An error occured'});
    }

    user.salt = 'Not available';
    user.hash = 'Not available';

    res.send(user);
  });
});

router.post('/', auth.required, function(req, res){
  var newUser = new User();

  newUser.username = req.body.username;
  newUser.email = req.body.email;
  newUser.setPassword(req.body.password);

  newUser.save(function(err, user){
    if(err){
      res.status(400).send(err);
    }

    res.send(user);
  });
});

router.put('/:id', auth.required, function(req, res){
  const id = req.params.id;
  User.findById(id, function(err, user) {
    if (err) {
      res.status(400).send({'error': 'An error occured'});
    }
    user.username = req.body.username;
    user.email = req.body.email;
    if(!req.body.password) {
      res.status(400).send({errors: {password: 'To pole jest wymagane.'}});
      return;
    }
    user.setPassword(req.body.password);

    user.save(function(err, user){
      if(err){
        res.status(400).send(err);
      } else {
        res.send({username: user.username, email: user.email});
      }
    });
  });
});

router.post('/login', function(req, res, next){
  console.log(req.body)
  if(!req.body.user) return res.status(422).json({error:{credentials: 'Nie podano danych uwierzytelniających.'}});
  const errors = {};
  if(!req.body.user.email){
    errors.email = 'Podaj poprawny adres email.';
  }

  if(!req.body.user.password){
    errors.password = 'Podaj hasło.';
  }
  if(Object.keys(errors).length){
    return res.status(422).json({error: errors});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.post('/verify', auth.required, function(req, res){
//   User.find({token:req.body.token}, function(err, user){
//     if(err){
//       res.status(400).send({'error': 'An error occured'});
//     }
//
//     const userData = {
//       username: user.username,
//       email: user.email,
//       updatedAt: user.updatedAt,
//       createdAt: user.createdAt
//     };
// console.log(user)
//     res.send(userData);
//   });
  console.log(req.user)
});

module.exports = router;