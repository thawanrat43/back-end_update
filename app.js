var express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
// const db  = require('../db.js')
// app.use(express.json());
require('dotenv').config()
// require('dotenv').config()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const multer = require('multer')
const { createProxyMiddleware } = require('http-proxy-middleware');
const mysql = require('mysql2');
// create the connection to database
// const connection = require('./db')
// const { process } = require('ipaddr.js');
const connection =mysql.createConnection(process.env.DATABASE_URL);
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'check_database'
// });
// const { result } = require('lodash');
// const router = express.Router();
// const morgan = require('morgan');
const path =require('path');

var session;
const upload = multer({dest: 'uploads/'});
// create application/json parser
app.use(cookieParser());
// parse application/json
// const whitelist = [ 'https://lambent-donut-b06776.netlify.app'];

// var corsOptions = {
//   credentials: true,
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// app.use(cors(corsOptions));
// app.use(cors());
// const API_URL ='http://localhost:3000'
// const proxyOptions = {
//   target: API_URL,
//   changeOrigin: true,
//   pathRewrite: {
//       [`^/api/posts`]: '/posts',
//   },
// }

// const proxy = createProxyMiddleware(proxyOptions);
// http://lambent-donut-b06776.netlify.app
// https://64f7ff2936356b307e42dcee--venerable-axolotl-d1d4fd.netlifye4s.app
app.use(cors({
  origin: ["https://64f99b4f4a4e9a5b938ce0dd--startling-narwhal-35864e.netlify.app","http://localhost:3000","https://64fe8726ea09c4201a237bf8--majestic-alfajores-9ccab9.netlify.app","https://650291076cfc3a12da215377--deft-gaufre-e9ad20.netlify.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
// const corsOptions ={
//     origin: ['https://64f5bb2ad019ec2e9a3744c9--grand-dolphin-262897.netlify.app/'], 
//     credentials:true,            
//     maxAge: 3600
// }
// app.use(cors(corsOptions));
// app.use(cors({
//   origin:"http://localhost:3000",
//   credentials :true
// }));
// var allowlist = ['http://example1.com', 'http://example2.com']
// var corsOptionsDelegate = function (req, callback) {
//   credentials :true
//   var corsOptions;
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }
// app.use(cors(corsOptionsDelegate))
// app.use((req,res,next)=>{
//   res.setHeader("Access-Control-Allow-Origin", "https://lambent-donut-b06776.netlify.app");
//   res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
//   res.setHeader("Access-Control-Max-Age", "3600");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Origin, Cache-Control, X-Requested-With");
//   res.setHeader("Access-Control-Allow-Credentials", "true");

//   next();
// })
// app.use(sessions({
//   secret : 'session_secret',
//   resave:false,
//   saveUninitialized : false,
//   cookie :{
//     secure:false,
//     maxAge : 1000*60*60*24
//   }
// }))
app.use(express.json())
app.use(express.static('uploads'));

// const Notlogin =(req,res ,next )=>{
//   if (!req.session.islogin){
//     return res.render('/login')
//   }
// }
// const Islogin =(req,res ,next )=>{
//   if (req.session.islogin){
//     return res.render('/home')
//   }
// }
// app.get('/',Notlogin, (req,res,next) => {
//   connection.execute('SELECT username FROM users WHERE id=?',[req.session.userid])
//     .than(([rows]) => {
//       res.render('profile'),{
//         name:rows[0].name
//       }
//     })
// })
// app.use("/api/login",loginRoutes);
app.get("/", (req, res) => {
  // server จะสามารถส่งทั้ง header ต่างๆหรือจะตัวหนังสือ json อะไรก็ได้กลับไป
  res.send("Hello World");
});
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });
app.post('/register', function (req, res, next) {
  const img = 'user-6820232_640.webp';
  const status = '1';
  const statusadmin = '';
  connection.query("SELECT username FROM users WHERE username = ?", [req.body.username], (err, data) => {
    if (err) return res.status(500).json("This username already exists.");
    if (data.length > 0) 
        return res.status(500).json("This username already exists.");
    else{
      connection.query("SELECT email FROM users WHERE email = ?", [req.body.email], (err, data) => {
        if (err) return res.status(500).json("This E-mail already exists.");
        if (data.length > 0) 
          return res.status(500).json("This E-mail already exists.");
        else{
          bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            connection.execute(
              'INSERT INTO users(email,password,fname,lname,username,phonenum,status,statusadmin,profilepic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [req.body.email, hash,req.body.fname,req.body.lname,req.body.username,req.body.phonenum,status,statusadmin,img],
              function(err, results, fields) {
                if (err) return res.status(500).json(err);
                return res.status(200).json("User has been created.");
    
    
              }
            );
          
          });
        }
        
      })
    }
    
    
  });
})

