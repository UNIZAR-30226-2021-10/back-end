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
            //TODO : para encriptar la contraseña del usuario de momento no lo hacemos.
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

app.post('/MenuInicio',(req,res)=>{

    connection.query("SELECT * FROM usuario WHERE nickname='"+req.body.nickname+"'"+"and password='"+req.body.password+"'",(error,result)=>{

        
        if (result.length > 0) {
            
            res.json({
                email: result[0],
                nickname: result[1],
                monedas: result[2],
                puntos: result[3],
            });
        }else {
            if (error) throw error;
            res.status(400).json({
                message: 'Login not sucesfully.'
            })
        }

    });


})

app.get('/ModoIndividual',(req,res)=>{

    //connection.query("SELECT idpregunta, incorrecta1, incorrecta2, incorrecta3, correcta, enunciado FROM pregunta where categoria='"+req.body.category+"' ORDER BY RAND() LIMIT 1",(error,result)=>{
        connection.query("SELECT idpregunta, incorrecta1, incorrecta2, incorrecta3, correcta, enunciado FROM pregunta where categoria='"+req.query.category+"' ORDER BY RAND() LIMIT 1",(error,result)=>{

        if (result.length > 0) {
            
           res.json({
                idpregunta: result[0],
                incorrecta1: result[1],
                incorrecta2: result[2],
                incorrecta3: result[3],
                correcta: result[4],
                enunciado: result[5],
           })
            
        }else {
            if (error) throw error;
            res.status(400).json({
                message: 'Pregunta no obtenida'
            }) 
        }
    });
})


app.post('/AjustesUsuario',(req,res)=>{

    const sql = "UPDATE usuario SET ? WHERE email= '"+req.body.email+"'";

    const usuario = {
        email : req.body.email,
        password: req.body.password,
        nickname: req.body.nickname,
    }
    connection.query("SELECT * FROM usuario WHERE email='"+usuario.email+"'",(error,result)=>{
        if (result.length > 0) {
            //el usuario está registrado y se pueden actualizar sus datos
            connection.query(sql,usuario,error => {
                if (error) throw error;
                res.status(400).json({
                message: 'Datos no actualizados'
                })
            });
        } else{
            //el usuario no está registrado
            res.json({
                message: 'El usuario no está registrado.'
            });

        }
    });
})

app.post('/EliminarCuenta',(req,res)=>{
    const sql = "DELETE FROM usuario WHERE email= '"+req.body.email+"'";

    const usuario = {
        email : req.body.email,
    }

    connection.query(sql,usuario,error => {
        if (error) throw error;
        res.status(400).json({
        message: 'Cuenta no eliminada'
        })
    });

})
