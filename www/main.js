$(() => {
    var socket = io("http://bogddt.gq:8080",{transports: ['websocket', 'polling', 'flashsocket']});
    socket.on("realtime",(data) => {
        $('#current').text(data.o);
        $('#tong').text(data.s);
    })
})