app.post('/login', function (req, res, next) {
  try{
    connection.query('SELECT * FROM users WHERE email=?',[req.body.email],
    function(err, users) {
      if(err) {
        return res.status(500).json("no user found");
       
      }
      if(users.length > 0){
          bcrypt.compare(req.body.password, users[0].password, function(err, islogin) { 
            if(err){
              console.log(req.body.password)
              return res.status(500).json('wrong password');
            }
            if(islogin) {
              const token = jwt.sign({ id :users[0].id},process.env.TOKEN_KEY,{expiresIn:"2h"});
              const status = users[0].status;
              console.log(status)
              return res.json({message:'login success',token,status})
            }else{
              return res.status(500).json('wrong password');
            }

          });
        }
      }
    )
  }catch(err){
    console.log(err);
    return res.status(500).send();
  }
  
})
app.get('/profile/:id',function (req, res, next) {
  const userid = req.params.id;
  
  try{
    connection.execute("SELECT username,lname,fname,email,phonenum,profilepic,id  FROM users WHERE id=? ",[userid],(err,data) =>  {
      if (err) return res.send(err);
      return res.json(data);
    })
  }catch(err){
    console.log(err);
    return res.status(500).send();
  }
})
app.post('/code/:id',function (req, res, next) {
  const userid = req.params.id; 
  const {oldpassword ,newpassword,conpassword} =req.body;
  try{
    connection.query("SELECT password FROM users WHERE id=? ",[userid],(err,data) =>  {
      if(data){ 
        bcrypt.compare(oldpassword,data[0].password, function(err,isPassword) { 
          if(err){
            return res.status(500).json('wrong password');
          }
          if(isPassword) {
            if(conpassword==newpassword){
              bcrypt.hash(newpassword, saltRounds, function(err, hash) {
                if(err){
                  return res.status(500).json('update error');
                }
                connection.query("UPDATE users SET password= ? WHERE id=? ",[hash,userid],(err,updatedata) =>  {
                  if (err) return res.send(err);
                  return res.json(updatedata);
                })
              })
            }
            else{
              return res.status(500).json('Password is not the same');
            }
            
            
          } 
          else{
            return res.status(500).json('wrong password');
          }
        })
      }
      else{
        return res.status(500).json('Error');
      }
    })
  }catch(err){
    console.log(err);
    return res.status(500).send();
  }
});

app.get('/image/:id',upload.single('file'),function (req, res, next) {
  const userid = req.params.id;
  
  try{
    connection.execute("SELECT profilepic FROM users WHERE id=? ",[userid],(err,data) =>  {
      if (err) return res.send(err);
      return res.json(data);
    })
  }catch(err){
    console.log(err);
    return res.status(500).send();
  }
})
// app.post('/profileupdatephonenum/:id',function (req, res, next) {
//   const userid = req.params.id;
//   try{
    
