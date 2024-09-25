import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import multer from 'multer';
import { User } from './Models/user.js';
import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
   cloud_name: 'dnirsaiug',
   api_key: '526776463916933',
   api_secret: 'PEAZhnHPh3yUHR3ga6q-Uqy4AOk' // Click 'View API Keys' above to copy your API secret
});

const app = express();

app.use(express.urlencoded({ extended: true }))

const storage = multer.diskStorage({
   destination: "./public/uploads",
   filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
   }
})

const upload = multer({ storage: storage })

const port = 1000;

// Home route = Login page
app.get('/', (req, res) => {
   res.render("login.ejs")
})

// login user
app.post('/login', async (req, res) => {
   const { email, password } = req.body
   try {
      let user = await User.findOne({ email });
      console.log("getting user", user)
      if (!user) res.render("login.ejs", { msg: "User not registerd" });
      else if (user.password != password) {
         res.render("login.ejs", { msg: "incorrect password" });
      }
      else {
         res.render("profile.ejs", { user });
      }
   } catch (error) {
      res.send("error occured")
   }
})

// route to Register page
app.get('/register', (req, res) => {
   res.render("register.ejs")
})

// route to users page
app.post('/register', upload.single('file'), async (req, res) => {
   const file = req.file.path
   const { name, email, password } = req.body

   try {
      const cloudinaryRes = await cloudinary.uploader.upload(file, {
         folder: 'NodeJs_Authantication_App'
      });

      let user = await User.create({
         imgUrl: cloudinaryRes.secure_url,
         name, email, password
      })

      res.redirect("/")

      console.log(cloudinaryRes, name, email, password)

   } catch (error) {
      res.send("Error occured")
   }
})

// route to all users
app.get('/users', async (req, res) => {
   let users = await User.find().sort({createdAt: -1});
   res.render("users.ejs", { users })
})


mongoose.connect("mongodb+srv://akshaykumarsahu206:5phdqYDbdEwaLBxo@cluster0.8mw3f.mongodb.net/",
   {
      "dbName": "Auth_Project"
   }
).then(() => console.log("MongoDB Connected"))
   .catch((error) => console.log(error));

app.listen(port, () => console.log(`server is running on port ${port}`))