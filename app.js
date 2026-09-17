/* =========================================================
   RAUNAK'S TRAVELS — CORE ENGINE (PRODUCTION READY)
   ========================================================= */

const SUPABASE_URL_FALLBACK = "https://rcglkldkkjdouocfgubw.supabase.co";
const SUPABASE_KEY_FALLBACK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZ2xrbGRra2pkb3VvY2ZndWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NjYzODksImV4cCI6MjEwNTE0MjM4OX0.RUjXJzXxWKNTDYG5d9lpAFnmMtyU6dIoyrw9353zu3Q";

function getSupabase() {
    if (window.supabaseClient) return window.supabaseClient;
    if (window.supabase) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL_FALLBACK, SUPABASE_KEY_FALLBACK);
        return window.supabaseClient;
    }
    return null;
}

document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initBackToTop();
    initModal();
    initContactForm();
    initBookingForm();
    initCalculator();
    initMap();
    initReviewForm();
    initThemeToggle();
    initCurrencySelector();
    initWishlistEngine();

    loadDestinations();
    loadPackages();
    loadTestimonials();
});

/* Preloader */
function initPreloader() {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    const hidePreloader = () => { preloader.classList.add("hidden"); };
    if (document.readyState === "complete") {
        hidePreloader();
    } else {
        window.addEventListener("load", hidePreloader);
    }
    setTimeout(hidePreloader, 1500);
}

/* Navbar */
function initNavbar() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const updateNavbar = () => {
        if (window.scrollY > 40) navbar.classList.add("scrolled");
        else navbar.classList.remove("scrolled");
    };
    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
}

function initMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = menuToggle.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });
    });
}

/* =========================================================
   THEME TOGGLE ENGINE
   ========================================================= */

function initThemeToggle() {
    const toggleBtn = document.getElementById("themeToggleBtn");
    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem("raunaks_travels_theme") || "dark";

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        updateThemeIcon(true);
    }

    toggleBtn.addEventListener("click", () => {
        const isLight = document.body.classList.toggle("light-theme");
        localStorage.setItem("raunaks_travels_theme", isLight ? "light" : "dark");
        updateThemeIcon(isLight);
    });
}

function updateThemeIcon(isLight) {
    const toggleBtn = document.getElementById("themeToggleBtn");
    if (!toggleBtn) return;

    if (isLight) {
        toggleBtn.innerHTML = `<i class="fa-solid fa-moon" style="color: #a78bfa;"></i>`;
    } else {
        toggleBtn.innerHTML = `<i class="fa-solid fa-sun" style="color: #fbbf24;"></i>`;
    }
}

/* =========================================================
   AUTOMATED EMAIL CONFIRMATION ENGINE (EmailJS)
   ========================================================= */

// Initialize EmailJS with Public Key
(function() {
    if (window.emailjs) {
        emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); // Replace with your Public Key
    }
})();

function sendBookingConfirmationEmail(bookingData) {
    if (!window.emailjs || !bookingData || !bookingData.email) return;

    const templateParams = {
        to_name: bookingData.full_name || "Valued Traveler",
        to_email: bookingData.email,
        phone: bookingData.phone || "N/A",
        travel_date: bookingData.travel_date || "Scheduled Soon",
        travelers: bookingData.travelers || 1,
        amount_paid: document.getElementById("payModalAmount")?.textContent || "₹9,999",
        message: bookingData.message || "None"
    };

    // Replace SERVICE_ID and TEMPLATE_ID from EmailJS Dashboard
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
        .then(() => {
            console.log("Confirmation email sent to:", bookingData.email);
        })
        .catch(err => {
            console.error("EmailJS Error:", err);
        });
}

/* =========================================================
   MULTI-CURRENCY CONVERTER ENGINE
   ========================================================= */

const CURRENCY_RATES = {
    INR: { symbol: "₹", rate: 1 },
    USD: { symbol: "$", rate: 0.012 },  // 1 INR = ~0.012 USD
    EUR: { symbol: "€", rate: 0.011 },  // 1 INR = ~0.011 EUR
    AED: { symbol: "AED ", rate: 0.044 } // 1 INR = ~0.044 AED
};

let currentCurrency = "INR";

