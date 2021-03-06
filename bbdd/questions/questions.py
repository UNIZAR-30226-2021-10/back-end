'''
Modulo para leer el JSON de la preguntas
De momento solo es un ejemplo
'''
import json

#Clase para almacenar las preguntas
class Pregunta:
  def __init__(self, enunciado, categoria, res_correcta, incorrecta1, incorrecta2, incorrecta3):
    self.enunciado = enunciado
    self.categoria = categoria
    self.res_correcta = res_correcta
    self.incorrecta1 = incorrecta1
    self.incorrecta2 = incorrecta2
    self.incorrecta3 = incorrecta3



#Cargar archivo JSON
with open('questions.json', "r", encoding="utf-8") as f:
  data = json.load(f)


res = []
preguntas = []

for pregunta in data:

  #Eliminar preguntas repetidas y guardar en vector de Preguntas
  if pregunta['question'] not in res:
    
    res.append(pregunta['question'])

    incorrectas = pregunta['incorrectAnswers']

    if len(incorrectas) > 2 and pregunta['type'] == "Multiple Choice":    #Preguntas con al menos 4 respuestas

      enunciado = pregunta['question']
      categoria = pregunta['category']
      res_correcta = pregunta['correctAnswer']
    
      #Guardar pregunta
      preguntas.append(Pregunta(enunciado, categoria, res_correcta, 
                                incorrectas[0], incorrectas[1], incorrectas[2]))





#Print bonito
for i in preguntas:

  print('CATEGORIA: ' + i.categoria)
  print(i.enunciado)

  print('a) ' + i.res_correcta)
  print('b) ' + i.incorrecta1)
  print('c) ' + i.incorrecta2)
  print('d) ' + i.incorrecta3)
  print("\n")


print('Número total de preguntas: ' + str(len(preguntas)))