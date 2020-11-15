const express = require('express')
const mongoose = require('mongoose')
const Question = require('./models/question')
const User = require('./models/user')
const Answer = require('./models/answer')
const methodOverride = require('method-override')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const config = require('./config/passport')
const { ensureAuthenticated } = require('./config/auth')
const app = express()
const questionsRouter = require('./routes/questions')

require('./config/passport')(passport)

mongoose.connect('mongodb://localhost:27017/questionApp', { 
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
});

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }))

app.use(methodOverride('_method'))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

app.get('/', ensureAuthenticated, async (req, res) => {
    const questions = await Question.find().sort({ createdAt: 'desc' })
    res.render('questions/index', {questions : questions, name: req.user.name })
});

app.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    })
    try {
        user = await user.save()
        req.flash('success_msg', 'You are now registered and can log in')
        res.redirect('questions/login')
    } catch (e) {
        res.render('questions/register')
    }
    console.log(user)
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/', 
        failureRedirect: 'questions/login',
        failureFlash: true
    })(req, res, next)
})

app.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/questions/login')
})

app.get('/answer/:id', async (req, res) => {
    const answer = await Answer.findById(req.params.id)
    res.render('questions/showanswer', { answer: answer })
})

app.post('/answer', async (req, res) => {
    console.log(req.body.questionId)
    let answer = new Answer({
        title: req.body.title,
        description: req.body.description,
        questionId: req.body.questionId
    })
    try {
        answer = await answer.save()
        res.redirect(`/answer/${ answer.id }`)
    } catch (e) {
        res.render('questions/answer', { answer: answer, questionId: req.body.questionId })
    }
    console.log(answer)
})

// Test data GET request 
//app.get('/', (req, res) => {
    //const questions = [{
        //title: 'Test Question',
        //createdAt: new Date(),
        //description: 'Test Description'
    //},
    //{
       //title: 'Test Question 2',
        //createdAt: new Date(),
        //description: 'Test Description 2'
    //}]
    //res.render('questions/index', {questions : questions})
//});

app.use('/questions', questionsRouter)

//setting up port
app.listen(3000);