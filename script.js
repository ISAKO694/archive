/* =========================================================
   ISA WU — THRESHOLD
   THREE ROOMS / TWO THRESHOLD GATES

   1. White point      -> Cosmic Field
   2. Planet           -> Projects
   3. Star             -> Writing on My Body
   4. Closing point    -> return to the first screen
========================================================= */

const body = document.body;
const main = document.getElementById("top");

const thresholdOverlay = document.getElementById("threshold-overlay");
const thresholdDot = document.getElementById("threshold-dot");
const cursorLight = document.getElementById("cursor-light");

const cosmicField = document.getElementById("cosmic-field");
const projects = document.getElementById("projects");
const writing = document.getElementById("writing");
const finalSpace = document.getElementById("about-contact");

const cosmicGallery = document.getElementById("cosmic-gallery");
const cosmicGateway = document.getElementById("cosmic-gateway");

const writingGateway = document.getElementById("writing-gateway");
const writingThreshold = document.getElementById("writing-threshold");

const closingDot = document.getElementById("closing-dot");

const indexButton = document.getElementById("indexButton");
const indexMenu = document.getElementById("indexMenu");

const unitLinks = document.querySelectorAll("[data-unit-link]");
const allAnchors = document.querySelectorAll("a[href^='#']");

let currentRoom = "threshold";
let transitionLocked = false;

let galleryDragging = false;
let galleryPointerId = null;
let galleryStartX = 0;
let galleryStartScrollLeft = 0;


/* =========================================================
   ROOM STATE
========================================================= */

const roomDepth = {
    threshold: "0",
    cosmic: "1",
    projects: "2",
    writing: "3",
    final: "4"
};


function setRoom(room) {

    currentRoom = room;

    body.dataset.room = room;
    body.dataset.thresholdDepth =
        roomDepth[room] || "0";

    if (main) {
        main.dataset.siteState = room;
    }


    unitLinks.forEach((link) => {

        link.classList.toggle(
            "is-active",
            link.dataset.unitLink === room
        );

    });

}


function unlockPage() {

    body.classList.remove("room-lock");

}


function lockPage() {

    body.classList.add("room-lock");

}


function scrollToRoom(element) {

    if (!element) return;

    const y =
        element.getBoundingClientRect().top +
        window.scrollY;

    window.scrollTo({
        top: y,
        behavior: "auto"
    });

}


/* =========================================================
   MOBILE INDEX
========================================================= */

if (indexButton && indexMenu) {

    indexButton.addEventListener(
        "click",
        () => {

            indexMenu.classList.toggle(
                "open"
            );

        }
    );


    indexMenu
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    indexMenu.classList.remove(
                        "open"
                    );

                }
            );

        });

}


/* =========================================================
   CURSOR LIGHT
========================================================= */

let mouseX =
    window.innerWidth / 2;

let mouseY =
    window.innerHeight / 2;

let lightX = mouseX;
let lightY = mouseY;


window.addEventListener(
    "mousemove",
    (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

    }
);


function animateCursorLight() {

    if (!cursorLight) return;


    lightX +=
        (mouseX - lightX) * 0.08;

    lightY +=
        (mouseY - lightY) * 0.08;


    cursorLight.style.left =
        `${lightX}px`;

    cursorLight.style.top =
        `${lightY}px`;


    requestAnimationFrame(
        animateCursorLight
    );

}


animateCursorLight();


/* =========================================================
   01. WHITE POINT -> COSMIC FIELD
========================================================= */

function enterCosmic() {

    if (
        currentRoom !== "threshold" ||
        transitionLocked
    ) {
        return;
    }


    transitionLocked = true;


    body.classList.add(
        "threshold-entering"
    );


    /*
        The point contracts first.
        Then the threshold opens.
    */

    window.setTimeout(
        () => {

            body.classList.add(
                "threshold-complete"
            );


            lockPage();


            scrollToRoom(
                cosmicField
            );


            setRoom(
                "cosmic"
            );

        },
        1050
    );


    /*
        Leave enough time for the
        visual transition to finish.
    */

    window.setTimeout(
        () => {

            body.classList.remove(
                "threshold-entering"
            );


            transitionLocked = false;

        },
        1700
    );

}


if (thresholdDot) {

    thresholdDot.addEventListener(
        "click",
        enterCosmic
    );


    thresholdDot.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                enterCosmic();

            }

        }
    );

}


/* =========================================================
   COSMIC FIELD / HORIZONTAL BOOK

   Cosmic Field is a closed room.

   The user moves horizontally through
   one image at a time.

   Mouse wheel gestures are converted
   into horizontal gallery movement.

   Dragging also works.
========================================================= */

function cosmicSlideWidth() {

    return cosmicGallery
        ? cosmicGallery.clientWidth
        : 0;

}


