/* =========================================================
   ISA WU — THRESHOLD / THREE INDEPENDENT SPACES

   INTRO  -> click white point -> COSMIC FIELD
   COSMIC -> click planet     -> PROJECTS
   PROJECTS -> click star     -> WRITING ON MY BODY
   WRITING -> scroll / closing surface -> ABOUT / CONTACT
   END -> click final point -> INTRO
========================================================= */

const body = document.body;
const main = document.getElementById("top");

const thresholdOverlay = document.getElementById("threshold-overlay");
const thresholdDot = document.getElementById("threshold-dot");
const cursorLight = document.getElementById("cursor-light");

const cosmicField = document.getElementById("cosmic-field");
const projects = document.getElementById("projects");
const writing = document.getElementById("writing");
const finalSpace = document.getElementById("final-space");

const cosmicGallery = document.getElementById("cosmic-gallery");
const cosmicGateway = document.getElementById("cosmic-gateway");

const writingThreshold = document.getElementById("writing-threshold");
const writingGateway = document.getElementById("writing-gateway");

const closingDot = document.getElementById("closing-dot");

const indexButton = document.getElementById("indexButton");
const indexMenu = document.getElementById("indexMenu");
const unitLinks = document.querySelectorAll("[data-unit-link]");

let currentRoom = "threshold";
let transitionLocked = false;
let galleryDragging = false;
let galleryDragStartX = 0;
let galleryScrollStart = 0;
let cursorAnimationStarted = false;


/* =========================================================
   HELPERS
========================================================= */

function setRoom(room) {
    currentRoom = room;

    if (main) {
        main.setAttribute("data-site-state", room);
    }

    body.setAttribute("data-room", room);

    if (room === "cosmic") {
        body.classList.add("room-lock", "room-cosmic");
    } else {
        body.classList.remove("room-lock", "room-cosmic");
    }

    const depth = {
        threshold: "0",
        cosmic: "1",
        projects: "2",
        writing: "3",
        final: "4"
    }[room] || "0";

    body.setAttribute("data-threshold-depth", depth);

    unitLinks.forEach((link) => {
        link.classList.toggle(
            "is-active",
            link.dataset.unitLink === room
        );
    });
}


function unlockDocument() {
    body.classList.remove("room-lock");
}


function lockDocument(room) {
    body.classList.add("room-lock", `room-${room}`);
}


function jumpToSection(section) {
    if (!section) return;

    const targetTop = section.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
        top: targetTop,
        behavior: "auto"
    });
}


function resetSectionScroll(section) {
    if (!section) return;

    const gallery = section.querySelector(".cosmic-gallery");

    if (gallery) {
        gallery.scrollTo({
            left: 0,
            behavior: "auto"
        });
    }
}


/* =========================================================
   MOBILE INDEX
========================================================= */

if (indexButton && indexMenu) {
    indexButton.addEventListener("click", () => {
        indexMenu.classList.toggle("open");
    });

    indexMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            indexMenu.classList.remove("open");
        });
    });
}


/* =========================================================
   CURSOR LIGHT
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

    lightX += (mouseX - lightX) * 0.075;
    lightY += (mouseY - lightY) * 0.075;

    cursorLight.style.left = `${lightX}px`;
    cursorLight.style.top = `${lightY}px`;

    if (!cursorAnimationStarted) {
        cursorAnimationStarted = true;
    }

    requestAnimationFrame(animateCursorLight);
}

if (cursorLight) {
    animateCursorLight();
}


/* =========================================================
   INTRO -> COSMIC FIELD
   The first white point is the first threshold.
========================================================= */

function enterCosmicField() {
    if (currentRoom !== "threshold" || transitionLocked) return;

    transitionLocked = true;

    body.classList.add("threshold-entering");

    setTimeout(() => {
        body.classList.add("threshold-complete");
        unlockDocument();
        jumpToSection(cosmicField);
        resetSectionScroll(cosmicField);
        setRoom("cosmic");
    }, 1050);

    setTimeout(() => {
        body.classList.remove("threshold-entering");
        transitionLocked = false;
        thresholdOverlay?.style.setProperty("pointer-events", "none");
    }, 1750);
}

