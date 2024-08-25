const socket = io("/");
const peer = new Peer(undefined, {
    host: "/",
    port: "9001"
});


peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id);
})



//Video Broadcast
const videoGrid = document.querySelector("#videoGrid");
const videoElement = document.createElement("video");
videoElement.muted = true;

//Get user media
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
    .then(stream => {
        appendVideo(stream, videoElement);

        peer.on("call", call => {
            call.answer(stream);
            const videoElement = document.createElement("video");
            call.on("stream", remoteStream => {
                appendVideo(remoteStream, videoElement);
            })
        })
        socket.on("user-connected", userId => {
            handleCalling(userId, stream);
        });


    })



function appendVideo(stream, video) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });

    videoGrid.append(video)
}


function handleCalling(userId, stream) {
    const call = peer.call(userId, stream);
    const videoElement = document.createElement("video");
    call.on("stream", remoteStream => {
        appendVideo(remoteStream, videoElement);
    });
    call.on("close", () => {
        videoElement.remove();
    })
}