function currentCosmicIndex() {

    const width =
        cosmicSlideWidth();

    if (!width) {
        return 0;
    }


    return Math.round(
        cosmicGallery.scrollLeft /
        width
    );

}


function updateCosmicSlideState() {

    if (!cosmicGallery) {
        return;
    }


    const index =
        currentCosmicIndex();


    cosmicGallery
        .querySelectorAll(
            ".cosmic-slide"
        )
        .forEach(
            (slide, i) => {

                slide.classList.toggle(
                    "is-current",
                    i === index
                );

            }
        );

}


function goToCosmicSlide(index) {

    if (!cosmicGallery) {
        return;
    }


    const slides =
        cosmicGallery.querySelectorAll(
            ".cosmic-slide"
        );


    const safeIndex =
        Math.max(
            0,
            Math.min(
                index,
                slides.length - 1
            )
        );


    cosmicGallery.scrollTo({

        left:
            safeIndex *
            cosmicSlideWidth(),

        behavior: "smooth"

    });

}


if (cosmicGallery) {


    /* -----------------------------------------
       Mouse wheel -> horizontal movement
    ----------------------------------------- */

    cosmicGallery.addEventListener(
        "wheel",
        (event) => {

            if (
                currentRoom !== "cosmic"
            ) {
                return;
            }


            event.preventDefault();


            const raw =
                Math.abs(event.deltaX) >
                Math.abs(event.deltaY)

                    ? event.deltaX

                    : event.deltaY;


            const direction =
                raw > 0 ? 1 : -1;


            goToCosmicSlide(
                currentCosmicIndex() +
                direction
            );

        },
        {
            passive: false
        }
    );


    /* -----------------------------------------
       Pointer drag
    ----------------------------------------- */

    cosmicGallery.addEventListener(
        "pointerdown",
        (event) => {

            if (
                currentRoom !== "cosmic"
            ) {
                return;
            }


            galleryDragging = true;

            galleryPointerId =
                event.pointerId;

            galleryStartX =
                event.clientX;

            galleryStartScrollLeft =
                cosmicGallery.scrollLeft;


            cosmicGallery.classList.add(
                "is-dragging"
            );


            cosmicGallery.setPointerCapture(
                event.pointerId
            );

        }
    );


    cosmicGallery.addEventListener(
        "pointermove",
        (event) => {

            if (
                !galleryDragging ||
                event.pointerId !==
                    galleryPointerId
            ) {
                return;
            }


            const distance =
                event.clientX -
                galleryStartX;


            cosmicGallery.scrollLeft =
                galleryStartScrollLeft -
                distance;

        }
    );


    function stopGalleryDrag() {

        if (!galleryDragging) {
            return;
        }


        galleryDragging = false;

        galleryPointerId = null;


        cosmicGallery.classList.remove(
            "is-dragging"
        );


        goToCosmicSlide(
            currentCosmicIndex()
        );

    }


    cosmicGallery.addEventListener(
        "pointerup",
        stopGalleryDrag
    );


    cosmicGallery.addEventListener(
        "pointercancel",
        stopGalleryDrag
    );


    /* -----------------------------------------
       Track current image
    ----------------------------------------- */

    cosmicGallery.addEventListener(
        "scroll",
        () => {

            requestAnimationFrame(
                updateCosmicSlideState
            );

        }
    );


    /* -----------------------------------------
       Keep slide position stable
    ----------------------------------------- */

    window.addEventListener(
        "resize",
        () => {

            if (
                currentRoom !== "cosmic"
            ) {
                return;
            }


            cosmicGallery.scrollTo({

                left:
                    currentCosmicIndex() *
                    cosmicSlideWidth(),

                behavior: "auto"

            });

        }
    );

}


/* =========================================================
   02. PLANET -> PROJECTS

   The planet is the exit from Cosmic Field.

   It is intentionally separate from
   normal gallery movement.
========================================================= */

function enterProjects() {

    if (
        currentRoom !== "cosmic" ||
        transitionLocked
    ) {
        return;
    }


    transitionLocked = true;


    body.classList.add(
        "cosmic-opening"
    );


    /*
        Cosmic space contracts first.
    */

    window.setTimeout(
        () => {

            unlockPage();


            scrollToRoom(
                projects
            );


            setRoom(
                "projects"
            );

        },
        680
    );


    window.setTimeout(
        () => {

            body.classList.remove(
                "cosmic-opening"
            );


            transitionLocked = false;

        },
        1250
    );

}


if (cosmicGateway) {

    cosmicGateway.addEventListener(
        "click",
        enterProjects
    );

}


/* =========================================================
   03. STAR -> WRITING ON MY BODY

   This transition is deliberately different.

   The female face appears first,
   then settles into the black field,
   and only then does Writing appear.
========================================================= */