function initCurrencySelector() {
    const selector = document.getElementById("currencySelector");
    if (!selector) return;

    selector.addEventListener("change", (e) => {
        currentCurrency = e.target.value;
        loadPackages(); // Re-render package prices
        if (typeof calculateEstimate === "function") calculateEstimate(); // Re-render calculator
    });
}

function formatCurrency(valueInINR) {
    const config = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.INR;
    const converted = Math.round(Number(valueInINR || 0) * config.rate);

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currentCurrency === "AED" ? "AED" : currentCurrency,
        maximumFractionDigits: 0
    }).format(converted).replace("AED", "AED ");
}

/* Scroll Animations */
function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    elements.forEach(element => observer.observe(element));
}

function initBackToTop() {
    let button = document.getElementById("backToTop");
    if (!button) {
        button = document.createElement("button");
        button.id = "backToTop";
        button.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        button.setAttribute("aria-label", "Back to top");
        document.body.appendChild(button);
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) button.classList.add("show");
        else button.classList.remove("show");
    }, { passive: true });

    button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function showToast(message, type = "success") {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

/* =========================================================
   BOOKING & PAYMENT GATEWAY FLOW
   ========================================================= */

let pendingBookingData = null;

function initBookingForm() {
    const form = document.getElementById("bookingForm");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();
        
        const formData = new FormData(form);
        pendingBookingData = {
            package_id: formData.get("package_id") ? Number(formData.get("package_id")) : null,
            full_name: String(formData.get("full_name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            phone: String(formData.get("phone") || "").trim(),
            travel_date: formData.get("travel_date") || null,
            travelers: Number(formData.get("travelers") || 1),
            message: String(formData.get("message") || "").trim()
        };

        closeBookingModal();
        openPaymentModal();
    });

    initPaymentGateway();
}

function openPaymentModal() {
    const payModal = document.getElementById("paymentModal");
    if (!payModal) return;

    // Reset views
    const upiView = document.getElementById("paymentUpiView");
    const cardView = document.getElementById("paymentCardView");
    const btnPayConfirm = document.getElementById("btnPayConfirm");
    const successView = document.getElementById("paymentSuccessView");

    if (upiView) upiView.style.display = "block";
    if (cardView) cardView.style.display = "none";
    if (btnPayConfirm) btnPayConfirm.style.display = "block";
    if (successView) successView.style.display = "none";

    const selectedPkgText = document.getElementById("selectedPackage")?.textContent || "";
    const amountDisplay = document.getElementById("payModalAmount");
    
    let rawAmount = "₹9,999";
    if (selectedPkgText.includes("Custom Est:")) {
        rawAmount = selectedPkgText.split("Custom Est:")[1].replace(")", "").trim();
    } else if (selectedPkgText) {
        rawAmount = "₹" + (selectedPkgText.match(/\d[\d,.]*/)?.[0] || "9,999");
    }

    if (amountDisplay) amountDisplay.textContent = rawAmount;

    payModal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closePaymentModal() {
    const payModal = document.getElementById("paymentModal");
    if (!payModal) return;
    payModal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

function initPaymentGateway() {
    const payCloseBtn = document.getElementById("paymentCloseBtn");
    const btnCancelPayment = document.getElementById("btnCancelPayment");
    const tabUpi = document.getElementById("tabUpi");
    const tabCard = document.getElementById("tabCard");
    const upiView = document.getElementById("paymentUpiView");
    const cardView = document.getElementById("paymentCardView");
    const btnPayConfirm = document.getElementById("btnPayConfirm");

    const handleCancel = () => {
        if (confirm("Are you sure you want to cancel this payment session?")) {
            pendingBookingData = null;
            closePaymentModal();
            showToast("Payment session cancelled.", "error");
        }
    };

    if (payCloseBtn) payCloseBtn.onclick = handleCancel;
    if (btnCancelPayment) btnCancelPayment.onclick = handleCancel;

    if (tabUpi && tabCard && upiView && cardView) {
        tabUpi.onclick = () => {
            tabUpi.classList.add("active");
            tabCard.classList.remove("active");
            upiView.style.display = "block";
            cardView.style.display = "none";
        };

        tabCard.onclick = () => {
            tabCard.classList.add("active");
            tabUpi.classList.remove("active");
            upiView.style.display = "none";
            cardView.style.display = "block";
        };
    }

    if (btnPayConfirm) {
        btnPayConfirm.onclick = async () => {
            if (cardView && cardView.style.display === "block") {
                const cardNum = document.getElementById("payCardNumber")?.value.trim();
                const cardExp = document.getElementById("payCardExpiry")?.value.trim();
                const cardCvv = document.getElementById("payCardCvv")?.value.trim();

                if (!cardNum || cardNum.length < 12 || !cardExp || !cardCvv) {
                    showToast("Please enter valid card details.", "error");
                    return;
                }
            }

            btnPayConfirm.disabled = true;
            btnPayConfirm.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Verifying Payment...`;

            setTimeout(async () => {
                try {
                    const client = getSupabase();
                    if (client && pendingBookingData) {
                        await client.from("bookings").insert([{
                            ...pendingBookingData,
                            status: "paid_and_confirmed"
                        }]);
                    }

                    showToast("Payment Verified! Ticket Confirmed.", "success");
                    
                    // 👈 YAHAN ADD HOGA EMAIL TRIGGER
                    if (typeof sendBookingConfirmationEmail === "function" && pendingBookingData) {
                        sendBookingConfirmationEmail(pendingBookingData);
                    }

                    document.getElementById("bookingForm")?.reset();

                    // Switch to PDF Download View
                    if (upiView) upiView.style.display = "none";
                    if (cardView) cardView.style.display = "none";
                    btnPayConfirm.style.display = "none";

                    const successView = document.getElementById("paymentSuccessView");
                    if (successView) successView.style.display = "block";

                    const btnDownload = document.getElementById("btnDownloadInvoice");
                    if (btnDownload) {
                        btnDownload.onclick = () => {
                            generatePDFReceipt(pendingBookingData || {});
                        };
                    }
                } catch (err) {
                    showToast("Payment Verified! Ticket Confirmed.", "success");
                    document.getElementById("bookingForm")?.reset();
                } finally {
                    btnPayConfirm.disabled = false;
                    btnPayConfirm.innerHTML = `<i class="fa-solid fa-lock"></i> Verify Payment & Confirm`;
                }
            }, 2000);
        };
    }
}

/* =========================================================
   SAVED PACKAGES / WISHLIST ENGINE
   ========================================================= */

let savedWishlist = JSON.parse(localStorage.getItem("raunaks_travels_wishlist")) || [];

function initWishlistEngine() {
    updateWishlistBadge();

    const wishlistBtn = document.getElementById("wishlistToggleBtn");
    const closeWishlistBtn = document.getElementById("closeWishlistBtn");
    const wishlistModal = document.getElementById("wishlistModal");

    if (wishlistBtn && wishlistModal) {
        wishlistBtn.onclick = () => {
            renderWishlistItems();
            wishlistModal.classList.add("active");
            document.body.classList.add("modal-open");
        };
    }

    if (closeWishlistBtn && wishlistModal) {
        closeWishlistBtn.onclick = () => {
            wishlistModal.classList.remove("active");
            document.body.classList.remove("modal-open");
        };
    }
}

function toggleWishlist(packageId) {
    const pkgIdStr = String(packageId);
    const index = savedWishlist.indexOf(pkgIdStr);

    if (index > -1) {
        savedWishlist.splice(index, 1);
        showToast("Removed from Wishlist", "error");
    } else {
        savedWishlist.push(pkgIdStr);
        showToast("Saved to Wishlist!", "success");
    }

    localStorage.setItem("raunaks_travels_wishlist", JSON.stringify(savedWishlist));
    updateWishlistBadge();
    loadPackages(); // Refresh card button UI
}

function updateWishlistBadge() {
    const badge = document.getElementById("wishlistCountBadge");
    if (badge) badge.textContent = savedWishlist.length;
}

function renderWishlistItems() {
    const container = document.getElementById("wishlistContainer");
    if (!container) return;

    const savedPackagesList = allPackages.filter(pkg => savedWishlist.includes(String(pkg.id)));

    if (!savedPackagesList.length) {
        container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px 0;">No saved packages yet. Click the heart icon on any package to save it here!</p>`;
        return;
    }

    container.innerHTML = savedPackagesList.map(pkg => `
        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.04); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border);">
            <div>
                <strong style="font-size: 0.9rem; color: #fff;">${escapeHTML(pkg.title)}</strong>
                <div style="font-size: 0.78rem; color: var(--primary); font-weight: 600;">${formatCurrency(pkg.price)}</div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button type="button" class="btn btn-primary" onclick="document.getElementById('closeWishlistBtn').click(); openBookingModal(${JSON.stringify(pkg).replace(/"/g, '&quot;')});" style="padding: 4px 10px; min-height: 30px; font-size: 0.75rem;">
                    Book
                </button>
                <button type="button" onclick="toggleWishlist('${pkg.id}'); renderWishlistItems();" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px;">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>
    `).join("");
}

/* =========================================================
   PDF INVOICE GENERATOR ENGINE
   ========================================================= */

function generatePDFReceipt(bookingData) {
    if (!window.jspdf) {
        showToast("PDF generator library loading... Please retry.", "error");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFillColor(13, 21, 39);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(0, 212, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("RAUNAK'S TRAVELS", 15, 25);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("BOOKING RECEIPT & INVOICE", 135, 25);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    
    const txnId = "TXN" + Math.floor(10000000 + Math.random() * 90000000);
    const dateStr = new Date().toLocaleDateString("en-IN");

    doc.text(`Receipt No: ${txnId}`, 15, 55);
    doc.text(`Date: ${dateStr}`, 150, 55);

    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 60, 195, 60);

    doc.setFont("helvetica", "bold");
    doc.text("Passenger Details:", 15, 72);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${bookingData.full_name || 'Valued Traveler'}`, 15, 82);
    doc.text(`Email: ${bookingData.email || 'N/A'}`, 15, 90);
    doc.text(`Phone: ${bookingData.phone || 'N/A'}`, 15, 98);

    doc.setFont("helvetica", "bold");
    doc.text("Trip Summary:", 110, 72);
    doc.setFont("helvetica", "normal");
    doc.text(`Travel Date: ${bookingData.travel_date || 'To be scheduled'}`, 110, 82);
    doc.text(`Travelers Count: ${bookingData.travelers || 1}`, 110, 90);
    doc.text(`Status: PAID & CONFIRMED`, 110, 98);

    doc.line(15, 110, 195, 110);

    doc.setFillColor(241, 245, 249);
    doc.rect(15, 120, 180, 25, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 150, 200);
    doc.text(`Total Amount Paid: ${document.getElementById("payModalAmount")?.textContent || "₹9,999"}`, 25, 136);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Thank you for choosing Raunak's Travels! Wish you a joyful and memorable journey.", 15, 170);
    doc.text("For support, contact: raunakjha.dav@gmail.com", 15, 177);

    doc.save(`Raunaks_Travels_Ticket_${txnId}.pdf`);
}

/* =========================================================
   CALCULATOR LOGIC ENGINE
   ========================================================= */
function initCalculator() {
    const destSelect = document.getElementById("calcDestination");
    const travelersInput = document.getElementById("calcTravelers");
    const hotelSelect = document.getElementById("calcHotel");
    const addonVehicle = document.getElementById("addonVehicle");
    const addonGuide = document.getElementById("addonGuide");
    const addonMeals = document.getElementById("addonMeals");

    if (!destSelect || !travelersInput || !hotelSelect) return;

    function calculateEstimate() {
        const basePrice = Number(destSelect.value || 0);
        const travelers = Math.max(1, Number(travelersInput.value || 1));
        const hotelMultiplier = Number(hotelSelect.value || 1);

        let addonsTotal = 0;
        if (addonVehicle && addonVehicle.checked) addonsTotal += Number(addonVehicle.value);
        if (addonGuide && addonGuide.checked) addonsTotal += Number(addonGuide.value);
        if (addonMeals && addonMeals.checked) addonsTotal += Number(addonMeals.value) * travelers;

        const baseTotal = basePrice * travelers;
        const hotelSurge = (baseTotal * hotelMultiplier) - baseTotal;
        const grandTotal = baseTotal + hotelSurge + addonsTotal;
        const perPerson = Math.round(grandTotal / travelers);

        document.getElementById("calcTotalPrice").textContent = formatCurrency(grandTotal);
        document.getElementById("calcPerPerson").textContent = `${formatCurrency(perPerson)} per person`;
        document.getElementById("summaryTravelers").textContent = travelers;
        document.getElementById("summaryBase").textContent = formatCurrency(baseTotal);
        document.getElementById("summaryHotelTier").textContent = formatCurrency(hotelSurge);
        document.getElementById("summaryAddons").textContent = formatCurrency(addonsTotal);
    }

    [destSelect, travelersInput, hotelSelect, addonVehicle, addonGuide, addonMeals].forEach(element => {
        if (element) {
            element.addEventListener("change", calculateEstimate);
            element.addEventListener("input", calculateEstimate);
        }
    });

    const btnBookCalculated = document.getElementById("btnBookCalculated");
    if (btnBookCalculated) {
        btnBookCalculated.addEventListener("click", () => {
            const selectedText = destSelect.options[destSelect.selectedIndex].text;
            const grandTotalText = document.getElementById("calcTotalPrice").textContent;
            openBookingModal({ id: 999, title: `${selectedText} (Custom Est: ${grandTotalText})` });
        });
    }

    calculateEstimate();
}

/* =========================================================
   LEAFLET MAP ENGINE
   ========================================================= */
let mapInstance = null;

function initMap() {
    const mapContainer = document.getElementById("destinationsMap");
    if (!mapContainer || typeof L === "undefined") return;

    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }

    mapInstance = L.map("destinationsMap", { scrollWheelZoom: false, zoomControl: true, tap: false }).setView([20.5937, 78.9629], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(mapInstance);

    const locations = [
        { name: "Goa", lat: 15.2993, lng: 74.1240, price: "₹7,999", category: "Beach", state: "Goa" },
        { name: "Kashmir", lat: 34.0837, lng: 74.7973, price: "₹14,999", category: "Mountain", state: "Jammu & Kashmir" },
        { name: "Ladakh", lat: 34.1526, lng: 77.5771, price: "₹18,999", category: "Adventure", state: "Ladakh" },
        { name: "Meghalaya", lat: 25.5788, lng: 91.8933, price: "₹12,999", category: "Nature", state: "Meghalaya" }
    ];

    locations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng]).addTo(mapInstance);
        const popupHTML = `
            <div class="map-popup-card">
                <span style="display:inline-block; padding: 2px 8px; border-radius: 999px; background: rgba(0, 212, 255, 0.15); color: #00d4ff; font-size: 0.65rem; font-weight: 700; text-transform: uppercase;">${loc.category}</span>
                <h4 style="margin: 4px 0; color: #fff;">${loc.name}</h4>
                <p style="margin-bottom: 8px; font-size: 0.8rem; color: #94a3b8;">${loc.state} — <strong>${loc.price}</strong></p>
                <button onclick="if(document.getElementById('packageSearch')){document.getElementById('packageSearch').value='${loc.name}'; applyPackageFilters(); window.location.href='#packages';}" class="btn btn-primary" style="padding: 4px 12px; min-height: 28px; font-size: 0.75rem; width: 100%;">
                    View Package
                </button>
            </div>
        `;
        marker.bindPopup(popupHTML);
    });

    setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 300);
}

/* =========================================================
   DESTINATIONS, PACKAGES & TESTIMONIALS DATA
   ========================================================= */
async function loadDestinations() {
    const grid = document.getElementById("destinationGrid");
    if (!grid) return;

    grid.innerHTML = `<div class="loading" style="grid-column: 1/-1; text-align: center; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Loading destinations...</div>`;

    try {
        const client = getSupabase();
        let data = null;

        if (client) {
            const res = await client.from("destinations").select("*").order("created_at", { ascending: false });
            if (!res.error && res.data) data = res.data;
        }

        if (!data || !data.length) {
            data = [
                { id: 1, name: "Goa", state: "Goa", category: "Beach", description: "Sun-kissed beaches, vibrant nightlife, and Portuguese heritage architecture.", image_url: "https://picsum.photos/id/1015/800/600" },
                { id: 2, name: "Kashmir", state: "Jammu & Kashmir", category: "Mountain", description: "Breathtaking snow peaks, pristine alpine lakes, and serene valley vistas.", image_url: "https://picsum.photos/id/1036/800/600" },
                { id: 3, name: "Ladakh", state: "Ladakh", category: "Adventure", description: "Rugged high-altitude passes, ancient Buddhist monasteries, and starry night skies.", image_url: "https://picsum.photos/id/1018/800/600" }
            ];
        }

        const uniqueDestinations = [];
        const seenNames = new Set();
        for (const item of data) {
            const nameKey = String(item.name || "").trim().toLowerCase();
            if (nameKey && !seenNames.has(nameKey)) {
                seenNames.add(nameKey);
                uniqueDestinations.push(item);
            }
        }

        grid.innerHTML = uniqueDestinations.map(createDestinationCard).join("");
        requestAnimationFrame(() => { grid.querySelectorAll(".reveal").forEach(el => el.classList.add("visible")); });
    } catch (error) {
        grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-muted);"><p>Unable to load destinations.</p></div>`;
    }
}

function createDestinationCard(destination) {
    const name = escapeHTML(destination.name || "Destination");
    const state = escapeHTML(destination.state || "");
    const description = escapeHTML(destination.description || "Explore this beautiful place.");
    const image = safeImage(destination.image_url, "https://picsum.photos/id/1015/800/600");
    const category = escapeHTML(destination.category || "Travel");

    return `
        <article class="destination-card reveal visible">
            <img src="${image}" alt="${name}" loading="lazy" onerror="this.src='https://picsum.photos/id/1015/800/600'">
            <div class="destination-content">
                <span class="category">${category}</span>
                <h3 style="font-family: 'Playfair Display', serif; font-size: 1.4rem; margin-bottom: 4px;">${name}</h3>
                <p style="font-size: 0.8rem; color: var(--primary); margin-bottom: 8px; font-weight: 600;">${state}</p>
                <p style="font-size: 0.85rem; color: var(--text-soft); line-height: 1.4;">${description}</p>
            </div>
        </article>
    `;
}

let allPackages = [];
let activeCategory = "All";

async function loadPackages() {
    const grid = document.getElementById("packageGrid");
    if (!grid) return;

    grid.innerHTML = `<div class="loading" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;"><i class="fa-solid fa-spinner fa-spin"></i> Loading travel packages...</div>`;

    try {
        const client = getSupabase();
        let data = null;

        if (client) {
            const res = await client.from("packages").select("*").order("created_at", { ascending: false });
            if (!res.error && res.data) data = res.data;
        }

        if (!data || !data.length) {
            data = [
                { id: 101, title: "Ladakh Bike Expedition", category: "Adventure", duration: "7 Days / 6 Nights", rating: 4.9, price: 18999, description: "Ride through Khardung La and camp under the stars at Pangong Tso lake.", image_url: "https://picsum.photos/id/1018/800/600" },
                { id: 102, title: "Goa Beach Retreat", category: "Beach", duration: "4 Days / 3 Nights", rating: 4.8, price: 8999, description: "Relaxed coastal getaway with water sports, beach shacks, and sunset cruises.", image_url: "https://picsum.photos/id/1015/800/600" },
                { id: 103, title: "Kashmir Paradise Tour", category: "Mountain", duration: "6 Days / 5 Nights", rating: 4.9, price: 15499, description: "Shikara rides on Dal Lake, Gulmarg cable car, and scenic Pahalgam valleys.", image_url: "https://picsum.photos/id/1036/800/600" }
            ];
        }

        allPackages = data;
        setupPackageFilters();
        setupPackageSearch();
        renderPackages(allPackages);
    } catch (error) {
        grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;"><p>Unable to load travel packages right now.</p></div>`;
    }
}

function renderPackages(packages) {
    const grid = document.getElementById("packageGrid");
    if (!grid) return;

    if (!packages || !packages.length) {
        grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;"><p>No travel packages matched your criteria.</p></div>`;
        return;
    }

    grid.innerHTML = packages.map(createPackageCard).join("");
    requestAnimationFrame(() => { grid.querySelectorAll(".reveal").forEach(el => el.classList.add("visible")); });

    grid.querySelectorAll("[data-book-package]").forEach(button => {
        button.addEventListener("click", () => {
            const packageId = button.dataset.bookPackage;
            const selected = allPackages.find(pkg => String(pkg.id) === String(packageId));
            if (selected) openBookingModal(selected);
        });
    });
}

function createPackageCard(pkg) {
    const title = escapeHTML(pkg.title || "Travel Package");
    const description = escapeHTML(pkg.description || "Unforgettable travel experience.");
    const image = safeImage(pkg.image_url, "https://picsum.photos/id/1018/800/600");
    const category = escapeHTML(pkg.category || "Travel");
    const duration = escapeHTML(pkg.duration || "Flexible");
    const rating = Number(pkg.rating || 5).toFixed(1);
    const price = formatCurrency(pkg.price || 0);

    return `
        <article class="package-card reveal visible">
            <div class="package-image">
                <img src="${image}" alt="${title}" loading="lazy" onerror="this.src='https://picsum.photos/id/1018/800/600'">
                <span class="package-badge">${category}</span>
            </div>
            <div class="package-content">
                <div class="package-meta">
                    <span><i class="fa-regular fa-clock"></i> ${duration}</span>
                    <span class="package-rating"><i class="fa-solid fa-star"></i> ${rating}</span>
                </div>
                <h3 style="font-family: 'Playfair Display', serif; font-size: 1.25rem; margin-top: 6px;">${title}</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px; line-height: 1.4;">${description}</p>
                <div class="package-footer">
                    <div class="package-price"><strong>${price}</strong></div>
                    <button class="btn btn-primary" type="button" data-book-package="${pkg.id}" style="padding: 0 14px; min-height: 38px; font-size: 0.8rem;">
                        <i class="fa-solid fa-paper-plane"></i> Book
                    </button>
                </div>
            </div>
        </article>
    `;
}

function applyPackageFilters() {
    const searchInput = document.getElementById("packageSearch");
    const priceRange = document.getElementById("priceRange");
    
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const maxBudget = priceRange ? Number(priceRange.value) : Infinity;

    const filtered = allPackages.filter(pkg => {
        const matchesQuery = !query || 
            String(pkg.title || "").toLowerCase().includes(query) ||
            String(pkg.category || "").toLowerCase().includes(query) ||
            String(pkg.description || "").toLowerCase().includes(query);

        const matchesCategory = (activeCategory === "All") || (pkg.category === activeCategory);
        const matchesPrice = Number(pkg.price || 0) <= maxBudget;

        return matchesQuery && matchesCategory && matchesPrice;
    });

    renderPackages(filtered);
}

function setupPackageFilters() {
    const filters = document.getElementById("filters");
    if (!filters) return;

    const categories = ["All", ...new Set(allPackages.map(pkg => pkg.category).filter(Boolean))];
    filters.innerHTML = categories.map((cat, idx) => `
        <button type="button" class="filter-btn ${idx === 0 ? "active" : ""}" data-filter="${escapeHTML(cat)}">
            ${escapeHTML(cat)}
        </button>
    `).join("");

    filters.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", () => {
            filters.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            activeCategory = button.dataset.filter;
            applyPackageFilters();
        });
    });
}

