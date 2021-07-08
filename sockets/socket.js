const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');


// Mensajes de Sockets
io.on('connection',  (client) => {
    console.log('Cliente conectado');
    const [valido, uid] = comprobarJWT( client.handshake.headers['x-token'])
    

    //verificar autenticación
    if(!valido) {return client.disconnect();}


    //cliente autenticado
    usuarioConectado(uid);

    //ingresar el usuario a un sala
    //sala global 
    client.join( uid );

    //client.to(uid).emit('')
    //escuchar el cliente del mensaje personal 
    client.on('mensaje-personal',async (payload) => {
       //grabar mensaje
       await grabarMensaje (payload);
       io.to( payload.para ).emit('mensaje-personal', payload );
    })



    client.on('disconnect', () => {
        //console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

   /* client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });*/


});
