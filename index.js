import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Blog from './models/blogs.js';
import Users from './models/user.js';

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home Route - Displays all blogs and the blog submission form
app.get('/', async (req, res) => {
  const all_blogs = await Blog.find();
  res.render('index.ejs', { blogs: all_blogs });
});

// Category Filter Route - Filters blogs by selected category
app.get('/category', async (req, res) => {
  const category = req.query.category; // Category passed as a query parameter

  if (category&& category!=='All') {
    try {
      // Find blogs with the selected category
      const filteredBlogs = await Blog.find({ category: category });
      res.render('index.ejs', { blogs: filteredBlogs, category: category });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching blogs by category');
    }
  } else {
    // If no category is selected, display all blogs
    const all_blogs = await Blog.find();
    res.render('index.ejs', { blogs: all_blogs });
  }
});

app.get('/addblog',(req,res)=> {
  res.render('addblog.ejs');
});

app.get('/login',(req,res)=>{
  res.render('login.ejs')
  
})
app.get('/register',(req,res)=>{
  res.render('register.ejs')
}
);

app.post('/login',async (req,res)=>{
  console.log(req.body.username,req.body.password);
  const user=req.body.username
  const password=req.body.password

  const result=await Users.findOne({username:user})
  if(result){
      if(result.password===password){
        res.redirect('/')
      }
      else{
        res.redirect('/login')
      }
    }
      else{
        res.redirect('/register')
      }
  
  console.log(result);

})


app.post('/register',async (req,res)=>{
  console.log(req.body.username,req.body.password);
  const user=req.body.username
  const password=req.body.password

  const result=await Users.findOne({username:user})
  if(result){
      res.redirect('/register')
      }
      else{
        const newUser=await Users.insertOne({username:user,password:password})
        res.redirect('/login')
      }
  
  


})

// Submit Route - Handles the submission of new blog
app.post('/submit', async (req, res) => {
  const { title, content, category } = req.body;
  const newBlog = new Blog({ title, content, category });
  await newBlog.save();
  res.redirect('/');
});

// View Single Blog - Displays full content of a single blog
app.get('/blog/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render('blogDetail.ejs', { blog });
});

// Edit Blog - Displays the blog edit form
app.get('/edit/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render('editBlog.ejs', { blog });
});

// Update Blog - Handles the form submission for editing a blog
app.post('/edit/:id', async (req, res) => {
  const { title, content, category } = req.body;
  await Blog.findByIdAndUpdate(req.params.id, { title, content, category });
  res.redirect('/');
});

// Delete Blog - Deletes a blog
app.post('/delete/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
