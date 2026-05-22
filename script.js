const CONFIG = {
  ngoName: "Pandurang Pratishthan",
  whatsappNumber: "910000000000",
  apiBase: "/api",
  formEndpoint: "https://formsubmit.co/ajax/akash.gita.bhagwat@gmail.com",
  emailJs: {
    serviceId: "ADD_EMAILJS_SERVICE_ID",
    templateId: "ADD_EMAILJS_TEMPLATE_ID",
    publicKey: "ADD_EMAILJS_PUBLIC_KEY"
  }
};

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#navLinks");
const navItems = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section[id]")];
const backToTop = document.querySelector(".back-to-top");

document.querySelector("#currentYear").textContent = new Date().getFullYear();

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((item) => {
        item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
);

sections.forEach((section) => observer.observe(section));

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 600);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const counters = document.querySelectorAll("[data-counter]");
const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.4 }
);

counters.forEach((counter) => counterObserver.observe(counter));

function animateCounter(element) {
  const target = Number(element.dataset.counter);
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = `${value.toLocaleString("en-IN")}+`;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const amountButtons = document.querySelectorAll(".amount-btn");
const customAmount = document.querySelector("#customAmount");
const selectedAmount = document.querySelector("#selectedAmount");

amountButtons.forEach((button) => {
  button.addEventListener("click", () => {
    amountButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    customAmount.value = "";
    selectedAmount.value = button.dataset.amount;
  });
});

customAmount.addEventListener("input", () => {
  amountButtons.forEach((item) => item.classList.remove("active"));
  selectedAmount.value = customAmount.value;
});

const paymentTabs = document.querySelectorAll(".payment-tab");
const paymentPanels = document.querySelectorAll(".payment-panel");

paymentTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    paymentTabs.forEach((item) => item.classList.remove("active"));
    paymentPanels.forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#${tab.dataset.payment}`).classList.add("active");
  });
});

const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;

    galleryItems.forEach((item) => {
      const shouldShow = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("hidden", !shouldShow);
    });
  });
});

setupDonationForm();
setupForm("volunteerForm", "volunteerMessage", "volunteerSubmissions", "Thank you for volunteering. Your request has been sent to the NGO team.");
setupForm("contactForm", "contactMessage", "contactSubmissions", "Thank you. Your message has been sent to the NGO team.");

function setupDonationForm() {
  const form = document.querySelector("#donationForm");
  const message = document.querySelector("#donationMessage");
  if (!form || !message) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFormState(form, message);

    if (!validateForm(form)) {
      showMessage(message, "Please check the highlighted fields before payment.", "error");
      return;
    }

    const button = form.querySelector("button[type='submit']");
    setLoading(button, true, "Opening secure checkout...");
    const donor = Object.fromEntries(new FormData(form).entries());
    donor.amount = Number(selectedAmount.value);
    donor.createdAt = new Date().toISOString();

    try {
      if (!window.Razorpay) {
        throw new Error("Razorpay checkout script did not load.");
      }

      const order = await createRazorpayOrder(donor);
      await openRazorpayCheckout(order, donor);
      saveSubmission("donationSubmissions", {
        ...donor,
        razorpayOrderId: order.orderId,
        paymentStatus: "verified"
      });
      showMessage(message, "Donation successful. Thank you for supporting Pandurang Pratishthan. Receipt details have been saved for follow-up.", "success");
      form.reset();
      restoreDonationDefault("donationForm");
    } catch (error) {
      const fallback = {
        ...donor,
        paymentStatus: "not_completed",
        error: error.message
      };
      saveSubmission("donationSubmissions", fallback);
      showMessage(message, error.message || "Payment could not be completed. Please try again or contact us on WhatsApp.", "error");
    } finally {
      setLoading(button, false);
    }
  });
}

async function createRazorpayOrder(donor) {
  const response = await fetch(`${CONFIG.apiBase}/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: donor.amount,
      donorName: donor.name,
      donorEmail: donor.email,
      donorPhone: donor.phone,
      purpose: donor.purpose
    })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Unable to create secure payment order.");
  }

  return payload;
}

function openRazorpayCheckout(order, donor) {
  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: CONFIG.ngoName,
      description: donor.purpose || "Donation",
      order_id: order.orderId,
      prefill: {
        name: donor.name,
        email: donor.email,
        contact: donor.phone
      },
      notes: {
        purpose: donor.purpose || "General donation",
        donorPan: donor.pan || "Not provided"
      },
      theme: {
        color: "#1f7a4c"
      },
      handler: async (response) => {
        try {
          await verifyRazorpayPayment(response, donor);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment was cancelled before completion."))
      }
    });

    checkout.open();
  });
}

async function verifyRazorpayPayment(payment, donor) {
  const response = await fetch(`${CONFIG.apiBase}/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payment,
      donorName: donor.name,
      donorEmail: donor.email,
      amount: donor.amount,
      purpose: donor.purpose
    })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.verified) {
    throw new Error(payload.error || "Payment verification failed. Please contact the NGO with your payment ID.");
  }

  return payload;
}

