document.addEventListener("contextmenu", function(e) {
	e.preventDefault();
});

document.addEventListener("keydown", function(e) {
	const isCtrl = e.ctrlKey;
	const isCmd = e.metaKey;
	if(isCtrl || isCmd) {
		e.preventDefault();
	}
	if(e.keyCode >= 112 && e.keyCode <= 123) {
		e.preventDefault();
	}
});

document.addEventListener("dragstart", function(e) {
	if(e.target.tagName === "IMG") {
		e.preventDefault();
	}
});

["copy", "paste", "cut"].forEach(eventType => {
	document.addEventListener(eventType, function(e) {
		e.preventDefault();
	});
});

document.addEventListener("dragover", function(e) {
	e.preventDefault();
});
document.addEventListener("drop", function(e) {
	e.preventDefault();
});

document.addEventListener("touchstart", function(e) {
	if(e.touches.length > 1) {
	    e.preventDefault();
	}
});