//   }catch(err){
//     console.log(err);
//     return res.status(500).send();
//   }
// })
app.post('/profileupdate/:id',function (req, res, next) {
  const userid = req.params.id;
  try{
    connection.execute("SELECT username FROM users WHERE username=? ",[req.body.username],(err,data) =>  {
          if (err) return res.send(err);
          if(data.length > 0){
            res.status(400).json('Username already exists!');
          }else{
            connection.query("UPDATE users SET username=?,fname=?,lname=?,phonenum=? WHERE id=? ",[req.body.username,req.body.fname,req.body.lname,req.body.phonenum,userid],(err,updatedata) =>  {
                if (err) return res.send(err);
                return res.json(updatedata);
            })
          }
    
        })
    // if(Object.keys(req.body.username).length > 0){
    //   connection.execute("SELECT username FROM users WHERE username=? ",[req.body.username],(err,data) =>  {
    //     if (err) return res.send(err);
    //     if(data.length > 0){
    //       res.status(400).json('Username already exists!');
    //     }else{
    //       connection.query("UPDATE users SET username=? WHERE id=? ",[req.body.username,userid],(err,updatedata) =>  {
    //           if (err) return res.send(err);
    //           return res.json(updatedata);
    //       })
    //     }
  
    //   })
    // }
    // if(Object.keys(req.body.fname).length > 0){
    //   connection.query("UPDATE users SET fname=? WHERE id=? ",[req.body.fname,userid],(err,updatedata) =>  {
    //     if (err) return res.send(err);
    //     return res.json(updatedata);
    //   })
    // }
    // if(Object.keys(req.body.phonenum).length > 0){
    //   connection.query("UPDATE users SET phonenum=? WHERE id=? ",[req.body.phonenum,userid],(err,updatedata) =>  {
    //     if (err) return res.send(err);
    //     return res.json(updatedata);
    //   })
    // }
    // if(Object.keys(req.body.lname).length > 0){
    //   connection.query("UPDATE users SET lname=? WHERE id=? ",[req.body.lname,userid],(err,updatedata) =>  {
    //     if (err) return res.send(err);
    //     return res.json(updatedata);
    //   })
    // }
  }catch(err){
    console.log(err);
    return res.status(500).send();
  }
})
// app.post('/profileupdatefname/:id',function (req, res, next) {
//   const userid = req.params.id;
//   try{
    
//   }catch(err){
//     console.log(err);
//     return res.status(500).send();
//   }
// })  
// app.post('/profileupdatelname/:id',function (req, res, next) {
//   const userid = req.params.id;
//   try{
    
//   }catch(err){
//     console.log(err);
//     return res.status(500).send();
//   }
// })  
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});
const uploads =multer({
  storage: storage
})
app.post('/updatepic/:id',uploads.single('file'),function (req, res, next){
  console.log(req.file)
  try {
      // code
      const userid = req.params.id
      connection.query("UPDATE users SET profilepic= ? WHERE id=? ",[req.file.filename,userid],(err,updatedata) =>  {
        if (err) return res.send(err);
        return res.json(updatedata);
      })
      // const updated = await Product
      //     .findOneAndUpdate({ _id: id }, newData, { new: true })
      //     .exec()

  } catch (err) {
      // error
      console.log(err)
      res.status(500).send('Server Error')
  }
})
// const verifyjwt = (req,res,next)=>{
//   const token = req.header["access-token"]
//   if (!token) return res.status(401).json("Not authenticated!");
//   else{
//     jwt.verify(token,process.env.TOKEN_KEY, (err, userInfo) => {
//       if (err) return res.status(403).json("Token is not valid!");
//       else{
//         req.userid = userInfo.id;
//         next();
//       }
//     })
//   }
  
// }
app.get('/token',  function (req, res, next) {
  try{
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json("Not authenticated!");
    jwt.verify(token,process.env.TOKEN_KEY, (err, usertoken) => {
      if (err) return res.status(403).json("Token is not valid!");
      else{
        res.json(usertoken)
      }
    })
  }catch{
    res.status(500).send('Server token Error')
  }
  
})