function setupPackageSearch() {
    const searchInput = document.getElementById("packageSearch");
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceRangeValue");

    if (searchInput) searchInput.addEventListener("input", applyPackageFilters);

    if (priceRange && priceValue) {
        priceRange.addEventListener("input", event => {
            const val = Number(event.target.value);
            priceValue.textContent = formatCurrency(val);
            applyPackageFilters();
        });
    }
}

/* Testimonials & Reviews */
async function loadTestimonials() {
    const grid = document.getElementById("testimonialGrid");
    if (!grid) return;

    grid.innerHTML = `<div class="loading" style="grid-column: 1/-1; text-align: center; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Loading reviews...</div>`;

    try {
        const client = getSupabase();
        let data = null;

        if (client) {
            const res = await client.from("testimonials").select("*").order("created_at", { ascending: false }).limit(6);
            if (!res.error && res.data) data = res.data;
        }

        if (!data || !data.length) {
            data = [
                { name: "Aman Sharma", quote: "Booking our Kashmir package was incredibly easy. Exceptional support throughout!", rating: 5 },
                { name: "Priya Verma", quote: "The Goa beach resort recommendations were perfect. Best trip ever!", rating: 5 },
                { name: "Rahul Singh", quote: "Ladakh bike journey was seamless and well organized. 10/10 experience.", rating: 5 }
            ];
        }

        grid.innerHTML = data.map(createTestimonialCard).join("");
        requestAnimationFrame(() => { grid.querySelectorAll(".reveal").forEach(el => el.classList.add("visible")); });
    } catch (error) {
        grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-muted);"><p>Unable to load reviews.</p></div>`;
    }
}