function enterWriting() {

    if (
        currentRoom !== "projects" ||
        transitionLocked
    ) {
        return;
    }


    transitionLocked = true;


    body.classList.add(
        "writing-opening"
    );


    if (writingThreshold) {

        writingThreshold.classList.add(
            "active"
        );

    }


    /*
        First stage:
        the white face outline emerges.
    */

    window.setTimeout(
        () => {

            scrollToRoom(
                writing
            );


            setRoom(
                "writing"
            );

        },
        980
    );


    /*
        Second stage:
        the face stops floating and
        becomes embedded in the black.
    */

    window.setTimeout(
        () => {

            if (writingThreshold) {

                writingThreshold.classList.add(
                    "settled"
                );

            }

        },
        1450
    );


    /*
        Finish transition.
    */

    window.setTimeout(
        () => {

            if (writingThreshold) {

                writingThreshold.classList.remove(
                    "active",
                    "settled"
                );

            }


            body.classList.remove(
                "writing-opening"
            );


            transitionLocked = false;

        },
        2650
    );

}


if (writingGateway) {

    writingGateway.addEventListener(
        "click",
        enterWriting
    );

}


/* =========================================================
   VERTICAL ROOM STATE

   Important:
   scrolling only changes the visual locator.

   It does NOT automatically open the next room.

   The threshold object must still be clicked.
========================================================= */

const verticalRooms = [

    {
        element: projects,
        room: "projects"
    },

    {
        element: writing,
        room: "writing"
    },

    {
        element: finalSpace,
        room: "final"
    }

];


function updateRoomFromScroll() {

    if (
        transitionLocked ||
        currentRoom === "cosmic" ||
        currentRoom === "threshold"
    ) {
        return;
    }


    const center =
        window.innerHeight * 0.5;


    let best = null;

    let bestDistance =
        Infinity;


    verticalRooms.forEach(
        ({ element, room }) => {

            if (!element) {
                return;
            }


            const rect =
                element.getBoundingClientRect();


            const top =
                rect.top;

            const bottom =
                rect.bottom;


            if (
                top <= center &&
                bottom >= center
            ) {

                const distance =
                    Math.abs(
                        (top + bottom) / 2 -
                        center
                    );


                if (
                    distance <
                    bestDistance
                ) {

                    best = room;

                    bestDistance =
                        distance;

                }

            }

        }
    );


    if (best) {

        setRoom(best);

    }

}


window.addEventListener(
    "scroll",
    () => {

        requestAnimationFrame(
            updateRoomFromScroll
        );

    },
    {
        passive: true
    }
);


/* =========================================================
   SIDEBAR / MOBILE INDEX

   Navigation can locate a room,
   but it does not destroy the threshold system.
========================================================= */

unitLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetRoom =
                    link.dataset.unitLink;


                if (!targetRoom) {
                    return;
                }


                event.preventDefault();


                /* Cosmic Field */

                if (
                    targetRoom === "cosmic"
                ) {

                    unlockPage();

                    body.classList.add(
                        "threshold-complete"
                    );


                    scrollToRoom(
                        cosmicField
                    );


                    lockPage();


                    setRoom(
                        "cosmic"
                    );


                    return;

                }


                /* Projects / Writing */

                const target =
                    targetRoom === "projects"
                        ? projects
                        : writing;


                if (!target) {
                    return;
                }


                unlockPage();


                scrollToRoom(
                    target
                );


                setRoom(
                    targetRoom
                );

            }
        );

    }
);


/* =========================================================
   NORMAL ANCHOR LINKS
========================================================= */

allAnchors.forEach(
    (link) => {

        link.addEventListener(
            "click",
            (event) => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !href ||
                    href === "#" ||
                    href === "#cosmic-field" ||
                    href === "#projects" ||
                    href === "#writing"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        href
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                unlockPage();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }
);


/* =========================================================
   CLOSING POINT -> RETURN TO THRESHOLD

   The final point closes the whole route
   and returns the visitor to the beginning.
========================================================= */

function returnToThreshold() {

    if (transitionLocked) {
        return;
    }


    transitionLocked = true;


    body.classList.add(
        "returning-to-threshold"
    );


    /*
        Let the closing space darken first.
    */

    window.setTimeout(
        () => {

            window.scrollTo({
                top: 0,
                behavior: "auto"
            });

        },
        420
    );


    /*
        Restore the first state.
    */

    window.setTimeout(
        () => {

            body.classList.remove(
                "threshold-complete",
                "returning-to-threshold",
                "writing-opening",
                "cosmic-opening"
            );


            if (thresholdOverlay) {

                thresholdOverlay.style.pointerEvents =
                    "auto";

            }


            unlockPage();


            setRoom(
                "threshold"
            );


            transitionLocked = false;

        },
        1050
    );

}


if (closingDot) {

    closingDot.addEventListener(
        "click",
        returnToThreshold
    );

}


/* =========================================================
   INITIAL STATE
========================================================= */

setRoom(
    "threshold"
);

lockPage();


window.scrollTo({
    top: 0,
    behavior: "auto"
});
