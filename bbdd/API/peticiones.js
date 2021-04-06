const express = require('express');
const cors = require('cors')
const app = express();
const connection = require('./database.js');

// Settings
app.set('port', process.env.PORT || 3050);
app.use(cors());

// Middlewares
app.use(express.json());

app.use(express.static("public"))


app.use(express.urlencoded({extended: true}));


// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
    
});

app.get('/',(req,res)=>{
    res.send("Hello World");
})

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

        if (result.length > 0) {
            
            return res.status(400).json({message: 'Ya existe un usuario con ese nickname, introduzca otro.'})
            
        }else {
            // let hash = bcrypt.hashSync(usuarioObj.contraseña, saltRounds);
            //usuarioObj.contraseña=hash;
            connection.query(sql, usuario, error => {
                if (error){
                    //Gestionamos el error de clave duplicada
                    if(error.errno == 1062){
                    
                        return res.status(410).json({
                            message: 'Ya existe un usuario con ese correo, compruebe que el email es correcto.'
                        });
                        
                    }else{
                        throw error;
                    }
                }else{
                    //Por defecto el HTTP request aqui será 200 asi que no hace falta mandarle un status
                    res.json({
                        message: 'Usuario registrado exitosamente.'
                    });
                }
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