app.get('/profileid',  function (req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json("Not authenticated!");
  jwt.verify(token,process.env.TOKEN_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    else{
      connection.query("SELECT * FROM users WHERE id = ?", [userInfo.id], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      })
     
    }
  })
})
app.post('/home', function (req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(500).json("Not authenticated!");
  }
  else{
    jwt.verify(token,process.env.TOKEN_KEY, (err, userInfo) => {
      if (err) return res.status(500).json("Token is not valid!");
      else{
        const pay_id = 'ยังไม่ชำระเงิน';
        connection.query("SELECT * FROM users WHERE id = ?", [userInfo.id], (err, data) => {
          if (err) return res.status(500).send(err);
          else{
            connection.execute("INSERT INTO history(fname,lname,idcard,userid,type_id,criminal,bankrupt,credit,penalty,global,other_text,pay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [req.body.fname,req.body.lname,req.body.idcard,data[0].id,req.body.type_id,req.body.criminal,req.body.bankrupt,req.body.credit,req.body.penalty,req.body.global,req.body.other_text,pay_id],
              function(err, results, fields) {
                if(err) {
                  res.json({status:'error',message:err})
                  return
                }
                else{
                  return res.json(results);
                }
                  
              }
              
            )
              
           
          }
        })
        
       
      }
    })
  }
  
})
app.post('/idhistory',function (req, res, next){
  try {
      
      connection.query("SELECT * FROM history WHERE fname = ? AND lname = ? " ,[req.body.fname,req.body.lname],(err,deletedata) =>  {
        if (err) return res.send(err);
        return res.json(deletedata);
      })

  } catch (err) {
      // error
      console.log(err)
      res.status(500).send('Server Error')
  }
})
app.post('/homes/:id', function (req, res, next) {
  const userid = req.params.id;
  connection.execute("INSERT INTO history(fname,lname,userid) VALUES (?)",
  [req.body.fname,req.body.lname,userid],
      function(err, results, fields) {
        if(err) {
          res.json({status:'error',message:err})
          return
        }
        return res.json(results);
      }
  )
})
app.post('/adminregister', function (req, res, next) {
  const img = 'user-6820232_640.webp';
  connection.query("SELECT username FROM users WHERE username = ?", [req.body.username], (err, data) => {
    if (err) return res.status(500).json("This username already exists.");
    if (data.length > 0) 
        return res.status(500).json("This username already exists.");
    else{
      connection.query("SELECT email FROM users WHERE email = ?", [req.body.email], (err, data) => {
        if (err) return res.status(500).json("This E-mail already exists.");
        if (data.length > 0) 
          return res.status(500).json("This E-mail already exists.");
        else{
          bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            connection.execute(
              'INSERT INTO users(email,password,fname,lname,username,phonenum,status,statusadmin,profilepic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [req.body.email, hash,req.body.fname,req.body.lname,req.body.username,req.body.phonenum,req.body.status,req.body.statusadmin,img],
              function(err, results, fields) {
                if (err) return res.status(500).json(err);
                return res.status(200).json("User has been created.");
    
    
              }
            );
          
          });
        }
        
      })
    }
    
    
  });
  
  
})
app.get('/adminuser',function (req,res,next){
  try{
    connection.execute("SELECT username,lname,fname,email,phonenum,profilepic,id,status  FROM users",(err,data) =>  {
      if (err) return res.send(err);
      return res.json(data);
    })
  }catch(err){
    console.log(err);
    return res.status(500).send();
  }
})

app.post('/admindelete/:id',function (req, res, next){
  try {
      const userid =req.params.id;
      connection.query("DELETE FROM users WHERE `id`=? ",[userid],(err,deletedata) =>  {
        if (err) return res.send(err);
        return res.json(deletedata);
      })

  } catch (err) {
      // error
      console.log(err)
      res.status(500).send('Server Error')
  }
})

app.get('/pagestatus/:id',upload.single('file'),function (req, res, next) {
  const userid = req.params.id;
  
  try{
    connection.execute("SELECT lname,fname,type_id,pay,idcard,idhistory  FROM history WHERE userid=? ",[userid],(err,data) =>  {
      if (err) return res.send(err);
      return res.json(data);
    })
  }catch(err){
    console.log(err);
    return res.status(500).send();
  }
})

