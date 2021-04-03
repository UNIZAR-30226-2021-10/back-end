# back-end

# ¿Cómo conectarse a la Base de datos?

Para conectarse a la base de datos se recomienda utilizar mySQL Workbench [link de descarga para Windows](https://dev.mysql.com/downloads/workbench/), aunque si se desea se puede realizar la conexión mediante [terminal](https://www.a2hosting.es/kb/developer-corner/mysql/connect-to-mysql-from-the-command-line).

Para conectarse desde mySQL Workbench debemos establecer una nueva conexión haciendo click en el ícono +, tal como se indica en la foto.
![conecBD](https://user-images.githubusercontent.com/33655360/113489354-05fe8800-94c4-11eb-94e0-b4515ddb5257.png)

Una vez hayamos hecho click, se nos abrirá una ventana tal que así:
![b22](https://user-images.githubusercontent.com/33655360/113489395-51189b00-94c4-11eb-8d96-7d76a7c159f6.png)

Debemos sustituir los campos hostname, username y la contraseña por los correspondientes de nuestra base de datos. Estos datos se encuentran en un fichero denominado "conexion.txt" en la carpeta compartida de drive. La contraseña se introduce haciendo click en el botón 'Store in Vault'. Debe quedar algo tal que así:

![tdb](https://user-images.githubusercontent.com/33655360/113489454-b2d90500-94c4-11eb-850f-1ad2b0eb9ad7.png)

Una vez tengamos todos los parámetros introducidos haremos click en "Test Connection" y luego en ok.

Ahora ya habremos establecido una conexión con la base de datos, haremos doble click en el schema correspondiente a nuestra base de datos (heroku_c579bffd070869c), o bien escribiendo en la Query  "USE heroku_c579bffd070869c" en la termina de mysql workbench.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
#Sincronizar modulos
### `npm i mysql`
#Para iniciar el react sin tener que parar el server react
Luego npm i -D express nodemon


