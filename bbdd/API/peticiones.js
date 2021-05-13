const express = require('express');
const cors = require('cors')
const app = express();
const connection = require('./database.js');
const Mysql = require('mysql');
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')

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
        imagen: req.body.imagen,
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

app.post('/Registrarse_Foto',(req,res)=>{

    const sql = "insert into tiene SET usuario_email = '"+req.body.email+"', idItem = ? , equipado = 1";

    connection.query("SELECT iditem FROM item WHERE Nombre ='"+req.body.nombreObjeto+"'",(error,result)=>{

        if (result.length > 0) {
            //console.log(result);
            const id = result[0].iditem;
            connection.query(sql, id, error => {
                if (error) {
                    res.status(410).json({
                        message: 'Item no insertado'
                    })
                    throw error;
                }else{
                    res.json({
                        message: 'Item insertado en tabla tiene del usuario'
                    })
                }
            });
            
        }else {
            return res.status(400).json({message: 'No se ha encontrado el item'})
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
                imagen: result[5]
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
            console.log("error");
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
                if (error) {
                    res.status(400).json({
                        message: 'Datos no actualizados'
                    })
                    throw error;
                }else{
                res.json({
                    message: 'Datos actualizados correctamente.'
                })
                }
            });
        } else{
            //el usuario no está registrado
            res.status(400).json({
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
        if (error) {
            res.status(400).json({
                message: 'Cuenta no eliminada'
            })
            throw error;
        }else{
            res.json({
            message: 'Cuenta eliminada'
            })
        }
    });

})

app.post('/CambiarContrasenya',(req,res)=>{

    const sql = "UPDATE usuario SET ? WHERE email= '"+req.body.email+"'";

    const usuario = {
        email : req.body.email,
        password: req.body.password,
    }
    connection.query("SELECT * FROM usuario WHERE email='"+usuario.email+"'",(error,result)=>{
        if (result.length > 0) {
            //el usuario está registrado y se pueden actualizar sus datos
            connection.query(sql,usuario,error => {
                if (error) throw error;
                res.status(400).json({
                message: 'Contraseña no actualizada'
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

app.get('/Historial',(req,res)=>{
    const primeraQuery = "select * from partida where idpartida IN  (select id_partida from juega where usuario_email = '"+ req.query.mail+"') ORDER BY idpartida DESC";
    connection.query(primeraQuery,(error,result)=>{

        if (result.length > 0) {
            // ha devuelto lista
            res.json(result);
            //console.log(result);
            //console.log(res);
            
        }else {
            if (error) throw error;
            res.status(400).json({
                message: 'primera query falla'
            }) 
        }
    });
})

app.get('/Historial_Puntuacion',(req,res)=>{
    
    const segundaQuery = "select puntuacion,id_partida from juega where usuario_email = '"+ req.query.email+"' ORDER BY id_partida DESC";
    connection.query(segundaQuery,(error,result)=>{
    
        if (result.length > 0) {
            // ha devuelto lista
            res.json(result);
            //console.log(result);
            //console.log(res);
            
        }else {
            if (error) throw error;
            res.status(400).json({
                message: 'segunda query falla'
            }) 
        }
    });
})

//Datos: los resultados de la query Historial_Completo
//email: correo del usuario que solicita su historial
function prepararDatos(datos, emailSolicitante){
    let result = [];
    let antIdPartida = null;
    let partida = '';
    datos.forEach((dato) => {
        if (antIdPartida != dato.idpartida){ //Si la partida anterior y la actual tienen distinto id
            if (antIdPartida != null){ //Añadir la partida anterior
                result.push(partida);
            }
            
            //Crear nueva partida
            partida = {   
                code: dato.codigo, 
                jugadoresEnPartida: [ //Ordenados por clasificación 1* a 4*
                    {username: dato.nickname, avatar: dato.imagen, puntos: dato.puntuacion},
                ],
                maxJugadores: dato.numJugadores,
                maxRondas: dato.rondas,
                fecha: '',
                hora: '',
            }
        } else { //Si la partida anterior y la actual tienen el mismo id
            //Añadirse como jugador de la partida
            const jugadorDePartida = {username: dato.nickname, avatar: dato.imagen, puntos: dato.puntuacion};
            partida.jugadoresEnPartida.push(jugadorDePartida);
        }

        //Si eres el que solicita el historial, pones la fecha y hora de la partida
        if (emailSolicitante == dato.email){
            let fecha = dato.fecha;
            const anyo = fecha.split('--')[0];  //Año
            const mes = fecha.split('--')[1];   //Mes
            fecha = fecha.split('--')[2];
            const dia = fecha.split('(')[0];    //Día
            fecha = fecha.split('(')[1];
            const hora = fecha.split(')')[0];   //Hora

            //Colocar la fecha y hora obtenidas en la partida
            partida.fecha = dia + "-" + mes + "-" + anyo;
            partida.hora = hora;
        }

        //Actualizar antIdPartida
        antIdPartida = dato.idpartida;
    })
    //Se añade la última partida que falta
    if (antIdPartida != null){ //Añadir la partida anterior
        result.push(partida);
    }
    return result;
}

app.get('/Historial_Completo',(req,res)=>{
    const query = "SELECT idpartida, fecha, numJugadores, rondas, codigo, puntuacion, email, nickname, imagen \
                   FROM partida, juega, usuario WHERE idpartida IN \
                        ( SELECT id_partida \
                          FROM juega where usuario_email = '"+ req.query.email+"') \
                    AND partida.idpartida = juega.id_partida \
                    AND juega.usuario_email = usuario.email \
                    ORDER BY idpartida DESC, puntuacion DESC";
    console.log(req.query.email);
    connection.query(query,(error,result)=>{
        if (result.length > 0) {
            const partidas = prepararDatos(result, req.query.email);
            res.json(partidas);
        } else {
            if (error) throw error;
            res.status(400).json({
                message: 'Error al obtener el historial de partidas.'
            }) 
        }
    });
})

app.post('/FinalIndividual',(req,res)=>{

    const partida = {
        fecha: req.body.fecha,
        numJugadores: req.body.numJugadores,
        rondas: req.body.rondas,
        ganador: req.body.ganador,
    }

    connection.query("INSERT into partida SET ?", partida, error => {
        if (error){
            //Gestionamos el error de clave duplicada
            res.status(400).json({
                message: 'No se ha podido insetar partida'
            }) 
            throw error;
        }else{
            //Por defecto el HTTP request aqui será 200 asi que no hace falta mandarle un status
            connection.query("SELECT idpartida FROM partida where fecha = '"+partida.fecha+"'",(error,result)=>{
                if (result.length > 0) {
                    const jugada = {
                        id_partida: result[0].idpartida,
                        usuario_email: req.body.email,
                        puntuacion: req.body.puntos
                    }
                    
                    connection.query("INSERT into juega SET ?", jugada, error => {
                        if (error){
                            //Gestionamos el error de clave duplicada
                            res.status(440).json({
                                message: 'No se ha podido insetar jugada'
                            }) 
                            throw error;
                        }else{
                            res.json({
                                message: 'Partida y jugada registradas correctamente'
                            });
                        }
                    });
                }else {
                    if (error) throw error;
                    res.status(450).json({
                        message: 'No se ha podido encontrar la partida'
                    })
                }
    	    });
        }
    });
})

app.post('/FinalIndividual_Usuario',(req,res)=>{
    
    const usuario = {
        email : req.body.email,
        monedas : req.body.monedas,
        puntos : req.body.puntos,
    }

    connection.query("SELECT * FROM usuario WHERE email='"+usuario.email+"'",(error,result)=>{
        
        if (result.length > 0) {
            //el usuario está registrado y se pueden actualizar sus datos
            // coger las monedas y puntos que ya están y sumar
            const pasarAintM = parseInt(usuario.monedas, 10);
            const pasarAintP = parseInt(usuario.puntos, 10);
            const pasarAintM2 = parseInt(result[0].monedas, 10);
            const pasarAintP2 = parseInt(result[0].puntos, 10);
            const sumaIntM = pasarAintM + pasarAintM2;
            const sumaIntP= pasarAintP + pasarAintP2;
            usuario.monedas = sumaIntM;
            usuario.puntos = sumaIntP;
            connection.query("UPDATE usuario SET ? WHERE email= '"+req.body.email+"'",usuario,error => {
                if (error){
                    //Gestionamos el error de clave duplicada
                    res.status(410).json({
                        message: 'Datos no actualizados'
                    }) 
                    throw error;
                }else{
                    res.json({
                        message: 'Monedas y puntos registrados correctamente'
                    });
                }
            });
        } else{
             //el usuario no está registrado
            if (error) throw error;
            res.status(400).json({
                message: 'El usuario no está registrado.'
            }) 
        }
    });
})

app.get('/Multijugador_PartidaCode',(req,res)=>{ 
    const query = "select * from partida where codigo = '"+ req.query.codigo+"'";
    
    connection.query(query,(error,result)=>{
        if (result.length > 0) {
            console.log("Encontrada partida con codigo code.");
            res.json(result);   // Devuelvo partida
        }else {
            console.log("NO encontrada partida con codigo code.");
            if (error) throw error;
            res.status(400).json({
                message: 'No existe ninguna partida con ese código.'
            }) 
        }
    });
})

app.get('/Multijugador_PartidaJugadoresUsuario',(req,res)=>{
    const query = "select * from juega as j, usuario as u \
                    where j.id_partida = "+ req.query.idpartida
                    + " and j.usuario_email = u.email";
    console.log(req.query.idpartida);                
    connection.query(query,(error,result)=>{
        if (result.length > 0) {
            console.log("Encontrados jugadores de la partida.");
            res.json(result);   // Devuelvo jugadores
        }else {
            console.log("No hay jugadores en la partida.");
            if (error) throw error;
            res.status(400).json({
                message: 'No hay jugadores en la partida.'
            }) 
        }
    });
})

/*app.get('/Multijugador_PartidaJugadores',(req,res)=>{
    const query = "select * from juega where id_partida = "+ req.query.idpartida;

    connection.query(query,(error,result)=>{
        if (result.length > 0) {
            console.log("Encontrados jugadores de la partida.");
            res.json(result);   // Devuelvo jugadores
        }else {
            console.log("No hay jugadores en la partida.");
            if (error) throw error;
            res.status(400).json({
                message: 'No hay jugadores en la partida.'
            }) 
        }
    });
})

app.get('/Multijugador_PartidaUsuario',(req,res)=>{
    const query = "select * from usuario where email = '"+ req.query.email+"'";

    connection.query(query,(error,result)=>{
        if (result.length > 0) {
            console.log("Encontrado usuario.");
            res.json(result);   // Devuelvo jugadores
        }else {
            console.log("No existe el usuario.");
            if (error) throw error;
            res.status(400).json({
                message: 'No existe el usuario.'
            }) 
        }
    });
})*/

app.post('/CrearMultijugador_Partida',(req,res)=>{

    const partida = {
        fecha: req.body.fecha,
        numJugadores: req.body.numJugadores,
        rondas: req.body.rondas,
        ganador: req.body.ganador,
        codigo: req.body.codigo
    }

    connection.query("INSERT into partida SET ?", partida, error => {
        if (error){
            //Gestionamos el error de clave duplicada
            res.status(400).json({
                message: 'No se ha podido insetar partida'
            }) 
            throw error;
        }else{
            res.json({
                message: 'Partida registrada correctamente'
            });
        }
    });
})

app.post('/UnirseMultijugador_Juega',(req,res)=>{
    connection.query("SELECT idpartida FROM partida where codigo = '"+req.body.codigo+"'",(error,result)=>{
        if (result.length > 0) {
            const jugada = {
                id_partida: result[0].idpartida,
                usuario_email: req.body.email,
                puntuacion: req.body.puntos
            }
                    
            connection.query("INSERT into juega SET ?", jugada, error => {
                if (error){
                    //Gestionamos el error de clave duplicada
                    res.status(440).json({
                        message: 'No se ha podido insetar jugada'
                    }) 
                    throw error;
                }else{
                    res.json({
                        message: 'Jugada registrada correctamente'
                    });
                }
            });
        }else {
            if (error) throw error;
            res.status(450).json({
                message: 'No se ha podido encontrar la partida'
            })
        }
    });
})

app.post('/FinalMultijugador_Partida',(req,res)=>{
    connection.query("UPDATE partida SET ganador = '"+req.body.ganador+"' WHERE codigo= '"+req.body.codigo+"'",error => {
        if (error){
            //Gestionamos el error de clave duplicada
            res.status(410).json({
                message: 'Datos partida no actualizados.'
            }) 
            throw error;
        }else{
            res.json({
                message: 'Datos partida actualizados.'
            }) 
        }
    });
})

app.post('/FinalMultijugador_Juega',(req,res)=>{

    connection.query("SELECT idpartida FROM partida WHERE codigo='"+req.body.codigo+"'",(error,result)=>{
        
        if (result.length > 0) {
            const idpartida = parseInt(result[0].idpartida, 10);
            connection.query("UPDATE juega SET puntuacion = '"+req.body.puntos+"' WHERE id_partida= '"+idpartida+"'",error => {
                if (error){
                    //Gestionamos el error de clave duplicada
                    res.status(410).json({
                        message: 'Datos juega no actualizados.'
                    }) 
                    throw error;
                }else{
                    res.json({
                        message: 'Datos juega actualizados.'
                    }) 
                
                }
            });
        } else{
             //el usuario no está registrado
            if (error) throw error;
            res.status(400).json({
                message: 'El usuario no está registrado.'
            }) 
        }
    });
})

/*app.post('/PantallaTienda',(req,res)=>{
    
    connection.query("SELECT * FROM item",(error,result)=>{
    
        if (result.length > 0) {
            //console.log(result);
            res.json(result);
            
        }else {
            if (error) throw error;
            res.status(400).json({
                message: 'No se han podido obtener los items'
            }) 
        }
    });
})*/

app.post('/PantallaTienda',(req,res)=>{
    // select * from item where iditem not in (select idItem from tiene where usuario_email = "andrea@mail.com");

    connection.query("select * from item where iditem not in (SELECT idItem FROM tiene where usuario_email = '"+req.body.email+"' )",(error,result)=>{
    
        if (result.length > 0) {
            res.json(result);
            
        }else {
            if (error) throw error;
            res.status(400).json({
                message: 'No se han podido obtener los items'
            }) 
        }
    });
})


app.post('/PerfilUsuario',(req,res)=>{

    connection.query("select item.iditem,Imagen,Tipo,Nombre,equipado from item,tiene where item.iditem=tiene.iditem AND tiene.usuario_email= '"+req.body.email+"'",(error,result)=>{
        
        if (result.length > 0) {
            res.json(result);
            
        }else {
            if (error) throw error;
            res.status(400).json({
                message: 'No se han podido obtener los items'
            }) 
        }
    });
})

app.post('/ObjetoTienda',(req,res)=>{
    
    connection.query("SELECT iditem FROM item where Nombre ='"+req.body.nombreObjeto+"'",(error,result)=>{
    
        if (result.length > 0) {
            //console.log(result);

            const tiene = {
                usuario_email : req.body.email,
                idItem : result[0].iditem,
                equipado : 0,
            }
            
            connection.query("INSERT into tiene SET ?", tiene, error => {
                if (error){
                    console.log("ERROR");
                    //Gestionamos el error de clave duplicada
                    res.status(440).json({
                        message: 'No se ha podido insetar tiene'
                    }) 
                    throw error;
                }else{
                    res.json({
                        message: 'Objeto registrado correctamente'
                    });
                }
            });

        }else {
            if (error) throw error;
            res.status(400).json({
                message: 'No se ha encontrado el item'
            }) 
        }
    });
})

app.post('/ObjetoTienda_RestarMonedas',(req,res)=>{
    
    const precio = parseInt(req.body.precioObjeto,10);

    connection.query("SELECT monedas FROM usuario WHERE email='"+req.body.email+"'",(error,result)=>{
        
        if (result.length > 0) {
            // Coger monedas que ya tiene y restarle lo que vale el objeto
            // que acaba de comprar
            const monedasActuales = parseInt(result[0].monedas, 10);
            const resto = monedasActuales - precio;
            connection.query("UPDATE usuario SET monedas = '"+resto+"' WHERE email= '"+req.body.email+"'",error => {
                if (error){
                    //Gestionamos el error de clave duplicada
                    res.status(410).json({
                        message: 'Datos no actualizados'
                    }) 
                    throw error;
                }else{
                    res.json({
                        message: 'Datos actualizados'
                    }) 
                }
            });
        } else{
             //el usuario no está registrado
            if (error) throw error;
            res.status(400).json({
                message: 'El usuario no está registrado.'
            }) 
        }
    });
})


function ordenarAsc(p_array_json, p_key) {
    p_array_json.sort(function (a, b) {
       return a[p_key] > b[p_key];
    });
}

function ordenarDesc(p_array_json, p_key) {
    ordenarAsc(p_array_json, p_key); 
    p_array_json.reverse(); 
}

app.post('/Ranking',(req,res)=>{

    //connection.query("select nickname, puntos, imagen from usuario ",(error,result)=>{
    connection.query("select nickname, (puntos * 1) AS 'puntos', imagen from usuario ORDER BY puntos DESC",(error,result)=>{
        
        if (result.length > 0) {
            //const prueba = result;
            //ordenarDesc(prueba, 'puntos');
            //res.json(prueba);
            res.json(result);
            
        }else {
            console.log(result);
            if (error) throw error;
            res.status(400).json({
                message: 'No se han podido obtener los usuarios'
            }) 
        }
    });
})

//Middleware para updatear los items equipados de un usuario
app.post('/UpdateItemsUsuario',(req,res)=>{
    
            
     //Guardamos los arrays de elementos
     var equipados = req.body.equipados;
     var nombres = req.body.nombre;
     //Creamos las queries necesarias para actualizar la base de datos
     var queries = '';
    equipados.forEach((elemento,indice)=>{
         const nombre = nombres[indice]
         queries+= Mysql.format("UPDATE tiene SET equipado= ? WHERE idItem= ? AND usuario_email='"+req.body.email+"'; ",[elemento,nombre])
    });
    connection.query(queries,(error,result)=>{
        if(error){
            res.status(400).json({
                message: 'Error en la query.'
            })
            console.log(error);
        }else{
            res.status(200);
        }
    });
});


app.post('/PartidaMulti_info',(req,res)=>{
   console.log(req.body.codigo); 
   connection.query("SELECT * FROM partida WHERE codigo ='"+ req.body.codigo +"'",(error,result)=>{
    if (result.length > 0) {
        console.log();    
        res.json({
            idpartida: result[0],
            fecha: result[1],
            numJugadores: result[2],
            rondas: result[3],
            ganador: result[4],
            codigo: result[5]
        });
    }else {
        if (error) throw error;
        res.status(400).json({
            message: 'Login not sucesfully.'
        })
    }
   });
});

app.post('/BuscarPartidaMulti',(req,res)=>{
    console.log(req.body.codigo); 
    connection.query("SELECT * FROM partida WHERE codigo ='"+ req.body.codigo +"'",(error,result)=>{
     if (result.length > 0) {
         console.log();    
         res.json({
             idpartida: result[0],
             fecha: result[1],
             numJugadores: result[2],
             rondas: result[3],
             ganador: result[4],
             codigo: result[5]
         });
     }else {
         if (error) throw error;
         res.status(400).json({
             message: 'Login not sucesfully.'
         })
     }
    });
 });

app.post('/construirAvatar' ,(req,res) => {
    const imagenes = req.body.imagenes;
    const canvas = createCanvas(140, 140);
    const context = canvas.getContext('2d');
    console.log(imagenes);
    var buffer;
    imagenes.forEach((imagen) => {
            loadImage(imagen).then(image =>{
                context.drawImage(image,0,0);
                if (imagenes.indexOf(imagen) == (imagenes.length - 1)){
                    buffer = canvas.toBuffer('image/png', 'base64');
                    fs.writeFileSync('./avatar.png', buffer);
                    let buff =  Buffer.from(buffer);
                    let base64data = buff.toString('base64');
                    res.send(base64data);
                }
            })
    })
    
});
/*
 app.post('/construirAvatar' ,(req,res) => {
    const imagenes = req.body.imagenes;
    const canvas = createCanvas(140, 140);
    const context = canvas.getContext('2d');
    var buffer;
    for (var i = 0; i<4; i++){
        if (imagenes[i] == null){
            i=4;
        }else{
            loadImage(imagenes[i]).then(image =>{
                context.drawImage(image,0,0);
                buffer = canvas.toBuffer('image/png');
                fs.writeFileSync('./avatar.png', buffer, 'base64');
            })
        }
    }

    res.status(200);
 });*/