app.post('/adminhistory/:id', function (req, res, next) {
  const userid = req.params.id;
  connection.execute("INSERT INTO historydetails(id,birthday,father,mother,religion,criminal,bankrupt,credit,penalty,global,other) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  [userid,req.body.birthday,req.body.father,req.body.mother,req.body.religion,req.body.criminal,req.body.bankrupt,req.body.credit,req.body.penalty,req.body.global,req.body.other],
      function(err, results, fields) {
        if(err) {
          res.json({status:'error',message:err})
          return
        }
        return res.json(results);
      }
  )
})
app.get('/historyselect/:id',function (req, res, next) {
  const userid = req.params.id;
  
  try{
    connection.execute("SELECT criminal,bankrupt,credit,penalty,global,other_text FROM history WHERE idhistory=? ",[userid],(err,data) =>  {
      if (err) return res.send(err);
      return res.json(data);
    })
  }catch(err){
    console.log(err);
    return res.status(500).send();
  }
})

app.post('/pay/:id',function (req, res, next){
  const statuspay ="กำลังตรวจสอบการชำระเงิน";
  try {
 
      const userid = req.params.id
      connection.query("UPDATE history SET pay= ? WHERE idhistory=? ",[statuspay,userid],(err,updatedata) =>  {
        if (err) return res.send(err);
        return res.json(updatedata);
      })
  } catch (err) {
      // error
      console.log(err)
      res.status(500).send('Server Error')
  }
})
app.get('/finish/:id',function (req, res, next) {
  const userid = req.params.id;
  
  try{
    connection.execute("SELECT pay FROM history WHERE idhistory=? ",[userid],(err,data) =>  {
      if (err) return res.send(err);
      return res.json(data);
    })
  }catch(err){
    console.log(err);
    return res.status(500).send();
  }
})
app.get('/historydetail/:id',function (req, res, next) {
  const userid = req.params.id;
  try{
    connection.execute("SELECT birthday,father,mother,religion,criminal,bankrupt,credit,penalty,global,other FROM historydetails WHERE id=? ",[userid],(err,data) =>  {
      if (err) return res.send(err);
      return res.json(data);
    })
  }catch(err){
    console.log(err);
    return res.status(500).send();
  }
})
app.get('/history/:id',upload.single('file'),function (req, res, next) {
  const userid = req.params.id;
  
  try{
    connection.execute("SELECT lname,fname,type_id,idcard,pay  FROM history WHERE idhistory=? ",[userid],(err,data) =>  {
      if (err) return res.send(err);
      return res.json(data);
    })
  }catch(err){
    console.log(err);
    return res.status(500).send();
  }
})
app.get('/profilehistory/:id',function (req, res, next) {
  const userid = req.params.id;
  try{
    connection.execute("SELECT userid FROM history WHERE idhistory=? ",[userid],(err,data) =>  {
      if (err) return res.send(err);
      
      else{
        connection.query("SELECT * FROM users WHERE id = ?", [data[0].userid], (err,paydata) => {
          if (err) return res.send(err);
          return res.json(paydata);
        })
      }
      
      
    })
  }catch(err){
    console.log(err);
    return res.status(500).send();
  }
})

// const checkcookie = (req, res, next) => {
//   const token = req.cookies.access_token;
//   if (!token) {
//     return res.sendStatus(403);
//   }
//   try {
//     const data = jwt.verify(token, "YOUR_SECRET_KEY");
//     req.userId = data.id;
//     req.userRole = data.role;
//     return next();
//   } catch {
//     return res.sendStatus(403);
//   }
// };
// app.get("/setCookies",(req, res) => {
//   return res.json({ user: { id: req.useId, role: req.userRole} });
//   // const token = 'seentoken'
//   // console.log(token);
//   //   res.cookie('jwt', token, {
//   //   expires: new Date(Date.now() +50000),
//   //   ttpOnly: true,
//   //               //secure :true,
//   //   });
//   // console.log(req.cookies.jwt);

//   // res.end();
// });
app.post('/paystatus/:id',function (req, res, next){
  try {
      const userid = req.params.id
      connection.query("UPDATE history SET pay= ? WHERE idhistory=? ",[req.body.pay,userid],(err,updatedata) =>  {
        if (err) return res.send(err);
        return res.json(updatedata);
      })
  } catch (err) {
      // error
      console.log(err)
      res.status(500).send('Server Error')
  }
})


// app.listen(process.env.PROST || 3000)
app.listen(3333,()=>{
  console.log("server start")
})