function setupForm(formId, messageId, storageKey, successText) {
  const form = document.querySelector(`#${formId}`);
  const message = document.querySelector(`#${messageId}`);
  if (!form || !message) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFormState(form, message);

    if (!validateForm(form)) {
      showMessage(message, "Please check the highlighted fields.", "error");
      return;
    }

    const button = form.querySelector("button[type='submit']");
    setLoading(button, true);
    const data = Object.fromEntries(new FormData(form).entries());
    data.createdAt = new Date().toISOString();

    try {
      const sent = await sendToConfiguredEndpoint(data, formId);
      if (!sent) saveSubmission(storageKey, data);
      showMessage(message, sent ? successText : `${successText} API is not configured, so a local backup was created.`, "success");
      form.reset();
      restoreDonationDefault(formId);
    } catch (error) {
      saveSubmission(storageKey, data);
      showMessage(message, "Online submission failed. A local backup was created in this browser.", "error");
    } finally {
      setLoading(button, false);
    }
  });
}

function validateForm(form) {
  let isValid = true;
  const fields = [...form.querySelectorAll("input, textarea, select")];

  fields.forEach((field) => {
    if (field.type === "hidden") return;
    const valid = field.checkValidity();
    field.classList.toggle("field-error", !valid);
    if (!valid) isValid = false;
  });

  if (form.id === "donationForm" && Number(selectedAmount.value) <= 0) {
    customAmount.classList.add("field-error");
    isValid = false;
  }

  return isValid;
}

function clearFormState(form, message) {
  form.querySelectorAll(".field-error").forEach((field) => field.classList.remove("field-error"));
  message.textContent = "";
  message.className = "form-message";
}

function showMessage(element, text, type) {
  element.textContent = text;
  element.classList.add(type);
}

function setLoading(button, isLoading, loadingText = "Sending...") {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${loadingText}`;
    return;
  }

  button.disabled = false;
  button.innerHTML = button.dataset.originalText;
}

async function sendToConfiguredEndpoint(data, formId) {
  const endpointConfigured = CONFIG.formEndpoint && !CONFIG.formEndpoint.startsWith("ADD_");

  if (!endpointConfigured) {
    return false;
  }

  const payload = {
    ...data,
    _subject: getFormSubject(formId),
    _template: "table",
    _captcha: "false",
    _replyto: data.email || ""
  };

  if (CONFIG.formEndpoint.includes("formsubmit.co")) {
    const body = new FormData();
    Object.entries(payload).forEach(([key, value]) => body.append(key, value));

    // FORMSUBMIT:
    // The first submission may require email verification from FormSubmit.
    const response = await fetch(CONFIG.formEndpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body
    });

    if (!response.ok) {
      throw new Error("FormSubmit returned an error.");
    }

    return true;
  }

  // FORMSPREE / GOOGLE APPS SCRIPT:
  // Set CONFIG.formEndpoint above. This POST request sends all form data as JSON.
  const response = await fetch(CONFIG.formEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formId, ...payload })
  });

  if (!response.ok) {
    throw new Error("Form endpoint returned an error.");
  }

  return true;
}

function getFormSubject(formId) {
  if (formId === "volunteerForm") {
    return "New volunteer request - Pandurang Pratishthan";
  }

  if (formId === "contactForm") {
    return "New contact message - Pandurang Pratishthan";
  }

  return "New website submission - Pandurang Pratishthan";
}

function saveSubmission(storageKey, data) {
  const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
  existing.push(data);
  localStorage.setItem(storageKey, JSON.stringify(existing));
}

function restoreDonationDefault(formId) {
  if (formId !== "donationForm") return;
  amountButtons.forEach((button) => button.classList.toggle("active", button.dataset.amount === "101"));
  selectedAmount.value = "101";
}

const whatsappButton = document.querySelector("#whatsappBtn");
const whatsappMessage = encodeURIComponent("Namaste Pandurang Pratishthan, I would like to know more about donation and volunteering.");
whatsappButton.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${whatsappMessage}`;

// RAZORPAY:
// Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel environment variables.
// The browser calls /api/create-order and /api/verify-payment so secret keys never ship to users.

// FORM EMAIL:
// Volunteer and contact forms submit through FormSubmit to akash.gita.bhagwat@gmail.com.
// The first email may need FormSubmit verification before delivery becomes active.
// You can still replace CONFIG.formEndpoint with Formspree or Google Apps Script later.
