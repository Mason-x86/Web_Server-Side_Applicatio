const express = require('express');
const loginRouter = express.Router();
const chalk = require('chalk');
const debug = require('debug')('app:loginRoutes');
const sql = require('mssql');

loginRouter.get('/login_staff', function(req, res){
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
        title: 'Log In',
        
    })
})

loginRouter.get('/login_students', function(req, res){
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
        title: ' Student Log In',
        
    })
})

loginRouter.post("/login_students", function (req, res) {(
    async function query() {
        debug('anything');
        var email = req.body.email;
        var pwd = req.body.password;
        let logged_in = Boolean(false)
        const request = new sql.Request();
        request.input('emailvar', sql.VarChar, email);
        request.input('pass', sql.VarChar, pwd);
        const result = await request
            .query('select * from Students where email = @emailvar and password = @pass');
        debug(result);
        studentinfo = result

        if (result.recordset.length > 0){
            logged_in = true
            res.cookie('StudentEmail',studentinfo.recordset[0].email)
            res.cookie('StudentPassword',studentinfo.recordset[0].password)
            debug('cookie saved success')
            debug(studentinfo.recordset[0].student_id)
        }
        
        if (logged_in == true) {
            debug('logged in to portal')
            //var data = {name: name, email: email, password: pwd};
            const request = new sql.Request();
            const result = await request
            .query('select * from courses')
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
            debug('failed to login')
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
            
                title: 'Login Students' 
            });
        }
        
    }())
});

loginRouter.post("/login_staff", function (req, res) {(
    async function query() {
        debug('anything');
        var email = req.body.email;
        var pwd = req.body.password;
        let logged_in = Boolean(false)
        const request = new sql.Request();
        request.input('emailvar', sql.VarChar, email);
        request.input('pass', sql.VarChar, pwd);
        const result = await request
            .query('select * from Staff where email = @emailvar and password = @pass');
        debug(result);
        staffinfo = result

        if (result.recordset.length > 0){
            logged_in = true
            res.cookie('StaffEmail',staffinfo.recordset[0].email)
            res.cookie('StaffPassword',staffinfo.recordset[0].password)
            debug('cookie saved success')
            debug(staffinfo.recordset[0].staff_id)
        }
        
        if (logged_in == true) {
            debug('logged in to portal')
            //var data = {name: name, email: email, password: pwd};
            const request = new sql.Request();
            request.input('staffid', sql.Int, staffinfo.recordset[0].staff_id);
            const result = await request
            .query('select * from Courses where staff_id = @staffid');
            course_info = result;
            res.render('portal_staff',
            {
                nav:[
                    {link: '/', title: 'Home'},
                    {link: '/login_staff', title: 'Log In Staff'},
                    {link: '/sign_up_staff', title: 'Sign Up Staff'},
                    {link: '/portal_staff', title: 'Portal Staff'}
                ],
                staff_info:[
                    {
                        staff_id: staffinfo.recordset[0].staff_id, 
                        first_name: staffinfo.recordset[0].first_name,
                        surname: staffinfo.recordset[0].last_name
                    }
                ],
                course_infos: course_info.recordset,
                title: 'Staff Portal'
                });
            }
        else {
            debug('failed to login')
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
            
                title: 'Login Staff' 
            });
        }
        
    }())
});

module.exports = loginRouter;