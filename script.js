/* =========================================================
   ISA WU — THRESHOLD
   Main interaction system
========================================================= */


/* =========================
   ELEMENTS
========================= */

const body = document.body;
const main = document.getElementById("top");

const thresholdOverlay = document.getElementById("threshold-overlay");
const thresholdDot = document.getElementById("threshold-dot");
const cursorLight = document.getElementById("cursor-light");

const bodyTrigger = document.getElementById("body-trigger");

const indexButton = document.getElementById("indexButton");
const indexMenu = document.getElementById("indexMenu");


/* =========================================================
   MOBILE INDEX
========================================================= */

if (indexButton && indexMenu) {

    indexButton.addEventListener("click", () => {
        indexMenu.classList.toggle("open");
    });


    const menuLinks = indexMenu.querySelectorAll("a");

    menuLinks.forEach(link => {

        link.addEventListener("click", () => {
            indexMenu.classList.remove("open");
        });

    });

}


/* =========================================================
   THRESHOLD CURSOR LIGHT
========================================================= */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let lightX = mouseX;
let lightY = mouseY;


window.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

});


function animateCursorLight() {

    if (!cursorLight) return;

    lightX += (mouseX - lightX) * 0.08;
    lightY += (mouseY - lightY) * 0.08;

    cursorLight.style.left = `${lightX}px`;
    cursorLight.style.top = `${lightY}px`;

    requestAnimationFrame(animateCursorLight);
}


animateCursorLight();


/* =========================================================
   THRESHOLD DOT
========================================================= */

let thresholdOpened = false;


function enterThreshold() {

    if (thresholdOpened) return;

    thresholdOpened = true;

    body.classList.add("threshold-entering");

    /*
        Slight delay lets the black-hole / light expansion
        happen before the overlay disappears.
    */

    window.setTimeout(() => {

        body.classList.add("threshold-complete");

        if (main) {
            main.setAttribute("data-site-state", "cosmic");
        }

    }, 1050);


    /*
        Remove the overlay from interaction after the
        transition has visually completed.
    */

    window.setTimeout(() => {

        if (thresholdOverlay) {
            thresholdOverlay.style.pointerEvents = "none";
        }

        body.classList.remove("threshold-entering");

    }, 1700);

}


if (thresholdDot) {

    thresholdDot.addEventListener("click", enterThreshold);

}


/* =========================================================
   KEYBOARD ACCESS
========================================================= */

if (thresholdDot) {

    thresholdDot.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            enterThreshold();

        }

    });

}


/* =========================================================
   SCROLL STATE
   Cosmic Field → Projects → Writing
========================================================= */

const cosmicField = document.getElementById("cosmic-field");
const projects = document.getElementById("projects");
const writing = document.getElementById("writing");


function getSectionProgress(section) {

    if (!section) return 0;

    const rect = section.getBoundingClientRect();

    const viewportCenter =
        window.innerHeight * 0.5;

    const sectionStart = rect.top;
    const sectionEnd = rect.bottom;

    const range =
        sectionEnd - sectionStart;

    if (range <= 0) return 0;

    const progress =
        (viewportCenter - sectionStart) / range;

    return Math.max(
        0,
        Math.min(1, progress)
    );

}


function updateSiteState() {

    if (!main || !thresholdOpened) return;


    const cosmicRect =
        cosmicField
            ? cosmicField.getBoundingClientRect()
            : null;

    const projectsRect =
        projects
            ? projects.getBoundingClientRect()
            : null;

    const writingRect =
        writing
            ? writing.getBoundingClientRect()
            : null;


    const viewportCenter =
        window.innerHeight * 0.5;


    /*
        Cosmic Field
    */

    if (
        cosmicRect &&
        viewportCenter >= cosmicRect.top &&
        viewportCenter < cosmicRect.bottom
    ) {

        main.setAttribute(
            "data-site-state",
            "cosmic"
        );

        body.setAttribute(
            "data-threshold-depth",
            "1"
        );

        return;
    }


    /*
        Projects
    */

    if (
        projectsRect &&
        viewportCenter >= projectsRect.top &&
        viewportCenter < projectsRect.bottom
    ) {

        main.setAttribute(
            "data-site-state",
            "projects"
        );

        body.setAttribute(
            "data-threshold-depth",
            "2"
        );

        return;
    }


    /*
        Writing on the Body
    */

    if (
        writingRect &&
        viewportCenter >= writingRect.top &&
        viewportCenter < writingRect.bottom
    ) {

        main.setAttribute(
            "data-site-state",
            "writing"
        );

        body.setAttribute(
            "data-threshold-depth",
            "3"
        );

        return;
    }


    /*
        Everything else
    */

    main.setAttribute(
        "data-site-state",
        "surface"
    );

    body.setAttribute(
        "data-threshold-depth",
        "0"
    );

}


