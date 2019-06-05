$(() => {
    var socket = io("https://bogddt.gq/socket",{transports: ['websocket', 'polling', 'flashsocket']});
    socket.on("realtime",(data) => {
        $('#current').text(data.o);
        $('#tong').text(data.s);
    })
})