if (thresholdDot) {
    thresholdDot.addEventListener("click", enterCosmicField);

    thresholdDot.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            enterCosmicField();
        }
    });
}


/* =========================================================
   COSMIC FIELD
   The page itself is locked. Only the image book moves.
========================================================= */

function updateCosmicSlidePosition() {
    if (!cosmicGallery) return;

    const width = cosmicGallery.clientWidth;
    if (!width) return;

    const index = Math.round(cosmicGallery.scrollLeft / width);

    cosmicGallery.querySelectorAll(".cosmic-gallery-slide").forEach((slide, slideIndex) => {
        slide.classList.toggle("is-current", slideIndex === index);
    });
}


if (cosmicGallery) {
    cosmicGallery.addEventListener("wheel", (event) => {
        if (currentRoom !== "cosmic") return;

        const dominantVertical = Math.abs(event.deltaY) >= Math.abs(event.deltaX);
        const dominantHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);

        if (dominantVertical || dominantHorizontal) {
            event.preventDefault();

            cosmicGallery.scrollBy({
                left: dominantVertical
                    ? event.deltaY * 1.12
                    : event.deltaX * 1.12,
                behavior: "auto"
            });
        }
    }, { passive: false });


    cosmicGallery.addEventListener("pointerdown", (event) => {
        if (currentRoom !== "cosmic") return;

        galleryDragging = true;
        galleryDragStartX = event.clientX;
        galleryScrollStart = cosmicGallery.scrollLeft;

        cosmicGallery.classList.add("is-dragging");
        cosmicGallery.setPointerCapture(event.pointerId);
    });


    cosmicGallery.addEventListener("pointermove", (event) => {
        if (!galleryDragging) return;

        const distance = event.clientX - galleryDragStartX;
        cosmicGallery.scrollLeft = galleryScrollStart - distance;
    });


    const stopGalleryDrag = () => {
        galleryDragging = false;
        cosmicGallery.classList.remove("is-dragging");
    };

    cosmicGallery.addEventListener("pointerup", stopGalleryDrag);
    cosmicGallery.addEventListener("pointercancel", stopGalleryDrag);

    cosmicGallery.addEventListener("scroll", () => {
        requestAnimationFrame(updateCosmicSlidePosition);
    });

    window.addEventListener("resize", () => {
        if (currentRoom !== "cosmic") return;

        const width = cosmicGallery.clientWidth;
        if (!width) return;

        const index = Math.round(cosmicGallery.scrollLeft / width);

        cosmicGallery.scrollTo({
            left: index * width,
            behavior: "auto"
        });
    });
}


/* =========================================================
   COSMIC PLANET -> PROJECTS
   This is a room change, not a normal section scroll.
========================================================= */

function enterProjects() {
    if (currentRoom !== "cosmic" || transitionLocked) return;

    transitionLocked = true;
    body.classList.add("cosmic-gateway-opening");

    setTimeout(() => {
        unlockDocument();
        jumpToSection(projects);
        setRoom("projects");
        window.scrollTo({
            top: projects ? projects.offsetTop : window.scrollY,
            behavior: "auto"
        });
    }, 720);

    setTimeout(() => {
        body.classList.remove("cosmic-gateway-opening");
        transitionLocked = false;
    }, 1400);
}

if (cosmicGateway) {
    cosmicGateway.addEventListener("click", enterProjects);
}


/* =========================================================
   PROJECT STAR -> WRITING ON MY BODY

   First the face appears as a white line.
   Then it darkens and becomes embedded in the field.
========================================================= */

function enterWriting() {
    if (currentRoom !== "projects" || transitionLocked) return;

    transitionLocked = true;

    body.classList.add("writing-gateway-opening");

    if (writingThreshold) {
        writingThreshold.classList.add("active");
    }

    setTimeout(() => {
        unlockDocument();
        jumpToSection(writing);
        setRoom("writing");
    }, 1000);

    setTimeout(() => {
        if (writingThreshold) {
            writingThreshold.classList.add("settled");
        }
    }, 1450);

    setTimeout(() => {
        if (writingThreshold) {
            writingThreshold.classList.remove("active", "settled");
        }

        body.classList.remove("writing-gateway-opening");
        transitionLocked = false;
    }, 2600);
}

