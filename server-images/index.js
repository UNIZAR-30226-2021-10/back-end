const express = require('express'); 
const path = require('path');
const cors = require('cors'); 

const app = express();
const connection = require('./database.js');

//Settings
const PORT = process.env.PORT || 3060;  //Puerto
app.use(cors());

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, '/app/archivos')));
app.use(express.urlencoded({extended: true}));

// Starting the server
app.listen(PORT, (err) => {
    if (err){
        console.log(err);
    }else{
        console.log("Server has started on port " + PORT);
    }
})

app.get('/',(req,res)=>{
    res.send("Servidor de imagenes");
})
/*app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});*/

const uploader = require('./app/config/multer');
const { writeFile } = require('fs');

app.post('/upload', uploader.single('file'), async(req, res) => {
    //console.log("Uploading: "+ file.filename);

    const {file,body} = req;
    if (file && body && file.mimetype.split('/')[0] === body.selectTipoArchivo.split('/')[0]){
        let imageToSave;
        imageToSave = {
            Precio: body.productPrice,
            Nombre: body.productName,
            Tipo: body.productCategory,
            Color: body.productColor,
            Imagen: 'http://localhost:3060/'+body.selectCategoria+'/'+file.filename,
        }
        
        //Guardar archivo en db
        const sql = "INSERT into item SET ?";

        connection.query("SELECT * FROM item WHERE Imagen='"+imageToSave.Imagen+"'",(error,result)=>{

            if (result.length > 0) {
                return res.status(400).json({message: 'Ya existe una imagen con esa url.'})
            }else {
                connection.query(sql, imageToSave, error => {
                    if (error){
                        throw error;
                    }else{
                        //Por defecto el HTTP request aqui será 200 asi que no hace falta mandarle un status
                        res.json({
                            imageSaved: imageToSave,
                            message: 'Imagen guardada!'
                        });
                    }
                });
            }
    
        });
    } else{
        return res.status(410).json({message: "Tipo de archivo seleccionado erróneo."})
    }
})
//Lucas si necesitas la clave y el id dime
const AWS = require('aws-sdk');
AWS.config.update({
    secretAccessKey: '****',
    accessKeyId: '****',
    region: 'eu-west-3'    
});
const s3Bucket = new AWS.S3( { params: {Bucket: 'trivial-images'} } );

app.post('/UpdateAvatarUsuario',(req,res)=>{

    let nombre = req.body.nombre;
    const url="https://trivial-images.s3.eu-west-3.amazonaws.com/"
    datos = Buffer.from(req.body.imagen.replace(/^data:image\/\w+;base64,/, ""),'base64')
    var data = {
        Key: req.body.nombre, 
        Body: datos,
        ContentEncoding: 'base64',
        ContentType: 'image/png'
    };
    s3Bucket.putObject(data, function(err, data){
      if (err) { 
        console.log(err);
        console.log('Error uploading data: ', data); 
      } else {
        var email = nombre.replace("@","%40");
        const sql = "UPDATE usuario SET imagen='"+url + email +"' WHERE email='"+nombre+"'"
        connection.query(sql,(err)=>{
             if(err){
                console.log(err);
                  res.status(400);
            }else{
                 res.json({
                     imagenAv: url + email
                   });
             }
        });
        console.log('successfully uploaded the image!');
      }
});

app.get('/historial', async(req, res) => {
    const {body} = req;
    if(body){
        //Coger archivos de db
        connection.query("SELECT * FROM item ORDER BY iditem DESC",(error,result)=>{
            if (result.length > 0) {
                res.json({
                    listaResults: result
                });
            }else {
                if (error) throw error;
                res.status(400).json({
                    message: 'Empty.'
                })
            }
    
        });
    }
})

app.get('/numberUsers', async(req, res)=>{
    const {body} = req;
    if(body){
        //Coger archivos de db
        connection.query("SELECT COUNT(*) AS numberOfUsers FROM usuario",(error,result)=>{
            if (result.length > 0) {
                res.json(result);
            }else {
                if (error) throw error;
                res.status(400).json({
                    message: 'Error al contar el número de usuarios.'
                })
            }
    
        });
    }
})


})
