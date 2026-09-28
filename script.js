/* =========================================================
   ISA WU — THRESHOLD
   ROOM ARCHITECTURE

   THRESHOLD
        ↓
   ROOM 01 — COSMIC FIELD
        ↓
   ROOM 02 — PROJECTS
        ↓
   ROOM 03 — WRITING ON MY BODY
        ↓
   ROOM 04 — ABOUT / CONTACT

   Important:
   Rooms never scroll into one another.
   Scrolling only happens inside the current room.
========================================================= */


/* =========================================================
   CORE
========================================================= */

const body = document.body;
const main = document.getElementById("top");

const thresholdOverlay =
    document.getElementById("threshold-overlay");

const thresholdDot =
    document.getElementById("threshold-dot");

const cursorLight =
    document.getElementById("cursor-light");


/* =========================================================
   ROOMS
========================================================= */

const cosmicField =
    document.getElementById("cosmic-field");

const projects =
    document.getElementById("projects");

const writing =
    document.getElementById("writing");

const finalSpace =
    document.getElementById("final-space");


const rooms = {
    cosmic: cosmicField,
    projects: projects,
    writing: writing,
    final: finalSpace
};


let currentRoom = "threshold";

let transitionLocked = false;

let navigationUnlocked = false;


/* =========================================================
   GATEWAYS
========================================================= */

const cosmicGateway =
    document.getElementById("cosmic-gateway");

const writingGateway =
    document.getElementById("writing-gateway");

const finalGateway =
    document.getElementById("final-gateway");

const closingDot =
    document.getElementById("closing-dot");


/* =========================================================
   MOBILE INDEX
========================================================= */

const indexButton =
    document.getElementById("indexButton");

const indexMenu =
    document.getElementById("indexMenu");


if (indexButton && indexMenu) {

    indexButton.addEventListener("click", () => {
        indexMenu.classList.toggle("open");
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

    requestAnimationFrame(animateCursorLight);
}


if (cursorLight) {
    animateCursorLight();
}


/* =========================================================
   ROOM RESET
========================================================= */

function resetRoomScroll(room) {

    const section = rooms[room];

    if (!section) return;


    /* Vertical position */

    section.scrollTop = 0;


    /* Cosmic horizontal world */

    if (room === "cosmic") {

        const gallery =
            document.getElementById("cosmic-gallery");

        if (gallery) {
            gallery.scrollLeft = 0;
        }
    }

}


/* =========================================================
   UPDATE ACTIVE ROOM
========================================================= */

function setRoom(room) {

    currentRoom = room;


    body.setAttribute(
        "data-room",
        room
    );


    if (main) {

        main.setAttribute(
            "data-site-state",
            room
        );

    }


    Object.entries(rooms).forEach(
        ([name, section]) => {

            if (!section) return;

            section.classList.toggle(
                "is-room-active",
                name === room
            );

        }
    );


    if (room === "cosmic") {

        body.classList.add("room-cosmic");

    } else {

        body.classList.remove("room-cosmic");

    }


    if (room === "projects") {

        body.classList.add("room-projects");

    } else {

        body.classList.remove("room-projects");

    }


    if (room === "writing") {

        body.classList.add("room-writing");

    } else {

        body.classList.remove("room-writing");

    }


    if (room === "final") {

        body.classList.add("room-final");

        unlockNavigation();

    } else {

        body.classList.remove("room-final");

    }


    resetRoomScroll(room);

}


/* =========================================================
   NAVIGATION UNLOCK
========================================================= */

function unlockNavigation() {

    navigationUnlocked = true;

    body.classList.add(
        "navigation-unlocked"
    );

}


/* =========================================================
   OPEN ROOM

   This is the core mechanism.

   We do NOT scroll to the next section.
   We switch the active room.
========================================================= */

function openRoom(
    nextRoom,
    delay = 500
) {

    if (!rooms[nextRoom]) return;

    if (transitionLocked) return;

    if (currentRoom === nextRoom) return;


    transitionLocked = true;

    body.classList.add(
        "room-transition"
    );


    setTimeout(() => {

        setRoom(nextRoom);

    }, delay);


    setTimeout(() => {

        body.classList.remove(
            "room-transition"
        );

        transitionLocked = false;

    }, delay + 900);

}


/* =========================================================
   THRESHOLD
   INTRO -> ROOM 01
========================================================= */

function enterCosmicField() {

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


    setTimeout(() => {

        body.classList.add(
            "threshold-complete"
        );

        setRoom("cosmic");


    }, 1050);


    setTimeout(() => {

        body.classList.remove(
            "threshold-entering"
        );

        transitionLocked = false;

        if (thresholdOverlay) {

            thresholdOverlay.style.pointerEvents =
                "none";

        }

    }, 1750);

}


if (thresholdDot) {

    thresholdDot.addEventListener(
        "click",
        enterCosmicField
    );


    thresholdDot.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                enterCosmicField();

            }

        }
    );

}


