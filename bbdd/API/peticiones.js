const express = require('express');
const cors = require('cors')
const app = express();
const connection = require('./database.js');

// Settings
app.set('port', process.env.PORT || 3050);
app.use(cors());

// Middlewares
app.use(express.json());


app.use(express.urlencoded({extended: true}));


// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
    
});


app.post('/Registrarse',(req,res)=>{

    const sql = "INSERT into usuario SET ?";

    const usuario = {
        email : req.body.email,
        password: req.body.password,
        nickname: req.body.nickname,
        puntos: "0",
        monedas: "0",
    }

    connection.query("SELECT * FROM usuario WHERE nickname='"+usuario.nickname+"'",(error,result)=>{

        if (error) throw error;
        if (result.length > 0) {
            res.json({
                message: 'Ya existe un usuario con ese nickname'
            })
        }else {
           // let hash = bcrypt.hashSync(usuarioObj.contraseña, saltRounds);
            //usuarioObj.contraseña=hash;
            connection.query(sql, usuario, error => {
                if (error) throw error;
                res.json({
                    message: 'Usuario registrado!'
                });
            });
        }

    });


})

app.post('/login',(req,res)=>{

    connection.query("SELECT * FROM usuario WHERE nickname='"+usuario.nickname+"'"+"and password='"+usuario.password+"'",(error,result)=>{

        if (error) throw error;
        if (result.length > 0) {
            res.json({
                message: 'Login sucesfully.'
            })
        }else {
           
            res.json({
                message: 'Login not sucesfully.'
            })
        }

    });


})