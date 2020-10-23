import axios from "axios";

const addCommentForm = document.getElementById("js-addComment");
const commentList = document.getElementById("js-commentList");
const commentNumber = document.getElementById("js-commentNumber");

let commentSpanList = document.querySelectorAll(".js-comment-span");

const increaseNumber = () => {
	commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const decreaseNumber = () => {
	commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const addComment = (responseText) => {
	const li = document.createElement("li");
	li.id = responseText.commentId;

	const span = document.createElement("span");
	span.innerHTML = `[${responseText.creatorName}] ${responseText.comment}`;

	li.appendChild(span);

	console.log(li.id);

	createRemoveBtn(span);
	
	commentList.prepend(li);

	increaseNumber();
};

const removeComment = li => {
	li.remove();

	decreaseNumber();
}

const sendComment = async comment => {
	const videoId = window.location.href.split("/videos/")[1];

	const response = await axios({
		url: `/api/${videoId}/comment`,
		method: "POST",
		data: {
			comment
		}
	});

	if (response.status === 200) {
		addComment(JSON.parse(response.request.responseText));
	}
};

const sendRemoveComment = async li => {
	const videoId = window.location.href.split("/videos/")[1];

	const response = await axios({
		url: `/api/${videoId}/remove-comment`,
		method: "POST",
		data: {
			commentId: li.id
		}
	});

	if (response.status === 200) {
		removeComment(li);
	}
}

const handleSubmit = event => {
	event.preventDefault();

	const commentInput = addCommentForm.querySelector("input");
	const comment = commentInput.value;

	sendComment(comment);

	commentInput.value = "";
};

const handleRemoveSubmit = event => {
	event.preventDefault();

	sendRemoveComment(event.target.parentNode.parentNode);
}

const createRemoveBtn = (span) => {
	if (span.parentNode.id === "")
		return;

	const removeForm = document.createElement("form");
	
	const removeSubmit = document.createElement("input");
	removeSubmit.type = "submit"
	removeSubmit.value = "❌"
	removeForm.appendChild(removeSubmit);

	span.appendChild(removeForm);

	removeForm.addEventListener("submit", handleRemoveSubmit);
}

function init() {
	addCommentForm.addEventListener("submit", handleSubmit);

	commentSpanList.forEach((commentSpan) => {
		createRemoveBtn(commentSpan);
	});
}

if (addCommentForm) {
	init();
}