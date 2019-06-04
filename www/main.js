$(() => {
    var socket = io();
    socket.on("realtime",(data) => {
        $('#current').text(data.o);
        $('#tong').text(data.s);
    })
})