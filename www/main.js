$(() => {
    var socket = io("https://bogddt.gq:8083",{transports: ['websocket', 'polling', 'flashsocket']});
    $("#getRes").click((e)=>{
        e.preventDefault();
        var value = $("#sobaodanh").val();
        console.log(value);
        socket.emit('getData',value);
    })
    //
    socket.on("realtime",(data) => {
        $('#current').text(data.o);
        $('#tong').text(data.s);
    })
    //
    socket.on("dataRes",res =>{
        console.log(res);
        $("#SBD").text(res.SBD);
        $("#Ho").text(res.Ho);
        $("#Ten").text(res.Ten);
        $("#V").text(res.V);
        $("#A").text(res.A);
        $("#T").text(res.T);
        $("#C").text(res.C);
    })
})