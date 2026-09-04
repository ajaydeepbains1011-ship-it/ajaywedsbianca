(function () {
  "use strict";

  // ---- mobile nav ----
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // ---- booking link (The Ritz-Carlton Penha Longa) ----
  const bookingLink = document.getElementById("booking-link");
  const bookingNote = document.getElementById("booking-note");
  if (bookingLink) {
    if (typeof BOOKING_LINK === "string" && BOOKING_LINK.trim()) {
      bookingLink.href = BOOKING_LINK.trim();
      if (bookingNote) bookingNote.style.display = "none";
    } else {
      bookingLink.setAttribute("aria-disabled", "true");
      bookingLink.addEventListener("click", (e) => e.preventDefault());
    }
  }

  // ---- RSVP form ----
  const form = document.getElementById("rsvp-form");
  if (!form) return;

  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const partySizeField = document.getElementById("party-size-field");
  const eventsField = document.getElementById("events-field");
  const dietaryField = document.getElementById("dietary-field");

  const attendingRadios = form.querySelectorAll('input[name="attending"]');

  function syncDecliningState() {
    const declined = form.querySelector('input[name="attending"]:checked')?.value === "Not Attending";
    [partySizeField, eventsField, dietaryField].forEach((el) => {
      el.style.display = declined ? "none" : "";
    });
  }
  attendingRadios.forEach((r) => r.addEventListener("change", syncDecliningState));

  function setStatus(message, state) {
    statusEl.textContent = message;
    statusEl.dataset.state = state || "";
  }

  function collectPayload(formData) {
    return {
      fullName: (formData.get("fullName") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      phone: (formData.get("phone") || "").toString().trim(),
      attending: (formData.get("attending") || "").toString(),
      partySize: (formData.get("partySize") || "").toString(),
      events: formData.getAll("events").join(", "),
      dietary: (formData.get("dietary") || "").toString().trim(),
      message: (formData.get("message") || "").toString().trim(),
      submittedAt: new Date().toISOString(),
    };
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    setStatus("", "");

    if (!form.reportValidity()) return;

    const honeypot = form.querySelector('input[name="company"]').value;
    if (honeypot) {
      setStatus("Thank you! Your RSVP has been received.", "success");
      form.reset();
      return;
    }

    if (typeof RSVP_ENDPOINT !== "string" || RSVP_ENDPOINT.includes("PASTE_YOUR")) {
      setStatus("This form isn't connected yet — see README.md to add your Google Sheet endpoint.", "error");
      return;
    }

    const formData = new FormData(form);
    const payload = collectPayload(formData);

    submitBtn.disabled = true;
    submitBtn.querySelector(".submit-btn__text").textContent = "Sending…";

    try {
      const body = new URLSearchParams(payload);
      await fetch(RSVP_ENDPOINT, { method: "POST", mode: "no-cors", body });

      setStatus("Thank you! Your RSVP has been received. 💌", "success");
      form.reset();
      syncDecliningState();
    } catch (err) {
      setStatus("Something went wrong sending your RSVP. Please try again or email us directly.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector(".submit-btn__text").textContent = "Send RSVP";
    }
  });

  syncDecliningState();
})();