let scrollTicking = false;


window.addEventListener("scroll", () => {

    if (!scrollTicking) {

        window.requestAnimationFrame(() => {

            updateSiteState();

            scrollTicking = false;

        });

        scrollTicking = true;

    }

});


/* =========================================================
   COSMIC FIELD PARALLAX
========================================================= */

const cosmicImages =
    document.querySelectorAll(
        ".photo-project .image-cosmic, " +
        ".photo-project .image-cosmic-small"
    );


window.addEventListener("scroll", () => {

    if (!thresholdOpened) return;

    const viewportCenter =
        window.innerHeight * 0.5;


    cosmicImages.forEach((image, index) => {

        const rect =
            image.getBoundingClientRect();

        const imageCenter =
            rect.top + rect.height * 0.5;

        const distance =
            imageCenter - viewportCenter;

        const movement =
            distance * -0.025;

        const rotation =
            index === 0
                ? movement * 0.01
                : movement * 0.018;


        image.style.transform =
            `translate3d(0, ${movement}px, 0) rotate(${rotation}deg)`;

    });

});


/* =========================================================
   BODY TRIGGER
========================================================= */

if (bodyTrigger) {

    bodyTrigger.addEventListener("mouseenter", () => {

        if (writing) {
            writing.classList.add("body-awakened");
        }

    });


    bodyTrigger.addEventListener("mouseleave", () => {

        if (writing) {
            writing.classList.remove("body-awakened");
        }

    });


    bodyTrigger.addEventListener("click", () => {

        if (!writing) return;

        writing.classList.toggle("body-open");

    });

}


/* =========================================================
   WRITING FRAGMENTS
   Slight movement based on cursor
========================================================= */

const writingFragments =
    document.querySelectorAll(
        ".writing-fragment"
    );


if (writingFragments.length) {

    window.addEventListener(
        "mousemove",
        (event) => {

            const x =
                (event.clientX / window.innerWidth) - 0.5;

            const y =
                (event.clientY / window.innerHeight) - 0.5;


            writingFragments.forEach(
                (fragment, index) => {

                    const strength =
                        2 + index * 0.8;

                    const moveX =
                        x * strength;

                    const moveY =
                        y * strength;


                    fragment.style.setProperty(
                        "--fragment-x",
                        `${moveX}px`
                    );

                    fragment.style.setProperty(
                        "--fragment-y",
                        `${moveY}px`
                    );

                }
            );

        }
    );

}


/* =========================================================
   WRITING BODY STATE
========================================================= */

function updateWritingState() {

    if (!writing) return;

    const rect =
        writing.getBoundingClientRect();

    const viewportCenter =
        window.innerHeight * 0.5;

    const distance =
        Math.abs(
            rect.top +
            rect.height * 0.5 -
            viewportCenter
        );

    const maxDistance =
        window.innerHeight * 1.2;

    const proximity =
        Math.max(
            0,
            1 - distance / maxDistance
        );


    writing.style.setProperty(
        "--writing-proximity",
        proximity.toFixed(3)
    );

}


window.addEventListener("scroll", () => {

    window.requestAnimationFrame(
        updateWritingState
    );

});


/* =========================================================
   IMAGE HOVER INFORMATION
========================================================= */

const imagePlaceholders =
    document.querySelectorAll(
        ".image-placeholder"
    );


imagePlaceholders.forEach(image => {

    image.addEventListener("mouseenter", () => {

        image.setAttribute(
            "data-hovering",
            "true"
        );

    });


    image.addEventListener("mouseleave", () => {

        image.removeAttribute(
            "data-hovering"
        );

    });

});


/* =========================================================
   SITE INITIALIZATION
========================================================= */

if (main) {

    main.setAttribute(
        "data-site-state",
        "threshold"
    );

}


/*
    Prevent the page from jumping to the middle
    before the Threshold has been opened.
*/

if (!thresholdOpened) {

    window.scrollTo(
        0,
        0
    );

}


/* =========================================================
   ACCESSIBILITY
========================================================= */

if (thresholdDot) {

    thresholdDot.setAttribute(
        "aria-pressed",
        "false"
    );

}


function updateThresholdAccessibility() {

    if (!thresholdDot) return;

    thresholdDot.setAttribute(
        "aria-pressed",
        thresholdOpened
            ? "true"
            : "false"
    );

}


if (thresholdDot) {

    thresholdDot.addEventListener(
        "click",
        updateThresholdAccessibility
    );

}
