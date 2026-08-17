(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var hamburger = document.querySelector(".hamburger");
  var mobileMenu = document.querySelector(".mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Quote form ---------- */
  var form = document.getElementById("quote-form");
  if (form) {
    var card = form.closest(".form-card");

    var validators = {
      name: function (v) { return v.trim().length >= 2; },
      phone: function (v) { return /^[0-9+()\-\s]{7,}$/.test(v.trim()); },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      service: function (v) { return v.trim().length > 0; },
      message: function (v) { return v.trim().length >= 5; }
    };

    function setFieldState(fieldEl, valid) {
      var wrap = fieldEl.closest(".field");
      if (!wrap) return;
      wrap.classList.toggle("has-error", !valid);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var isValid = true;

      Object.keys(validators).forEach(function (name) {
        var fieldEl = form.elements[name];
        if (!fieldEl) return;
        var ok = validators[name](fieldEl.value || "");
        setFieldState(fieldEl, ok);
        if (!ok) isValid = false;
      });

      if (!isValid) {
        var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      if (card) {
        card.classList.add("is-submitted");
        var success = card.querySelector(".form-success");
        if (success) {
          success.classList.add("is-visible");
          success.setAttribute("tabindex", "-1");
          success.focus();
        }
      }
      form.reset();
    });

    // Clear error state as the person fixes a field
    form.addEventListener("input", function (e) {
      var target = e.target;
      if (target && target.name && validators[target.name]) {
        var ok = validators[target.name](target.value || "");
        if (ok) setFieldState(target, true);
      }
    });
  }

  /* ---------- Route-rail active section tracking ---------- */
  var railLinks = document.querySelectorAll(".route-rail a");
  if (railLinks.length && "IntersectionObserver" in window) {
    var railMap = {};
    railLinks.forEach(function (link) {
      railMap[link.getAttribute("data-rail")] = link;
    });

    var railTargets = [];
    Object.keys(railMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) railTargets.push(el);
    });

    var railObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = railMap[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            railLinks.forEach(function (l) { l.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    railTargets.forEach(function (el) { railObserver.observe(el); });
  }

  /* ---------- Scroll progress bar ---------- */
  var progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    var updateProgress = function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* ---------- Card tilt on pointer devices ---------- */
  var canHover = window.matchMedia("(pointer: fine)").matches;
  if (canHover && !prefersReducedMotion) {
    var tiltEls = document.querySelectorAll(".process-card, .review-featured, .review-mini");
    tiltEls.forEach(function (el) {
      var maxTilt = 5;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rotY = (px - 0.5) * maxTilt * 2;
        var rotX = (0.5 - py) * maxTilt * 2;
        el.style.transform = "rotateX(" + rotX.toFixed(2) + "deg) rotateY(" + rotY.toFixed(2) + "deg) translateY(-2px)";
        el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });

    /* Magnetic pull on primary CTAs */
    var magnets = document.querySelectorAll(".btn-primary, .btn-urgent");
    magnets.forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = (e.clientX - r.left - r.width / 2) * 0.25;
        var my = (e.clientY - r.top - r.height / 2) * 0.4;
        btn.style.transform = "translate(" + mx.toFixed(1) + "px, " + my.toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Pipe-route draw-in animation (Process section) ---------- */
  var processSvg = document.querySelector(".process-svg");
  if (processSvg) {
    var drawLines = processSvg.querySelectorAll("g > line");
    var drawMarks = processSvg.querySelectorAll("g rect, g circle");

    if (prefersReducedMotion) {
      drawLines.forEach(function (l) { l.style.opacity = 1; });
      drawMarks.forEach(function (m) { m.style.opacity = 1; });
    } else {
      drawLines.forEach(function (line, i) {
        var len = line.getTotalLength ? line.getTotalLength() : 60;
        line.style.strokeDasharray = String(len);
        line.style.strokeDashoffset = String(len);
        line.style.transition = "stroke-dashoffset 0.7s " + (i * 0.15) + "s " + "cubic-bezier(0.16,1,0.3,1)";
      });
      drawMarks.forEach(function (mark, i) {
        mark.style.opacity = "0";
        mark.style.transformOrigin = "center";
        mark.style.transformBox = "fill-box";
        mark.style.transform = "scale(0.4)";
        mark.style.transition = "opacity 0.4s " + (0.45 + i * 0.08) + "s ease-out, transform 0.4s " + (0.45 + i * 0.08) + "s cubic-bezier(0.16,1,0.3,1)";
      });

      if ("IntersectionObserver" in window) {
        var svgObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                requestAnimationFrame(function () {
                  drawLines.forEach(function (l) { l.style.strokeDashoffset = "0"; });
                  drawMarks.forEach(function (m) {
                    m.style.opacity = "1";
                    m.style.transform = "scale(1)";
                  });
                });
                svgObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.35 }
        );
        svgObserver.observe(processSvg);
      }
    }
  }

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
