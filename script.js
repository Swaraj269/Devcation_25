const tl = gsap.timeline({
  defaults: {
    ease: "power2.out",
  },
});

gsap.set(".loader", {
  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
});

tl.to(".rotationtext", {
  delay: 1.3,
  y: "-6.5vh",
  duration: 1.2,
  ease: "power2.out",
})
  .to(".rotationtext", {
    y: "-13vh",
    duration: 1.2,
    ease: "power2.out",
    delay: 1,
  })
  .to(".loader", {
    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
    delay: 0.5,
  });

const nameItems = document.querySelectorAll(".name-item");
const imageDisplay = document.getElementById("image-display");

nameItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const newImgSrc = item.getAttribute("data-img");

    if (imageDisplay.src === newImgSrc) return;
    gsap.to(imageDisplay, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        const tempImg = new Image();
        tempImg.src = newImgSrc;
        tempImg.onload = () => {
          imageDisplay.src = newImgSrc;
          gsap.to(imageDisplay, { opacity: 1, duration: 0.3 });
        };
      },
    });
  });
});

gsap.registerPlugin(ScrollTrigger);

const path = document.querySelector("#mainPath");
const glowDot = document.querySelector("#glowDot");
const pathLength = path.getTotalLength();

const stations = Array.from({ length: 5 }, (_, i) =>
  document.querySelector(`#station${i + 1}`)
);

// 🟡 Fix: Set initial position of the dot
const startPoint = path.getPointAtLength(0);
glowDot.setAttribute("cx", startPoint.x);
glowDot.setAttribute("cy", startPoint.y);

// 🔄 Animate dot with scroll
gsap.to(glowDot, {
  scrollTrigger: {
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const point = path.getPointAtLength(progress * pathLength);
      glowDot.setAttribute("cx", point.x);
      glowDot.setAttribute("cy", point.y);

      stations.forEach((station) => {
        const dx = station.cx.baseVal.value - point.x;
        const dy = station.cy.baseVal.value - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        station.classList.toggle("active", dist < 20);
      });
    }
  }
});