var models = require('../models/models.js');

exports.load = function(req,res, next, quizId){
	models.Quiz.find(quizId).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		}else {
			next(new Error('No existe el quizId '+quizId));
		}
	}).catch(function(error){next(Error)});
};

exports.index = function(req, res) {
	models.Quiz.findAll().then(function(quizes) {
        res.render('quizes', {quizes: quizes});
	})
};

exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
        res.render('quizes/show', {quiz: req.quiz});
	})
};

exports.answer = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta === req.quiz.respuesta) {
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto'});
		}else {
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto'});
		}
	})
};
							   
exports.author=function(req, res){	
	res.render('author', { creditos: "Autor: J. Ávila"});
};