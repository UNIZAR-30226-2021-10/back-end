const users = [];

// Añade un usuario con id "id", nombre de usuario "username"
// y código de la sala de chat "code" al array de usuarios "users"
const addUser = ({id, username, code}) => {

    // Gestión de errores 
    // El usuario no puede estar en la misma partida en dos pantallas
    // El usuario puede estar en distintas partidas en distintas pantallas
    // Se puede cambiar a que el usuario solo puede estar jugando una partida al mismo tiempo quitando la comparación de code
    let i = -1;
    i = users.findIndex((user) => user.username == username && user.code == code);
    if (i !== -1){ //Si ha habido un error
        return {error: "El usuario ya está en la partida."};
    }

    // Añadimos el usuario al array de usuarios
    const user = {id, username, code};
    users.push(user);

    return {user};
}
 
// Elimina un usuario con id "id" del array de usuarios "users"
const removeUser = (id) => {
    const i = users.findIndex((user) => user.id == id);
    if ( i !== -1){  // Si esta el usuario
        return users.splice(i,1)[0];  //Se elimina del array
    }
}

// Elimina un usuario con username "username" y code "code" del array de usuarios "users"
const remove = (username, code) => {
    const i = users.findIndex((user) => user.username == username && user.code == code);
    if ( i !== -1){  // Si esta el usuario
        return users.splice(i,1)[0];  //Se elimina del array
    }
}

// Busca un usuario con id "id" en el array de usuarios "users"
const getUser = (id) =>{
    return users.find((user) => user.id == id);
}

// Busca los usuarios del chat con codigo "code" en el array de usuarios "users"
const getUsersInChatCode = (code) => {
    return users.filter((user) => user.code == code);
}

module.exports = {addUser, removeUser, remove, getUser, getUsersInChatCode};