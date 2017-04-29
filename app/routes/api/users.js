var User = require('../../models/user');
var auth = require('./../auth');
var upload = require('../../../config/uploadStorage');
require('../../../config/passport');
var passport = require('passport');
var router = require('express').Router();

router.get('/', auth.optional, function(req, res){
  User.find(req.query, function(err, users){
    if(err){
      res.status(400).send({'error': 'An error occured'});
    }

    res.send(users);
  });
});

router.post('/', auth.optional, function(req, res){
  let newUser = new User();

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
    console.log(user)
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

module.exports = router;