/* =========================================================
   COSMIC FIELD
   Horizontal internal world
========================================================= */

const cosmicGallery =
    document.getElementById("cosmic-gallery");


let galleryDragging = false;

let galleryDragStartX = 0;

let galleryScrollStart = 0;


function updateCosmicSlidePosition() {

    if (!cosmicGallery) return;


    const width =
        cosmicGallery.clientWidth;


    if (!width) return;


    const index =
        Math.round(
            cosmicGallery.scrollLeft /
            width
        );


    cosmicGallery
        .querySelectorAll(
            ".cosmic-gallery-slide"
        )
        .forEach(
            (slide, slideIndex) => {

                slide.classList.toggle(
                    "is-current",
                    slideIndex === index
                );

            }
        );

}


if (cosmicGallery) {


    /* Wheel -> horizontal movement */

    cosmicGallery.addEventListener(
        "wheel",
        (event) => {

            if (
                currentRoom !== "cosmic"
            ) {
                return;
            }


            event.preventDefault();


            const delta =
                Math.abs(event.deltaY) >
                Math.abs(event.deltaX)
                    ? event.deltaY
                    : event.deltaX;


            cosmicGallery.scrollBy({

                left:
                    delta * 1.12,

                behavior:
                    "auto"

            });

        },
        {
            passive: false
        }
    );


    /* Mouse / pointer drag */

    cosmicGallery.addEventListener(
        "pointerdown",
        (event) => {

            if (
                currentRoom !== "cosmic"
            ) {
                return;
            }


            galleryDragging = true;

            galleryDragStartX =
                event.clientX;

            galleryScrollStart =
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

            if (!galleryDragging) {
                return;
            }


            const distance =
                event.clientX -
                galleryDragStartX;


            cosmicGallery.scrollLeft =
                galleryScrollStart -
                distance;

        }
    );


    const stopGalleryDrag = () => {

        galleryDragging = false;

        cosmicGallery.classList.remove(
            "is-dragging"
        );

    };


    cosmicGallery.addEventListener(
        "pointerup",
        stopGalleryDrag
    );


    cosmicGallery.addEventListener(
        "pointercancel",
        stopGalleryDrag
    );


    cosmicGallery.addEventListener(
        "scroll",
        () => {

            requestAnimationFrame(
                updateCosmicSlidePosition
            );

        }
    );

}


/* =========================================================
   COSMIC -> PROJECTS
   Only the planet opens ROOM 02
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
        "cosmic-gateway-opening"
    );


    setTimeout(() => {

        setRoom("projects");

    }, 700);


    setTimeout(() => {

        body.classList.remove(
            "cosmic-gateway-opening"
        );

        transitionLocked = false;

    }, 1500);

}


if (cosmicGateway) {

    cosmicGateway.addEventListener(
        "click",
        enterProjects
    );

}


/* =========================================================
   PROJECTS -> WRITING
   Star = second threshold
========================================================= */

const writingThreshold =
    document.getElementById(
        "writing-threshold"
    );


function enterWriting() {

    if (
        currentRoom !== "projects" ||
        transitionLocked
    ) {
        return;
    }


    transitionLocked = true;


    body.classList.add(
        "writing-gateway-opening"
    );


    if (writingThreshold) {

        writingThreshold.classList.add(
            "active"
        );

    }


    setTimeout(() => {

        setRoom("writing");

    }, 900);


    setTimeout(() => {

        if (writingThreshold) {

            writingThreshold.classList.add(
                "settled"
            );

        }

    }, 1350);


    setTimeout(() => {

        if (writingThreshold) {

            writingThreshold.classList.remove(
                "active",
                "settled"
            );

        }


        body.classList.remove(
            "writing-gateway-opening"
        );


        transitionLocked = false;

    }, 2500);

}


if (writingGateway) {

    writingGateway.addEventListener(
        "click",
        enterWriting
    );


    writingGateway.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                enterWriting();

            }

        }
    );

}


/* =========================================================
   WRITING SPACE
========================================================= */

const writingFragments =
    document.querySelectorAll(
        ".writing-fragment"
    );


const writingLights =
    document.querySelectorAll(
        ".water-glow"
    );


window.addEventListener(
    "mousemove",
    (event) => {

        if (
            currentRoom !== "writing"
        ) {
            return;
        }


        const x =
            event.clientX /
            window.innerWidth -
            0.5;


        const y =
            event.clientY /
            window.innerHeight -
            0.5;


        writingFragments.forEach(
            (fragment, index) => {

                const strength =
                    3 +
                    index * 0.7;


                fragment.style.setProperty(
                    "--text-x",
                    `${x * strength}px`
                );


                fragment.style.setProperty(
                    "--text-y",
                    `${y * strength}px`
                );

            }
        );


        writingLights.forEach(
            (light, index) => {

                const strength =
                    12 +
                    index * 7;


                light.style.setProperty(
                    "--light-x",
                    `${x * strength}px`
                );


                light.style.setProperty(
                    "--light-y",
                    `${y * strength}px`
                );

            }
        );

    }
);


