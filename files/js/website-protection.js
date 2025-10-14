document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

document.addEventListener("keydown", function (e) {
    const isCtrl = e.ctrlKey;
    const isCmd = e.metaKey;

    if (isCtrl || isCmd) {
        e.preventDefault();
    }

    if (e.keyCode >= 112 && e.keyCode <= 123) {
        e.preventDefault();
    }
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("../sw.js")
        .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
            console.log("Service Worker registration failed:", error);
        });
}