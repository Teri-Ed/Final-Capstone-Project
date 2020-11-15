const express = require('express')
const Question = require('./../models/question')
const Answer = require('./../models/answer')
const User = require('./../models/user') 
const { ensureAuthenticated } = require('../config/auth')
const router = express.Router()

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('questions/new', { question: new Question(), name: req.user.name })
})

router.get('/answer', ensureAuthenticated, (req, res) => {
    res.render('questions/answer', { answer: new Answer(), name: req.user.name, questionId: req.query.questionId })
})

router.get('/login', (req, res) => {
    res.render('questions/login')
});

router.get('/register', (req, res) => {
    res.render('questions/register')
});

//router.get('/:id', (req, res) => {
    //res.send(req.params.id)
//})

router.get('/:slug', ensureAuthenticated, async (req, res) => {
    const question = await Question.findOne({ slug: req.params.slug })
    const answers = await Answer.find({ questionId: question._id })
    console.log(answers);
    if (question == null) res.redirect('/')
    res.render('questions/show', { question: question, name: req.user.name, answers: answers })
})

router.post('/', async (req, res) => {
    let question = new Question({
        title: req.body.title,
        description: req.body.description,
    })
    try {
        question = await question.save()
        res.redirect(`questions/${question.slug}`)
    } catch (e) {
        res.render('questions/new', { question: question })
    }
})

router.delete('/:id', async (req, res) => {
    await Question.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

module.exports = router