if (writingGateway) {
    writingGateway.addEventListener("click", enterWriting);

    writingGateway.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            enterWriting();
        }
    });
}


/* =========================================================
   WRITING SPACE
   Soft movement for the underwater / pool-floor light.
========================================================= */

const writingFragments = document.querySelectorAll(".writing-fragment");
const writingLights = document.querySelectorAll(".water-glow");

window.addEventListener("mousemove", (event) => {
    if (currentRoom !== "writing") return;

    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    writingFragments.forEach((fragment, index) => {
        const strength = 3 + index * 0.7;

        fragment.style.setProperty(
            "--text-x",
            `${x * strength}px`
        );

        fragment.style.setProperty(
            "--text-y",
            `${y * strength}px`
        );
    });

    writingLights.forEach((light, index) => {
        const strength = 12 + index * 7;

        light.style.setProperty(
            "--light-x",
            `${x * strength}px`
        );

        light.style.setProperty(
            "--light-y",
            `${y * strength}px`
        );
    });
});


/* =========================================================
   ROOM STATE / NAVIGATION

   The main page may be scrolled in Projects and Final.
   Cosmic is locked to its own horizontal world.
========================================================= */

const roomObservers = [
    { element: cosmicField, room: "cosmic" },
    { element: projects, room: "projects" },
    { element: writing, room: "writing" },
    { element: finalSpace, room: "final" }
];

if ("IntersectionObserver" in window) {
    const roomObserver = new IntersectionObserver((entries) => {
        if (transitionLocked || currentRoom === "threshold") return;

        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible.length) return;

        const target = visible[0].target;
        const match = roomObservers.find((room) => room.element === target);

        if (!match) return;

        /* Never steal the explicit locked Cosmic state. */
        if (currentRoom === "cosmic") return;

        setRoom(match.room);
    }, {
        threshold: [0.18, 0.45, 0.7]
    });

    roomObservers.forEach((room) => {
        if (room.element) roomObserver.observe(room.element);
    });
}


/* =========================================================
   DIRECT SIDEBAR NAVIGATION
   The index remains useful, but it does not erase the room logic.
========================================================= */

unitLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetRoom = link.dataset.unitLink;

        if (!targetRoom || targetRoom === "cosmic") return;

        event.preventDefault();

        transitionLocked = false;
        unlockDocument();

        const target = document.getElementById(
            targetRoom === "writing" ? "writing" : targetRoom
        );

        if (target) {
            jumpToSection(target);
            setRoom(targetRoom);
        }
    });
});


/* =========================================================
   FINAL DOT -> RETURN TO THE FIRST THRESHOLD
========================================================= */

function returnToThreshold() {
    if (transitionLocked) return;

    transitionLocked = true;
    body.classList.add("returning-to-threshold");

    setTimeout(() => {
        unlockDocument();

        window.scrollTo({
            top: 0,
            behavior: "auto"
        });
    }, 550);

    setTimeout(() => {
        body.classList.remove(
            "threshold-complete",
            "returning-to-threshold",
            "cosmic-gateway-opening",
            "writing-gateway-opening"
        );

        body.setAttribute("data-threshold-depth", "0");
        setRoom("threshold");

        if (thresholdOverlay) {
            thresholdOverlay.style.pointerEvents = "auto";
        }

        transitionLocked = false;
    }, 1250);
}

if (closingDot) {
    closingDot.addEventListener("click", returnToThreshold);
}


/* =========================================================
   INITIAL STATE
========================================================= */

setRoom("threshold");

body.classList.remove(
    "threshold-entering",
    "threshold-complete",
    "cosmic-gateway-opening",
    "writing-gateway-opening",
    "returning-to-threshold"
);

window.scrollTo({
    top: 0,
    behavior: "auto"
});
