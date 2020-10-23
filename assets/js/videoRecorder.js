const recorderContainer = document.getElementById("js-recordContainer");
const recordBtn = document.getElementById("js-recordButton");
const videoPreview = document.getElementById("js-videoPreview");

let streamObject;
let videoRecorder;

const handleVideoData = event => {
	const { data: videoFile } = event;
	const link = document.createElement("a");
	link.href = URL.createObjectURL(videoFile);
	link.download = "recorded.webm";
	document.body.appendChild(link);
	link.click();
};

const startRecording = () => {
	videoRecorder = new MediaRecorder(streamObject);
	videoRecorder.start();
	videoRecorder.addEventListener("dataavailable", handleVideoData);
	
	recordBtn.addEventListener("click", stopRecording);

	recordBtn.innerHTML = "레코딩 종료";
};

const stopRecording = () => {
	videoRecorder.stop();

	recordBtn.removeEventListener("click", stopRecording);
	recordBtn.addEventListener("click", getVideo);

	recordBtn.innerHTML = "레코딩 시작";
};

const getVideo = async () => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: { width: 1280, height: 720 }
		});

		console.log(stream);

		videoPreview.srcObject = stream;
		videoPreview.muted = true;
		videoPreview.play();
		streamObject = stream;											// 이거 나중에 streamObject 없애볼 것 (없어도 될 것 같은데...)
		startRecording();
	} catch (error) {
		recordBtn.innerHTML = "레코딩할 수 없습니다.";
		console.log("레코딩할 수 없습니다.");
	} finally {
		recordBtn.removeEventListener("click", getVideo);
	}
};

function init() {
	console.log("시작");
	recordBtn.addEventListener("click", getVideo);
}

if (recorderContainer) {
	init();
}