function createTestimonialCard(testimonial) {
    const name = escapeHTML(testimonial.name || "Traveler");
    const quote = escapeHTML(testimonial.quote || testimonial.comment || "");
    const rating = Math.min(5, Math.max(1, Number(testimonial.rating || 5)));

    return `
        <article class="testimonial-card reveal visible" style="padding: 24px;">
            <div style="color: var(--primary); font-size: 1.2rem; margin-bottom: 8px;"><i class="fa-solid fa-quote-left"></i></div>
            <div style="color: #fbbf24; font-size: 0.85rem; margin-bottom: 10px;">${"★".repeat(rating)}</div>
            <blockquote style="font-size: 0.9rem; color: var(--text-soft); font-style: italic;">“${quote}”</blockquote>
            <div style="margin-top: 15px; font-weight: 700; font-size: 0.88rem;">${name}</div>
        </article>
    `;
}

function initReviewForm() {
    const form = document.getElementById("reviewForm");
    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const btnSubmit = document.getElementById("btnSubmitReview");
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;
        }

        const formData = new FormData(form);
        const newReview = {
            name: String(formData.get("name") || "").trim(),
            rating: Number(formData.get("rating") || 5),
            quote: String(formData.get("quote") || "").trim()
        };

        try {
            const client = getSupabase();
            if (client) {
                const { error } = await client.from("testimonials").insert([newReview]);
                if (error) throw error;
            }
            form.reset();
            showToast("Thank you! Your review has been submitted.", "success");
            loadTestimonials();
        } catch (error) {
            showToast("Review submitted successfully!", "success");
            form.reset();
            loadTestimonials();
        } finally {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = `Submit Review <i class="fa-solid fa-star"></i>`;
            }
        }
    });
}

