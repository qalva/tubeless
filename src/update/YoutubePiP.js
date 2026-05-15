const targetNode = document.querySelector("title"),
    observer = new MutationObserver((t => {
        t.forEach((t => {
            CheckURL()
        }))
    })),
    config = {
        childList: !0,
        subtree: !0
    };

function CheckURL() {
    const isWatch = window.location.href.includes("youtube.com/watch");
    const isShorts = window.location.href.includes("youtube.com/shorts");
    if (!isWatch && !isShorts) return;

    if (isWatch && document.getElementById("FTV_screenshot")) return;

    FTV_style();
    if (isWatch) {
        FTV_feature_PiP();
        FTV_feature_theater();
    }
    FTV_feature_screenshot(isShorts);
    FTV_feature_volume();
}

function FTV_style() {
    const t = document.createElement("style");
    t.textContent = "\n        #FTV_screenshot::before {\n\t\t\twidth: 100%;\n\t\t}\n\t\t#FTV_screenshot {\n\t\t\tcolor:red;\n\t\t\tfont-weight: bold;\n\t\t\twidth: auto;\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t}\n\t\t.ytp-volume-slider-handle, \n        .ytp-volume-slider-handle::before,\n        .ytp-volume-slider-handle::after {\n            background: red !important;\n        }\n        .ytp-volume-icon.ytp-button svg path {\n            fill: red !important;\n        }\n    ", document.head.appendChild(t)
}

function FTV_feature_PiP() {
    let t = document.querySelector('button[data-tooltip-target-id="ytp-pip-button"]') ||
            document.querySelector('.ytp-pip-button.ytp-button');
    if (!t) return;
    t.style.display = "", t.querySelector("svg path").style.fill = "red", t.querySelector("svg").style.padding = "0", t.querySelector("svg path").style.transform = "scale(0.8) translate(5px, 5px)"
}

function FTV_feature_volume() {
    const t = setInterval((() => {
        const e = document.querySelector("video");
        if (!e) return;
        clearInterval(t);
        const n = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "volume"),
            o = n.set,
            r = n.get.call(e);
        let l = Math.pow(r, .5);
        Object.defineProperty(e, "volume", {
            configurable: !0,
            get: () => l,
            set(t) {
                l = Math.min(Math.max(t, 0), 1), o.call(e, l)
            }
        }), o.call(e, l)
    }), 300)
}

const FTV_TEXT = {
    en: { screenshot: "Screenshot", screenshotCaptured: "Screenshot captured" },
    ar: { screenshot: "لقطة شاشة", screenshotCaptured: "تم التقاط لقطة الشاشة" },
    fr: { screenshot: "Capture d'écran", screenshotCaptured: "Capture d'écran effectuée" },
    es: { screenshot: "Captura", screenshotCaptured: "Captura de pantalla realizada" },
    de: { screenshot: "Screenshot", screenshotCaptured: "Screenshot aufgenommen" }
};

function getFTVText(key) {
    const lang = document.documentElement.lang?.split("-")[0] || "en";
    return (FTV_TEXT[lang] || FTV_TEXT.en)[key];
}

function FTV_feature_screenshot(isShorts) {
    const container = isShorts 
        ? document.querySelector('ytd-reel-video-renderer[is-active] #actions') 
        : document.querySelector('#movie_player .ytp-right-controls') || document.querySelector('.ytp-right-controls');
    
    if (!container || (isShorts && container.querySelector('#FTV_screenshot'))) return;

    const e = isShorts ? null : (document.querySelector('button[data-tooltip-target-id="ytp-pip-button"]') ||
                                  document.querySelector('.ytp-pip-button')),
        n = document.createElement("button");
    n.id = "FTV_screenshot", n.className = "ytp-button";
    
    if (isShorts) {
        n.style.margin = "8px 0";
        n.style.padding = "0 8px";
        n.style.fontSize = "12px";
        n.style.color = "white";
    }
    
    n.textContent = getFTVText("screenshot"), n.onclick = FTV_canvas;
    
    if (isShorts) {
        container.appendChild(n);
    } else {
        container.insertBefore(n, e);
    }
}

function FTV_canvas() {
    const isShorts = window.location.pathname.startsWith('/shorts/');
    let video;
    if (isShorts) {
        video = document.querySelector('ytd-reel-video-renderer[is-active] video') || 
                document.querySelector('ytd-shorts video') || 
                document.querySelector('#shorts-container video');
    } else {
        video = document.querySelector('#movie_player video') || 
                document.querySelector('video.html5-main-video') || 
                document.querySelector('video');
    }
    
    if (!video || video.videoWidth === 0) return;

    const canvas = document.createElement("canvas"),
        app = document.querySelector("ytd-app");
    canvas.width = video.videoWidth, canvas.height = video.videoHeight;
    canvas.style.display = "none", document.body.insertBefore(canvas, app);
    
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL("image/png"),
        link = document.createElement("a");
    link.href = dataUrl;
    
    const activeReel = isShorts ? document.querySelector('ytd-reel-video-renderer[is-active]') : null;
    const pr = activeReel?.playerResponse || 
               activeReel?.data?.playerResponse || 
               activeReel?.__data?.playerResponse || 
               activeReel?.videoData?.playerResponse ||
               activeReel?.__data?.videoData?.playerResponse ||
               activeReel?.activePlayerResponse;
    
    let title = isShorts 
        ? (pr?.videoDetails?.title || activeReel?.querySelector('#title')?.innerText || "Shorts")
        : (document.querySelector("#title yt-formatted-string")?.innerText || document.title);
    
    link.download = title.trim() + " [qalva].png", document.body.appendChild(link), link.click(), document.body.removeChild(link);

    
    window.dispatchEvent(new CustomEvent('YTPLUS_SCREENSHOT_CAPTURED'));
}

function FTV_feature_theater() {
    let t = document.createElement("style");
    t.type = "text/css";
    const e = `\n\tytd-watch-flexy[theater] #player-full-bleed-container.ytd-watch-flexy, ytd-watch-grid[theater] #player-full-bleed-container.ytd-watch-grid {\n\t\theight: 100vh !important;\n\t\tmax-height: calc(100vh - ${document.getElementById("masthead-container").clientHeight}px) !important;\n\t}\n\tytd-watch-flexy[fullscreen] #player-full-bleed-container.ytd-watch-flexy, ytd-watch-grid[fullscreen] #player-full-bleed-container.ytd-watch-grid {\n\t\tmax-height: 100vh !important;\n\t\tmin-height: 100vh !important;\n\t}\n\tytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy, ytd-watch-grid[full-bleed-player] #full-bleed-container.ytd-watch-grid {\n\t\tblock-size: fit-content !important;\n\t\tmax-height: fit-content !important;\n\t}\n\t.ytp-size-button.ytp-button svg path {\n\t\tfill: red;\n\t}\n\t`;
    t.appendChild(document.createTextNode(e)), document.head.appendChild(t)
}
observer.observe(targetNode, config);
document.addEventListener('yt-navigate-finish', CheckURL);
window.addEventListener('yt-page-data-updated', CheckURL);
