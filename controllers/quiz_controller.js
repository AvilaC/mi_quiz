var models = require('../models/models.js');

exports.load = function(req,res, next, quizId){
	models.Quiz.find(quizId).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		}else {
			next(new Error('No existe el quizId '+quizId));
		}
	}).catch(function(error){next(error)});
};

exports.index = function(req, res){
//	if(req.query.search) {
//		models.Quiz.findAll({where:["pregunta like ?", '%' + req.query.search + '%'], order:'pregunta ASC'})
	if (req.param('search')) {
        var texto_a_buscar = '%' + req.param('search').replace(/ /g, "%") + '%';
        models.Quiz.findAll({where: ['pregunta like ?', texto_a_buscar], order:'pregunta ASC'})	
		.then(function(quizes) { 
			res.render('quizes/busqueda', {quizes: quizes, errors:[]});
		}).catch(function(error) {next(error);});
	} else {
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes', {quizes: quizes, errors:[]});
		}).catch(function(error) { next(error);});
	}	
};

exports.show = function(req, res) {
        res.render('quizes/show', {quiz: req.quiz, errors:[]});
};

exports.answer = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta === req.quiz.respuesta) {
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto', errors:[]});
		}else {
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto', errors:[]});
		}
	})
};

exports.new = function(req,res) {
	var quiz = models.Quiz.build(
		{pregunta: 'Pregunta', respuesta: 'Respuesta', tematica: 'Tema'}
	);
	res.render('quizes/new', {quiz: quiz, errors:[]});
};

exports.create = function(req, res) {
    var quiz = models.Quiz.build( req.body.quiz );
    quiz
    .validate()
    .then(
        function(err){
            if (err) {
                res.render('quizes/new', {quiz: quiz, errors: err.errors});
            } else {
                quiz 
                .save({fields: ["pregunta", "respuesta", "tematica"]})
                .then( function(){ res.redirect('/quizes')}) 
            }      
        }
    ).catch(function(error){next(error)});
};

exports.edit = function(req,res) {
    var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors:[]});
};

exports.update = function(req, res) {
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tematica =  req.body.quiz.tematica;
	req.quiz
	.validate()
	.then(
		function(err){
		    if (err) {
			    res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		    } else {
			    req.quiz
			    .save( {fields: ["pregunta", "respuesta", "tematica"]})
			    .then( function(){ res.redirect('/quizes');});
		    }
		}
	).catch(function(error){next(error)});
};

exports.destroy = function(req, res) {
    req.quiz.destroy().then( function() {
        res.redirect('/quizes');
    }).catch(function(error){next(error)});
};

exports.author=function(req, res){	
	res.render('author', { creditos: "Autor: J. Ávila", errors:[]});
};