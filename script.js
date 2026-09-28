document.addEventListener("DOMContentLoaded", () => {


    /* =========================================================
       THRESHOLD ENTRY
    ========================================================== */

    const body = document.body;

    const thresholdGate =
        document.getElementById("thresholdGate");

    const thresholdTrigger =
        document.getElementById("thresholdTrigger");

    const thresholdTransition =
        document.getElementById("thresholdTransition");


    if (thresholdTrigger) {

        thresholdTrigger.addEventListener("click", () => {

            thresholdTransition.classList.add("expand");

            body.classList.remove("threshold-locked");

            body.classList.add("threshold-opening");


            setTimeout(() => {

                body.classList.remove("threshold-opening");

                body.classList.add("threshold-open");

                window.scrollTo({
                    top: 0,
                    behavior: "instant"
                });

            }, 550);

        });

    }



    /* =========================================================
       CURSOR LIGHT
    ========================================================== */

    const cursorLight =
        document.getElementById("cursorLight");


    if (cursorLight && window.innerWidth > 850) {

        let mouseX = 0;
        let mouseY = 0;

        let currentX = 0;
        let currentY = 0;


        document.addEventListener("mousemove", (event) => {

            mouseX = event.clientX;
            mouseY = event.clientY;

        });


        function moveCursorLight() {

            currentX +=
                (mouseX - currentX) * 0.09;

            currentY +=
                (mouseY - currentY) * 0.09;


            cursorLight.style.transform =
                `translate(${currentX}px, ${currentY}px)`;


            requestAnimationFrame(moveCursorLight);

        }


        moveCursorLight();

    }



    /* =========================================================
       GRAPHIC THRESHOLD LINKS
    ========================================================== */

    const graphicTriggers =
        document.querySelectorAll(
            ".graphic-trigger"
        );


    graphicTriggers.forEach((trigger) => {

        trigger.addEventListener("click", () => {

            const target =
                trigger.dataset.target;


            const targetElement =
                document.querySelector(target);


            if (!targetElement) {
                return;
            }


            /*
             * Small visual change before
             * entering the next unit.
             */

            trigger.classList.add("triggering");


            setTimeout(() => {

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                trigger.classList.remove("triggering");

            }, 220);

        });

    });



    /* =========================================================
       MOBILE INDEX
    ========================================================== */

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

                    indexMenu.classList.remove("open");

                });

            });

    }



    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================== */

    const allSections =
        document.querySelectorAll(
            "main section[id]"
        );


    const sideLinks =
        document.querySelectorAll(
            ".side-nav a[href^='#']"
        );


    const sectionObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    const id =
                        entry.target.id;


                    sideLinks.forEach((link) => {

                        link.classList.remove(
                            "active"
                        );


                        if (
                            link.getAttribute("href")
                            === `#${id}`
                        ) {

                            link.classList.add(
                                "active"
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


    allSections.forEach((section) => {

        sectionObserver.observe(section);

    });



    /* =========================================================
       SUBTLE SCROLL MOVEMENT
    ========================================================== */

    const cosmicImages =
        document.querySelectorAll(
            ".image-placeholder"
        );


    window.addEventListener(
        "scroll",
        () => {

            const scrollY =
                window.scrollY;


            cosmicImages.forEach(
                (image, index) => {

                    const rect =
                        image.getBoundingClientRect();


                    if (
                        rect.bottom > 0 &&
                        rect.top < window.innerHeight
                    ) {

                        const center =
                            rect.top +
                            rect.height / 2;


                        const distance =
                            (center -
                                window.innerHeight / 2) /
                            window.innerHeight;


                        const amount =
                            distance * 5;


                        image.style.transform =
                            `translateY(${amount}px)`;

                    }

                }
            );

        },
        {
            passive: true
        }
    );



    /* =========================================================
       WRITING FRAGMENTS
    ========================================================== */

    const writingFragments =
        document.querySelectorAll(
            ".writing-fragment"
        );


    writingFragments.forEach((fragment) => {

        fragment.addEventListener(
            "mouseenter",
            () => {

                fragment.style.opacity = "1";

            }
        );


        fragment.addEventListener(
            "mouseleave",
            () => {

                fragment.style.opacity = "";

            }
        );

    });


});
