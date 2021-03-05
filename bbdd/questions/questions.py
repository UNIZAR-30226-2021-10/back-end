'''
Modulo para leer el JSON de la preguntas
De momento solo es un ejemplo
'''

import json

with open('questions.json', "r", encoding="utf-8") as f:
  data = json.load(f)

# Output: {'name': 'Bob', 'languages': ['English', 'Fench']}

print(data[2]['incorrectAnswers'])




for pregunta in data:

    incorrectas = pregunta['incorrectAnswers']


    if len(incorrectas) > 2:    #Preguntas con al menos 4 respuestas

        print(pregunta['question'])
        print('a) ' + pregunta['correctAnswer'])


        print('b) ' + incorrectas[0])
        print('c) ' + incorrectas[1])
        print('d) ' + incorrectas[2])
        print("\n")