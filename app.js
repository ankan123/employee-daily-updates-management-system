const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();
const router = express.Router();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/key').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/admin',require('./routes/index.js'));

const worker = require('./models/worker');
const goal = require('./models/goal');
const User = require('./models/User');

//adding daily input details for given Emp-ID
app.post('/contact',function(req,res){	
const {empId,orderNo,Product,Window,Activity,date,windowPerNet,time}=req.body;
const newWorker = new worker({empId,orderNo,Product,Window,Activity,date,windowPerNet,time});
newWorker.save((err,newUser)=>{
if(err) throw err;
res.render('thankyou', {       //displaying the input details in a page
     user: req.body
          });
    });
});


//adding admin goal's 
app.post('/goals',function(req,res){   
          const {product,activity,standardDays,standardRate}=req.body;
          const newGoal = new goal({product,activity,standardDays,standardRate});
           newGoal.save((err,newGoal)=>{
             if(err) throw err;
             res.render('goalsubmit',{submit:req.body}); //displaying the submitted goal
           });
     });

//route for removing a particular employee daily input
app.get('/admin/:id',(req,res)=>{
  worker.findByIdAndRemove(req.params.id,function(err,result){
        if(err) throw err;
        else
        res.redirect('display');  //displaying the daily details page after deletion
      })
  })

//route for editing daily input for a particuilar employee input
  app.get('/:id',(req,res)=>{ 
     let id = req.params.id;  
      res.render('editdashboard',{query:id}); //rendering daily input form page
    })
 
//updating the daily input after submission of the form    
    app.post('/employeeEdit',(req,res)=>{
    worker.findOneAndUpdate({_id:req.body.id},req.body,{new:true},(err)=>{
    if(err) throw err
    res.render('editThankyou',{user:req.body}) //rendering the updated daily input page
          })
  })
 

const PORT = process.env.PORT || 8084;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