/* =========================================================
   WRITING -> FINAL ROOM
========================================================= */

function enterFinalRoom() {

    if (
        currentRoom !== "writing" ||
        transitionLocked
    ) {
        return;
    }


    transitionLocked = true;


    body.classList.add(
        "final-gateway-opening"
    );


    setTimeout(() => {

        setRoom("final");

    }, 700);


    setTimeout(() => {

        body.classList.remove(
            "final-gateway-opening"
        );

        transitionLocked = false;

    }, 1500);

}


if (finalGateway) {

    finalGateway.addEventListener(
        "click",
        enterFinalRoom
    );

}


/* =========================================================
   FINAL ROOM
   This is the moment navigation is unlocked.
========================================================= */


/* =========================================================
   NAVIGATION SYSTEM

   Before FINAL:
   navigation is visually present but functionally locked.

   After FINAL:
   navigation opens actual rooms.
========================================================= */

const navigationLinks =
    document.querySelectorAll(
        ".side-nav a, .index-menu a"
    );


function handleNavigation(
    event,
    link
) {

    const href =
        link.getAttribute("href");


    if (!href) return;


    /* Site name / top */

    if (href === "#top") {

        event.preventDefault();

        if (!navigationUnlocked) {
            return;
        }

        returnToThreshold();

        return;
    }


    const target =
        href.replace("#", "");


    const directRoom =
        {
            "cosmic-field": "cosmic",
            "projects": "projects",
            "writing": "writing",
            "final-space": "final"
        }[target];


    /*
       Navigation is locked until ROOM 04.
    */

    if (!navigationUnlocked) {

        event.preventDefault();

        return;

    }


    /*
       Clicking a ROOM title
    */

    if (directRoom) {

        event.preventDefault();

        openRoom(
            directRoom,
            350
        );

        return;

    }


    /*
       About / Contact
       Stay inside FINAL ROOM.
    */

    if (
        target === "about" ||
        target === "contact"
    ) {

        event.preventDefault();


        if (
            currentRoom !== "final"
        ) {

            openRoom(
                "final",
                350
            );

            setTimeout(() => {

                document
                    .getElementById(target)
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            }, 850);


            return;
        }


        document
            .getElementById(target)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


        return;

    }


    /*
       Project / Lost City links
       They open their room first,
       then move INSIDE that room.
    */

    const element =
        document.getElementById(target);


    if (!element) return;


    const targetRoom =
        element.closest(
            "#cosmic-field"
        )
            ? "cosmic"
            :
        element.closest(
            "#projects"
        )
            ? "projects"
            :
        element.closest(
            "#writing"
        )
            ? "writing"
            :
        element.closest(
            "#final-space"
        )
            ? "final"
            :
        null;


    if (!targetRoom) return;


    event.preventDefault();


    if (
        currentRoom !== targetRoom
    ) {

        openRoom(
            targetRoom,
            350
        );


        setTimeout(() => {

            element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 850);


        return;

    }


    element.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


navigationLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            (event) => {

                handleNavigation(
                    event,
                    link
                );

            }
        );

    }
);


/* =========================================================
   RETURN TO THRESHOLD
========================================================= */

function returnToThreshold() {

    if (transitionLocked) {
        return;
    }


    transitionLocked = true;


    body.classList.add(
        "returning-to-threshold"
    );


    setTimeout(() => {

        Object.values(rooms)
            .forEach(
                (section) => {

                    if (!section) return;

                    section.classList.remove(
                        "is-room-active"
                    );

                    section.scrollTop = 0;

                }
            );


        if (cosmicGallery) {
            cosmicGallery.scrollLeft = 0;
        }


        body.classList.remove(
            "threshold-complete",
            "returning-to-threshold",
            "cosmic-gateway-opening",
            "writing-gateway-opening",
            "final-gateway-opening",
            "room-cosmic",
            "room-projects",
            "room-writing",
            "room-final"
        );


        body.setAttribute(
            "data-room",
            "threshold"
        );


        if (main) {

            main.setAttribute(
                "data-site-state",
                "threshold"
            );

        }


        if (thresholdOverlay) {

            thresholdOverlay.style.pointerEvents =
                "auto";

        }


        setTimeout(() => {

            transitionLocked = false;

        }, 500);


    }, 550);

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

Object.values(rooms)
    .forEach(
        (section) => {

            if (!section) return;

            section.classList.remove(
                "is-room-active"
            );

        }
    );


body.classList.remove(
    "threshold-entering",
    "threshold-complete",
    "cosmic-gateway-opening",
    "writing-gateway-opening",
    "final-gateway-opening",
    "returning-to-threshold",
    "room-cosmic",
    "room-projects",
    "room-writing",
    "room-final",
    "room-transition"
);


body.setAttribute(
    "data-room",
    "threshold"
);


if (main) {

    main.setAttribute(
        "data-site-state",
        "threshold"
    );

}