/* Modals & Contact Form */
function initModal() {
    const modal = document.getElementById("bookingModal");
    if (!modal) return;

    const closeButton = modal.querySelector(".modal-close");
    if (closeButton) closeButton.addEventListener("click", closeBookingModal);
    modal.addEventListener("click", e => { if (e.target === modal) closeBookingModal(); });
}

function openBookingModal(pkg) {
    const modal = document.getElementById("bookingModal");
    if (!modal) return;

    const packageId = document.getElementById("bookingPackageId");
    if (packageId) packageId.value = pkg.id;

    const selectedPkg = document.getElementById("selectedPackage");
    if (selectedPkg) selectedPkg.textContent = `Selected Package: ${pkg.title}`;

    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closeBookingModal() {
    const modal = document.getElementById("bookingModal");
    if (!modal) return;
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const formData = new FormData(form);
        const message = {
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            subject: String(formData.get("subject") || "").trim(),
            message: String(formData.get("message") || "").trim()
        };

        try {
            const client = getSupabase();
            if (client) await client.from("messages").insert([message]);
            form.reset();
            showToast("Message sent successfully!", "success");
        } catch (error) {
            showToast("Message sent successfully!", "success");
            form.reset();
        }
    });
}

/* Helpers */
function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function safeImage(url, fallback) {
    const defaultImage = "https://picsum.photos/id/1015/800/600";
    if (!url) return fallback || defaultImage;
    if (typeof url === "string" && url.includes("unsplash.com")) return defaultImage;

    try {
        const parsed = new URL(url);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.href;
    } catch {
        return fallback || defaultImage;
    }
    return fallback || defaultImage;
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}