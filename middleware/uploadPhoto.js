/*
var user = require('models/user').User;

module.exports = function(req,res){
  user.findById(req.param('id'), function(err, user){
      console.log(req.files);
      if(req.files.file){
          const fs = require('fs');
          fs.readFile(req.files.file.path, function(dataErr, data){
              if(data){
                  user.local.photo = '';
                  user.local.photo = data;
                  user.save(function(saveErr,saveUser){
                      if(saveErr){
                          throw saveErr;
                      }
                      res.json(HttpStatus.OK, saveUser);
                  })
              }
          });
          return;
      }
      res.json(HttpStatus.BAD_REQUEST,{error: "Error in file upload"});
  })
};*/
