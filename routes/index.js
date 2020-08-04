const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const worker = require('../models/worker');
const goal = require('../models/goal');
var User = require('../models/User');

const db = require('../config/key').mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


var app = express();


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));
//admin page
router.get('/admin', forwardAuthenticated, (req, res) => res.render('admin'));
//goals page
router.get('/goal', forwardAuthenticated, (req, res) => res.render('goal'));



//employee daily input display
 router.get('/display', forwardAuthenticated, (req, res) =>{
   worker.find({},function (err, result) {
     if (err) {
        console.log(err);
      } else if (result.length) {
        res.render('display',{collection:result});
      } else {
       res.render('noDocument');
      }     
   })
 });

 //display employee daily input date-wise
router.post('/empdisplay',function(req,res){
  const d = req.body.date;
  worker.find({date:d},function(err,result){
    if(err) throw err;
    else if(result.length){
      res.render('display',{collection:result});
    }
      else{
       res.render('noworkerinput');
      }   
    });
});


//admin's goal display
router.get('/displaygoal',forwardAuthenticated,(req,res)=>{
  goal.find({},function (err, result) {
    if (err) {
       console.log(err);
     } else if (result.length) {
       res.render('dispGoal',{collection:result});
     } else {
      res.render('noDocument');
     }
    })
  });
//deleting goals and rendering goals page for displaying 
 router.get('/goal/:id',(req,res)=>{
    goal.findByIdAndRemove(req.params.id,function(err,result){
          if(err) throw err;
          else
          res.redirect('/admin/displaygoal')
        })
    })
//editing a goal ,render edit goals page
router.get('/goalEdit/:id',(req,res)=>{
  let id = req.params.id;  
      res.render('editGoal',{query:id}); 
})
//displaying the goals page after updating a particular goal
router.post('/goalsEdit',(req,res)=>{
  goal.findOneAndUpdate({_id:req.body.id},req.body,{new:true},(err)=>{
  if(err) throw err
  res.redirect('/admin/displaygoal')
        })
})

//displaying all registered employee's 
  router.get('/displayUser',forwardAuthenticated,(req,res)=>{
    User.find({},function(err,result){
     if(err){
       console.log(err);
     } else if(result.length){
       res.render('dispUser',{ collection:result});
     }else{
       console.log('no document(s) found');
     }
   })
  });

  //deleting an employee route
  router.get('/userDelete/:id',(req,res)=>{
  User.findByIdAndRemove(req.params.id,(err)=>{
   if(err) throw err;
   else
   res.redirect('/admin/displayUser')
      })
  })

  //incentive first page 
router.get('/admin/Incentive', forwardAuthenticated, (req, res)=>{
  res.render('incentive')
});
//incentive page (employee-wise)
router.post('/admin/userIncentive',function(req,res){
  const emp = req.body.emp;
  User.find({workerid:emp},function(err,result){
    if(err) throw err;
    else if(result.length)
    res.render('userIncentive',{collection:result})
    else
    res.render('noIncentive')
  })
  });
  

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard',{user: req.user })
);

module.exports = router;
