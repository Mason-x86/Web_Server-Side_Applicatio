/*
APP.JS SUMMARY

nkjb/lb/lnb

*/

const express = require('express');
const app = express();

const chalk = require('chalk');
const path = require('path');
const debug = require('debug')('app');
const morgan = require('morgan');
const port = process.env.PORT || 3000;
const sql = require('mssql');
const cookieParser = require('cookie-parser');
const helmet = require('helmet')

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, './public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

const loginRouter = require('./src/routes/loginRoutes');
const signUpRouter = require('./src/routes/signUpRoutes');
const portalRouter = require('./src/routes/portalRoutes');
app.use(loginRouter);
app.use(signUpRouter);
app.use(portalRouter);


const config = {
    user: 'admin-MM',
    password: 'Boris@46@Matt',
    server: 'project-library-server.database.windows.net',
    database: 'UniversityDB',
    option: {
        encrypt: true // Use if on windows Azure
    }
}
sql.connect(config).catch((err) => debug(err));






app.get('/', function(req, res){
    debug("index");
    res.render('index', 
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
        title: 'Academic Homepage',
        
    })
})


app.listen(port, function(){
    debug(`listening on port ${chalk.green(port)}`);
   
})