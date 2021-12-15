const express = require('express');
const chalk = require('chalk');
const path = require('path');
const debug = require('debug')('portalRoutes');
const morgan = require('morgan');
const sql = require('mssql');

const portalRouter = express.Router();

portalRouter.get('/portal_staff', function(req, res){(
    async function query() {
        debug(req.cookies.StaffEmail);
        debug(req.cookies.StaffPassword);
        let email = req.cookies.StaffEmail;
        let password = req.cookies.StaffPassword;
        const request = new sql.Request();
        request.input('emailvar', sql.VarChar, email);
        request.input('pass', sql.VarChar, password);
        const result = await request
            .query('select * from Staff where email = @emailvar and password = @pass');
        debug(result);
        staff_info = result;
        var course_info;
        if (staff_info.recordset.length > 0){
            const request = new sql.Request();
            request.input('staffid', sql.Int, staff_info.recordset[0].staff_id);
            const result = await request
            .query('select * from Courses where staff_id = @staffid');
            course_info = result;

            res.render('portal_staff', 
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
                staff_info:[
                    {
                        staff_id: '', 
                        first_name: staff_info.recordset[0].first_name,
                        surname: staff_info.recordset[0].surname
                    }
                
                ],
                course_infos: course_info.recordset,
                title: 'Staff Portal',
            });
        }
        
        
    
    }())
});
portalRouter.get('/portal_students', function(req, res){(
    async function query() {
        debug(req.cookies.StudentEmail);
        debug(req.cookies.StudentPassword);
        let email = req.cookies.StudentEmail;
        let password = req.cookies.StudentPassword;
        const request = new sql.Request();
        request.input('emailvar', sql.VarChar, email);
        request.input('pass', sql.VarChar, password);
        const result = await request
            .query('select * from Students where email = @emailvar and password = @pass');
        debug(result);
        student_info = result;
        const request2 = new sql.Request();
        request2.input('studentid', sql.Int, studentinfo.recordset[0].student_id);
        result2 = await request2
        .query('select Courses.course_name, Courses.course_id FROM Courses, Enrollment, Students where Students.student_id = @studentid and Students.student_id = Enrollment.student_id and Enrollment.course_id = Courses.course_id');
        enroll_info = result2;

        var course_info;
        if (student_info.recordset.length > 0){
            const request = new sql.Request();
            request.input('studentid', sql.Int, student_info.recordset[0].student_id);
            const result = await request
            .query('select * from Courses');
            course_info = result;

            res.render('portal_students', 
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
                student_info:[
                    {
                        student_id: '', 
                        first_name: student_info.recordset[0].first_name,
                        surname: student_info.recordset[0].surname
                    }
                
                ],
                enroll_infos: enroll_info.recordset,
                course_infos: course_info.recordset,
                title: 'Student Portal',
            });
        }
        
        
    
    }())
});

portalRouter.post("/portal_students", function (req, res) {
    var course_description = req.body.description;
    var course_name = req.body.name;
    let email = req.cookies.StaffEmail;
    let password = req.cookies.StaffPassword;
    var staffinfo;

    (async function query() { 
        const request = new sql.Request();
        request.input('emailvar', sql.VarChar, email);
        const result = await request
            .query('select * from Students where email = @emailvar');
        var studentinfo = result;
        debug(studentinfo)
        debug('information')

        debug(staffinfo)
    if (studentinfo.recordset.length > 0){
        if (studentinfo.recordset[0].password == password) {

            debug('logged in to portal')
            //var data = {name: name, email: email, password: pwd};
            const request = new sql.Request();
            const result = await request
            .query('select * from courses where courses.course_id = 0')
            course_info = result;

            const request2 = new sql.Request();
            request2.input('studentid', sql.Int, studentinfo.recordset[0].student_id);
            result2 = await request2
            .query('select Courses.course_name, Courses.course_id FROM Courses, Enrollment, Students where Students.student_id = @studentid and Students.student_id = Enrollment.student_id and Enrollment.course_id = Courses.course_id');
            enroll_info = result2;

            res.render('portal_students',
            {
                nav:[
                    {link: '/', title: 'Home'},
                    {link: '/login_students', title: 'Log In Students'},
                    {link: '/sign_up_students', title: 'Sign Up Students'},
                    {link: '/portal_students', title: 'Portal Students'}
                ],
                student_info:[
                    {
                        student_id: studentinfo.recordset[0].staff_id, 
                        first_name: studentinfo.recordset[0].first_name,
                        surname: studentinfo.recordset[0].last_name
                    }
                ],
                course_infos: course_info.recordset,
                enroll_infos: enroll_info.recordset,
                title: 'Student Portal'
                });
            }
            else {
            res.render('login_students', {
                nav:[
                    {link: '/', title: 'Home'},
                    {link: '/login_staff', title: 'Log In Staff'},
                    {link: '/sign_up_staff', title: 'Sign Up Staff'},
                    {link: '/portal_staff', title: 'Portal Staff'},
                    {link: '/login_students', title: 'Log In Students'},
                    {link: '/sign_up_students', title: 'Sign Up Students'},
                    {link: '/portal_students', title: 'Portal Students'}
                ],
                title: 'Login Students' 
                });
            }
    }
    }());
});



