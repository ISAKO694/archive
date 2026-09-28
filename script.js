/* =========================================================
   ISA WU — THRESHOLD
========================================================= */


/* =========================================================
   THRESHOLD INTRO
========================================================= */

const thresholdOverlay =
    document.getElementById("threshold-overlay");

const thresholdDot =
    document.getElementById("threshold-dot");

const cursorLight =
    document.getElementById("cursor-light");


/* ---------------------------------------------------------
   Cursor light
--------------------------------------------------------- */

if (thresholdOverlay && cursorLight) {

    window.addEventListener("mousemove", (event) => {

        cursorLight.style.left =
            event.clientX + "px";

        cursorLight.style.top =
            event.clientY + "px";

    });

}


/* ---------------------------------------------------------
   Enter the website
--------------------------------------------------------- */

if (thresholdDot) {

    thresholdDot.addEventListener("click", () => {

        document.body.classList.add(
            "threshold-entering"
        );

        setTimeout(() => {

            document.body.classList.remove(
                "threshold-entering"
            );

            document.body.classList.add(
                "threshold-complete"
            );

        }, 1250);

    });

}


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


    indexMenu
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener("click", () => {

                indexMenu.classList.remove(
                    "open"
                );

            });

        });

}


/* =========================================================
   COSMIC GALLERY
   Mouse drag + touch
========================================================= */

const galleries =
    document.querySelectorAll(
        ".cosmic-gallery"
    );


galleries.forEach((gallery) => {

    let isDown = false;

    let startX = 0;

    let scrollLeft = 0;


    gallery.addEventListener(
        "mousedown",
        (event) => {

            isDown = true;

            gallery.classList.add(
                "is-dragging"
            );

            startX =
                event.pageX -
                gallery.offsetLeft;

            scrollLeft =
                gallery.scrollLeft;

        }
    );


    gallery.addEventListener(
        "mouseleave",
        () => {

            isDown = false;

            gallery.classList.remove(
                "is-dragging"
            );

        }
    );


    gallery.addEventListener(
        "mouseup",
        () => {

            isDown = false;

            gallery.classList.remove(
                "is-dragging"
            );

        }
    );


    gallery.addEventListener(
        "mousemove",
        (event) => {

            if (!isDown) {
                return;
            }

            event.preventDefault();

            const x =
                event.pageX -
                gallery.offsetLeft;

            const walk =
                (x - startX) * 1.2;

            gallery.scrollLeft =
                scrollLeft - walk;

        }
    );


    let touchStart = 0;

    let touchScroll = 0;


    gallery.addEventListener(
        "touchstart",
        (event) => {

            touchStart =
                event.touches[0].pageX;

            touchScroll =
                gallery.scrollLeft;

        },
        {
            passive: true
        }
    );


    gallery.addEventListener(
        "touchmove",
        (event) => {

            const current =
                event.touches[0].pageX;

            const difference =
                current - touchStart;

            gallery.scrollLeft =
                touchScroll - difference;

        },
        {
            passive: true
        }
    );

});


/* =========================================================
   SPACE GATEWAYS
========================================================= */

const projectsGateway =
    document.getElementById(
        "projectsGateway"
    );

const writingGateway =
    document.getElementById(
        "writingGateway"
    );


function enterSpace(trigger, target) {

    if (!trigger || !target) {
        return;
    }


    trigger.classList.add(
        "triggering"
    );


    setTimeout(() => {

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        setTimeout(() => {

            trigger.classList.remove(
                "triggering"
            );

        }, 800);

    }, 180);

}


/* ---------------------------------------------------------
   Cosmic Field → Projects
--------------------------------------------------------- */

if (projectsGateway) {

    projectsGateway.addEventListener(
        "click",
        () => {

            const projects =
                document.getElementById(
                    "projects"
                );

            enterSpace(
                projectsGateway,
                projects
            );

        }
    );

}


/* ---------------------------------------------------------
   Projects → Writing
--------------------------------------------------------- */

if (writingGateway) {

    writingGateway.addEventListener(
        "click",
        () => {

            const writing =
                document.getElementById(
                    "writing"
                );

            enterSpace(
                writingGateway,
                writing
            );

        }
    );

}


/* =========================================================
   WRITING WATER MOVEMENT
========================================================= */

const writingSection =
    document.getElementById(
        "writing"
    );

const writingFragments =
    document.querySelectorAll(
        ".writing-fragment"
    );


if (
    writingSection &&
    writingFragments.length
) {

    let ticking = false;


    window.addEventListener(
        "scroll",
        () => {

            if (ticking) {
                return;
            }


            window.requestAnimationFrame(
                () => {

                    const rect =
                        writingSection
                            .getBoundingClientRect();


                    const viewport =
                        window.innerHeight;


                    if (
                        rect.bottom < 0 ||
                        rect.top > viewport
                    ) {

                        ticking = false;

                        return;
                    }


                    const progress =
                        (
                            viewport -
                            rect.top
                        ) /
                        (
                            viewport +
                            rect.height
                        );


                    writingFragments.forEach(
                        (fragment, index) => {

                            const movement =
                                Math.sin(
                                    progress * 6 +
                                    index * 1.8
                                ) * 3;


                            fragment.style.marginTop =
                                movement + "px";

                        }
                    );


                    ticking = false;

                }
            );


            ticking = true;

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   SIDEBAR ACTIVE STATES
========================================================= */

const sections =
    document.querySelectorAll(
        "section[id], article[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".side-nav a"
    );


const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }


                const id =
                    entry.target.id;


                navLinks.forEach((link) => {

                    link.classList.remove(
                        "is-active"
                    );


                    if (
                        link.getAttribute(
                            "href"
                        ) === "#" + id
                    ) {

                        link.classList.add(
                            "is-active"
                        );

                    }

                });

            });

        },
        {
            rootMargin:
                "-35% 0px -55% 0px"
        }
    );


sections.forEach((section) => {

    observer.observe(section);

});


/* =========================================================
   CLOSING DOT
   Return to top / threshold
========================================================= */

const closingDot =
    document.getElementById(
        "closing-dot"
    );


if (closingDot) {

    closingDot.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}
