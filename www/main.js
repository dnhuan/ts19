$(() => {
    var socket = io("http://bogddt.gq:8080");
    socket.on("realtime",(data) => {
        $('#current').text(data.o);
        $('#tong').text(data.s);
    })
})