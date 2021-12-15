const express = require('express');
const chalk = require('chalk');
const path = require('path');
const debug = require('debug')('app:loginRoutes');
const morgan = require('morgan');
const sql = require('mssql');

const signUpRouter = express.Router();

signUpRouter.get('/sign_up_staff', function(req, res){
    res.render('sign_up_staff', 
    {
        nav:[
            {link: '/', title: 'Home'},
            {link: '/login_staff', title: 'Log In Staff'},
            {link: '/sign_up_staff', title: 'Sign Up Staff'},
            {link: '/portal_staff', title: 'Portal Staff'},
            {link: '/login_students', title: 'Log In Students'},
            {link: '/sign_up_students', title: 'Sign Up Students'},
            {link: '/portal_students', title: 'Portal Students'}
        ],
        title: 'Sign Up',
        
    })
})

signUpRouter.get('/sign_up_students', function(req, res){
    res.render('sign_up_students', 
    {
        nav:[
            {link: '/', title: 'Home'},
            {link: '/login_staff', title: 'Log In Staff'},
            {link: '/sign_up_staff', title: 'Sign Up Staff'},
            {link: '/portal_staff', title: 'Portal Staff'},
            {link: '/login_students', title: 'Log In Students'},
            {link: '/sign_up_students', title: 'Sign Up Students'},
            {link: '/portal_students', title: 'Portal Students'}
        ],
        title: 'Sign Up',
        
    })
})
signUpRouter.post("/sign_up_students", function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.firstname;
    var email = req.body.email;
    var pwd = req.body.password1;
    var confirmPassword = req.body.password2;
    var is_staff;
    if (pwd == confirmPassword) {
    //var data = {name: name, email: email, password: pwd};
   
    const transaction = new sql.Transaction(/* [pool] */);
    transaction.begin(err => {
    // ... error checks

        const request = new sql.Request(transaction)
        request.input('firstname', sql.VarChar, firstname);
        request.input('lastname', sql.VarChar, lastname);
        request.input('email', sql.VarChar, email);
        request.input('pwd', sql.VarChar, pwd);
        request.query('insert into Students (first_name, last_name, password, email) values (@firstname, @lastname, @pwd, @email)', (err, result) => {
        // ... error checks

            transaction.commit(err => {
            // ... error checks

                debug("Transaction committed.")
            })
        })
    })

    res.render('login_students',
    {
        nav:[
            {link: '/', title: 'Home'},
            {link: '/login_staff', title: 'Log In Staff'},
            {link: '/sign_up_staff', title: 'Sign Up Staff'},
            {link: '/portal_staff', title: 'Portal Staff'},
            {link: '/login_students', title: 'Log In Students'},
            {link: '/sign_up_students', title: 'Sign Up Students'},
            {link: '/portal_students', title: 'Portal Students'}
        ],
        title: 'Log In'
        });
    }
    else {
    res.render('sign_up_students', {
        nav:[
            {link: '/', title: 'Home'},
            {link: '/login_staff', title: 'Log In Staff'},
            {link: '/sign_up_staff', title: 'Sign Up Staff'},
            {link: '/portal_staff', title: 'Portal Staff'},
            {link: '/login_students', title: 'Log In Students'},
            {link: '/sign_up_students', title: 'Sign Up Students'},
            {link: '/portal_students', title: 'Portal Students'}
        ],
        title: 'Sign Up' 
        });
    }
});

signUpRouter.post("/sign_up_staff", function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.firstname;
    var email = req.body.email;
    var pwd = req.body.password1;
    var confirmPassword = req.body.password2;
    var is_staff;
    if (pwd == confirmPassword) {
    //var data = {name: name, email: email, password: pwd};
   
    const transaction = new sql.Transaction(/* [pool] */);
    transaction.begin(err => {
    // ... error checks

        const request = new sql.Request(transaction)
        request.input('firstname', sql.VarChar, firstname);
        request.input('lastname', sql.VarChar, lastname);
        request.input('email', sql.VarChar, email);
        request.input('pwd', sql.VarChar, pwd);
        request.query('insert into staff (first_name, last_name, password, email) values (@firstname, @lastname, @pwd, @email)', (err, result) => {
        // ... error checks

            transaction.commit(err => {
            // ... error checks

                debug("Transaction committed.")
            })
        })
    })

    res.render('login_staff',
    {
        nav:[
            {link: '/', title: 'Home'},
            {link: '/login_staff', title: 'Log In Staff'},
            {link: '/sign_up_staff', title: 'Sign Up Staff'},
            {link: '/portal_staff', title: 'Portal Staff'},
            {link: '/login_students', title: 'Log In Students'},
            {link: '/sign_up_students', title: 'Sign Up Students'},
            {link: '/portal_students', title: 'Portal Students'}
        ],
        title: 'Log In'
        });
    }
    else {
    res.render('sign_up_staff', {
        nav:[
            {link: '/', title: 'Home'},
            {link: '/login_staff', title: 'Log In Staff'},
            {link: '/sign_up_staff', title: 'Sign Up Staff'},
            {link: '/portal_staff', title: 'Portal Staff'},
            {link: '/login_students', title: 'Log In Students'},
            {link: '/sign_up_students', title: 'Sign Up Students'},
            {link: '/portal_students', title: 'Portal Students'}
        ],
        title: 'Sign Up' 
        });
    }
});

module.exports = signUpRouter;