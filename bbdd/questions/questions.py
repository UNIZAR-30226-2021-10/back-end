'''
Modulo para insertar las preguntas en la BBDD
Lee los json de preguntas del directorio 'json'
y los inserta en la bbdd
'''
import json
import mysql.connector
import os
#Clase para almacenar las preguntas
class Pregunta:
  def __init__(self, enunciado, categoria, correcta, incorrecta1, incorrecta2, incorrecta3):
    self.enunciado = enunciado
    self.categoria = categoria
    self.correcta = correcta
    self.incorrecta1 = incorrecta1
    self.incorrecta2 = incorrecta2
    self.incorrecta3 = incorrecta3


data = []
archivos = []
#Cargar archivo JSON
directory = r'json'
for filename in os.listdir(directory):
    if filename.endswith(".json"):
        file=os.path.join(directory, filename)
        
        with open(file, "r", encoding="utf-8") as f:
          data = json.load(f)
          archivos.append(data)


res = []
preguntas = []
categorias = []

for data in archivos:


  #Guardar preguntas
  for pregunta in data:

    #Añadir categorias
    if pregunta['category'] not in categorias:
      categorias.append(pregunta['category'])

    #Eliminar preguntas repetidas y guardar en vector de Preguntas
    if pregunta['question'] not in res:
      
      res.append(pregunta['question'])

      incorrectas = pregunta['incorrectAnswers']

      if len(incorrectas) > 2 and pregunta['type'] == "Multiple Choice":    #Preguntas con al menos 4 respuestas

        enunciado = pregunta['question']
        categoria = pregunta['category']
        correcta = pregunta['correctAnswer']
      
        #Guardar pregunta
        preguntas.append(Pregunta(enunciado, categoria, correcta, 
                                  incorrectas[0], incorrectas[1], incorrectas[2]))


'''
#Insertar
mydb = mysql.connector.connect(
  host="eu-cdbr-west-03.cleardb.net",
  user="baaa8387acfc19",
  password="2ae0a14b",
  database="heroku_c579bffd070869c"
)

mycursor = mydb.cursor()
sql = "INSERT INTO pregunta (idpregunta , incorrecta1, incorrecta2, incorrecta3, correcta, enunciado, categoria) VALUES (%s, %s, %s, %s, %s, %s, %s)"

i=0
for pregunta in preguntas:
  mycursor.execute(sql, (i, pregunta.incorrecta1, pregunta.incorrecta2, pregunta.incorrecta3, pregunta.correcta,
                            pregunta.enunciado, pregunta.categoria))
  ++i

mydb.commit()
mydb.close()
'''