portalRouter.post("/portal_staff", function (req, res) {
    var course_description = req.body.description;
    var course_name = req.body.name;
    let email = req.cookies.StaffEmail;
    let password = req.cookies.StaffPassword;
    var staffinfo;

    (async function query() { 
        const request = new sql.Request();
        request.input('emailvar', sql.VarChar, email);
        const result = await request
            .query('select * from Staff where email = @emailvar');
        var staffinfo = result;
        debug(staffinfo)
        debug('information')

        debug(staffinfo)
    if (staffinfo.recordset.length > 0){
        if (staffinfo.recordset[0].password == password) {
            //var data = {name: name, email: email, password: pwd};
           
            const transaction = new sql.Transaction(/* [pool] */);
            transaction.begin(err => {
            // ... error checks
        
                const request = new sql.Request(transaction)
                request.input('coursename', sql.VarChar, course_name);
                request.input('description', sql.VarChar, course_description);
                request.input('staffid', sql.Int, staffinfo.recordset[0].staff_id)
                request.query('insert into Courses (course_name, course_description, staff_id) values (@coursename, @description, @staffid)', (err, result) => {
                // ... error checks
        
                    transaction.commit(err => {
                    // ... error checks
        
                        debug("Transaction committed.")
                    })
                })
            })

            const request = new sql.Request();
            request.input('staffid', sql.Int, staffinfo.recordset[0].staff_id);
            const result = await request
            .query('select * from Courses where staff_id = @staffid');
            var course_info = result;
        
            res.render('portal_staff',
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
                staff_info:[
                    {
                        staff_id: '', 
                        first_name: staffinfo.recordset[0].first_name,
                        surname: staffinfo.recordset[0].surname
                    }
                
                ],
                course_infos: course_info,
                title: 'Staff Portal',
                });
            }
            else {
            res.render('login_staff', {
                nav:[
                    {link: '/', title: 'Home'},
                    {link: '/login_staff', title: 'Log In Staff'},
                    {link: '/sign_up_staff', title: 'Sign Up Staff'},
                    {link: '/portal_staff', title: 'Portal Staff'},
                    {link: '/login_students', title: 'Log In Students'},
                    {link: '/sign_up_students', title: 'Sign Up Students'},
                    {link: '/portal_students', title: 'Portal Students'}
                ],
                title: 'Login_staff' 
                });
            }
    }
    }());
});

portalRouter.route('/course_view/:id')
.get( function(req, res){
    (async function query() {
        const id = req.params.id;
        const request = new sql.Request();
        request.input('id', sql.Int, id);
        const result = await request
            .query('select * from Courses WHERE course_id = @id');
        debug(result);
        course_info = result;
        var course_info;
        res.render('course_view', {
            nav:[
                {link: '/', title: 'Home'},
            {link: '/login_staff', title: 'Log In Staff'},
            {link: '/sign_up_staff', title: 'Sign Up Staff'},
            {link: '/portal_staff', title: 'Portal Staff'},
            {link: '/login_students', title: 'Log In Students'},
            {link: '/sign_up_students', title: 'Sign Up Students'},
            {link: '/portal_students', title: 'Portal Students'}
            ],
            title: 'Login_staff',
            query: course_info.recordset
        });

        
    }())
});
portalRouter.route('/course_view_students/:id')
.get( function(req, res){
    (async function query() {
        const id = req.params.id;
        const request = new sql.Request();
        request.input('id', sql.Int, id);
        const result = await request
            .query('select * from Courses WHERE course_id = @id');
        debug(result);
        course_info = result;
        var course_info;
        res.render('course_view_students', {
            nav:[
                {link: '/', title: 'Home'},
            {link: '/login_staff', title: 'Log In Staff'},
            {link: '/sign_up_staff', title: 'Sign Up Staff'},
            {link: '/portal_staff', title: 'Portal Staff'},
            {link: '/login_students', title: 'Log In Students'},
            {link: '/sign_up_students', title: 'Sign Up Students'},
            {link: '/portal_students', title: 'Portal Students'}
            ],
            title: 'Login_staff',
            query: course_info.recordset
        });

        
    }())
});
module.exports = portalRouter;