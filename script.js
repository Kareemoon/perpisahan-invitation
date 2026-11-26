// =========================================================
// KONFIGURASI SUPABASE
// =========================================================
const SUPABASE_URL = "https://uiitaooajfqnwlkwaemc.supabase.co";
const SUPABASE_ANON_KEY = "TEMPEL_KUNCI_SB_PUBLISHABLE_LENGKAP_DI_SINI";

const db = (typeof supabase !== "undefined" && SUPABASE_ANON_KEY.startsWith("sb_"))
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const DEFAULT_DATA = {
  title: "MPAT",
  subtitle: "Malam Perpisahan Akhir Tahun",
  gateSubtitle: "THE FINAL CHAPTER — CLASS OF 2026",
  school: "SMK NEGERI 6 KOTA TANGSEL • ANGKATAN 2026",
  isoDate: "2026-12-30T18:30",
  banner: "p.jpeg",
  music: "syaa.mp3",
  greeting: "“Tiga tahun penuh tawa, perjuangan, dan cerita kini bermuara di satu malam perayaan. Dengan penuh rasa syukur, kami mengundang seluruh rekan angkatan dan Dewan Guru untuk hadir merayakan kebersamaan terakhir kita di MPAT (Malam Perpisahan Akhir Tahun).”",
  date: "Rabu, 30 Desember 2026",
  time: "18.30 WIB – Selesai (Open Gate 18.00 WIB)",
  venue: "Lapangan Sekolah & Depan Kantor",
  address: "Jl. Magnolia VI No.6, Jelupang, Kec. Serpong Utara, Kota Tangerang Selatan, Banten 15323.",
  maps: "https://www.google.com/maps/place/SMKN+6+Tangerang+Selatan/@-6.2633241,106.6660765,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69fb06a47e36b7:0x93b22c3ee1f216b1!8m2!3d-6.2633241!4d106.6660765!16s%2Fg%2F11cnb3rhw2?entry=ttu",
  dress: "Formal Gala Attire — Deep Oxblood, Espresso Noir, Champagne Silk & Antique Bronze",
  colors: ["#4d1722", "#1d1917", "#e2c799", "#96723e"],
  gallery: [
    { url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=80", caption: "Hari Pertama MPLS — Kelas X (2023)" },
    { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80", caption: "Kegiatan Angkatan & Malam Keakraban — Kelas XI" },
    { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80", caption: "Pekan Olahraga & Pentas Seni Sekolah" },
    { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80", caption: "Sesi Foto Buku Tahunan — Kelas XII (2026)" }
  ],
  wa: "6281234567890"
};

// Ambil data RSVP (Otomatis pakai Supabase jika sudah terhubung, fallback ke lokal jika belum)
async function fetchRsvps() {
  if (db) {
    const { data, error } = await db
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) return data;
    console.error("Supabase error:", error?.message);
  }
  const saved = localStorage.getItem("mpat_rsvps_v1");
  return saved ? JSON.parse(saved) : [];
}

function getBlastList() {
  const saved = localStorage.getItem("mpat_blast_v1");
  return saved ? JSON.parse(saved) : [];
}

function saveBlastList(list) {
  localStorage.setItem("mpat_blast_v1", JSON.stringify(list));
}

/* =========================================================
   1. HALAMAN UTAMA UNDANGAN (index.html)
========================================================= */
if (document.getElementById("cover-gate")) {
  const cfg = DEFAULT_DATA;
  const params = new URLSearchParams(window.location.search);
  const guestParam = params.get("to");

  if (guestParam) {
    document.getElementById("guest-name").textContent = guestParam;
    document.getElementById("rsvp-name").value = guestParam;
  }
  document.getElementById("gate-subtitle").textContent = cfg.gateSubtitle;
  document.getElementById("gate-title").textContent = cfg.title;
  document.getElementById("gate-school").textContent = cfg.school;
  document.getElementById("hero-school").textContent = cfg.school;
  document.getElementById("hero-title").textContent = cfg.title;
  document.getElementById("hero-subtitle").textContent = cfg.subtitle;
  document.getElementById("hero-img").src = cfg.banner;
  document.getElementById("greeting-text").textContent = cfg.greeting;

  document.getElementById("event-date").textContent = cfg.date;
  document.getElementById("event-time").textContent = cfg.time;
  document.getElementById("event-venue").textContent = cfg.venue;
  document.getElementById("event-address").textContent = cfg.address;
  document.getElementById("maps-btn").href = cfg.maps;
  document.getElementById("dress-desc").textContent = cfg.dress;
  document.getElementById("footer-title").textContent = cfg.title;
  document.getElementById("footer-copy").textContent = `© 2026 Panitia ${cfg.title} — SMKN 6 Kota Tangsel`;
  document.getElementById("wa-btn").href = `https://wa.me/${cfg.wa}?text=Halo%20Panitia%20${encodeURIComponent(cfg.title)},%20saya%20ingin%20bertanya%20tentang%20acara%20perpisahan.`;

  const swatchList = document.getElementById("swatch-list");
  cfg.colors.forEach(hex => {
    const dot = document.createElement("span");
    dot.className = "swatch";
    dot.style.backgroundColor = hex;
    dot.title = hex;
    swatchList.appendChild(dot);
  });

  // Gallery & Lightbox
  const galleryGrid = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-caption");

  cfg.gallery.forEach(item => {
    if (!item.url) return;
    const figure = document.createElement("figure");
    figure.className = "gallery-item";
    figure.innerHTML = `
      <img src="${item.url}" alt="${item.caption || 'Kenangan'}" loading="lazy" />
      ${item.caption ? `<figcaption class="gallery-cap">${item.caption}</figcaption>` : ""}
    `;
    figure.addEventListener("click", () => {
      lbImg.src = item.url;
      lbCap.textContent = item.caption || "";
      lightbox.classList.remove("hidden");
    });
    galleryGrid.appendChild(figure);
  });

  document.getElementById("lb-close").addEventListener("click", () => lightbox.classList.add("hidden"));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.classList.add("hidden"); });

  // Audio Backsound Loop & Cover Gate
  const audio = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-toggle");
  const musicIcon = document.getElementById("music-icon");
  audio.src = cfg.music;

  const setMusicUI = (isPlaying) => {
    musicIcon.textContent = isPlaying ? "❚❚" : "▶";
    musicBtn.classList.toggle("playing", isPlaying);
  };

  document.getElementById("open-btn").addEventListener("click", () => {
    document.getElementById("cover-gate").classList.add("opened");
    document.body.classList.remove("locked");
    audio.play().then(() => setMusicUI(true)).catch(() => setMusicUI(false));
  });

  musicBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => setMusicUI(true));
    } else {
      audio.pause();
      setMusicUI(false);
    }
  });

  // Countdown Timer
  const targetTime = new Date(cfg.isoDate).getTime();
  const updateCountdown = () => {
    const diff = Math.max(0, targetTime - Date.now());
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById("cd-days").textContent = String(d).padStart(2, "0");
    document.getElementById("cd-hours").textContent = String(h).padStart(2, "0");
    document.getElementById("cd-mins").textContent = String(m).padStart(2, "0");
    document.getElementById("cd-secs").textContent = String(s).padStart(2, "0");
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Download Kalender (.ics)
  document.getElementById("cal-btn").addEventListener("click", () => {
    const dt = cfg.isoDate.replace(/[-:]/g, "") + "00";
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${cfg.title} - ${cfg.subtitle}`,
      `DESCRIPTION:${cfg.greeting}`,
      `LOCATION:${cfg.venue}, ${cfg.address}`,
      `DTSTART:${dt}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    link.download = "undangan-mpat-2026.ics";
    link.click();
  });

  // Direct RSVP Form, Gala E-Pass & Wishes Wall
  const rsvpForm = document.getElementById("rsvp-form");
  const submitBtn = document.getElementById("rsvp-submit-btn");
  const passWrap = document.getElementById("gala-pass-wrap");
  const wishesList = document.getElementById("wishes-list");
  const wishesCount = document.getElementById("wishes-count");

  const renderWishes = async () => {
    wishesCount.textContent = "Memuat...";
    const list = await fetchRsvps();
    wishesCount.textContent = `${list.length} Ucapan`;

    if (!list.length) {
      wishesList.innerHTML = `<p style="color:var(--ink-muted);font-size:0.9rem;">Belum ada ucapan. Jadilah yang pertama menulis pesan!</p>`;
      return;
    }

    wishesList.innerHTML = list.map(item => `
      <article class="wish-item">
        <div class="wish-top">
          <span class="wish-author">${escapeHtml(item.name)}</span>
          <span class="wish-badge">${escapeHtml(item.kelas)} • ${escapeHtml(item.status)}</span>
        </div>
        <p class="wish-msg">${escapeHtml(item.wish)}</p>
      </article>
    `).join("");
  };

  const showGalaPass = (entry) => {
    document.getElementById("pass-code").textContent = entry.code;
    document.getElementById("pass-event-name").textContent = `${cfg.title} — ${cfg.subtitle}`;
    document.getElementById("pass-guest-name").textContent = entry.name;
    document.getElementById("pass-guest-class").textContent = entry.kelas;
    document.getElementById("pass-guest-status").textContent = entry.status;
    rsvpForm.classList.add("hidden");
    passWrap.classList.remove("hidden");
  };

  const mySavedPass = localStorage.getItem("mpat_my_pass_v1");
  if (mySavedPass) showGalaPass(JSON.parse(mySavedPass));

  document.getElementById("edit-rsvp-btn").addEventListener("click", () => {
    passWrap.classList.add("hidden");
    rsvpForm.classList.remove("hidden");
  });

  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Menyimpan...";

    const randomNum = Math.floor(100 + Math.random() * 900);
    const entry = {
      code: `MPAT-26-${randomNum}`,
      name: document.getElementById("rsvp-name").value.trim(),
      kelas: document.getElementById("rsvp-class").value,
      status: document.getElementById("rsvp-status").value,
      diet: document.getElementById("rsvp-diet").value.trim() || "-",
      wish: document.getElementById("rsvp-wish").value.trim()
    };

    if (db) {
      const { error } = await db.from("rsvps").insert([entry]);
      if (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Kirim Konfirmasi & Dapatkan E-Pass";
        alert("Gagal menyimpan ke database: " + error.message);
        return;
      }
    } else {
      const saved = JSON.parse(localStorage.getItem("mpat_rsvps_v1") || "[]");
      saved.unshift({ ...entry, id: Date.now(), created_at: new Date().toISOString() });
      localStorage.setItem("mpat_rsvps_v1", JSON.stringify(saved));
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Kirim Konfirmasi & Dapatkan E-Pass";
    localStorage.setItem("mpat_my_pass_v1", JSON.stringify(entry));
    await renderWishes();
    showGalaPass(entry);
  });

  renderWishes();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add("visible"); });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

/* =========================================================
   2. ADMIN PANEL: DAFTAR TAMU & BLAST WA CSV (admin.html)
========================================================= */
if (document.getElementById("admin-app")) {
  let cachedRsvps = [];

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn, .tab-panel").forEach(el => el.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  const renderTableRows = (keyword = "") => {
    const q = keyword.toLowerCase();
    const filtered = cachedRsvps.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.kelas.toLowerCase().includes(q) ||
      i.code.toLowerCase().includes(q)
    );

    const tbody = document.getElementById("rsvp-tbody");
    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--ink-muted);">Belum ada data tamu.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(item => `
      <tr>
        <td><code>${escapeHtml(item.code)}</code></td>
        <td><strong>${escapeHtml(item.name)}</strong></td>
        <td>${escapeHtml(item.kelas)}</td>
        <td>${escapeHtml(item.status)}</td>
        <td>${escapeHtml(item.diet)}</td>
        <td>${escapeHtml(item.wish)}</td>
        <td><button type="button" class="text-btn" onclick="deleteRsvp(${item.id})">Hapus</button></td>
      </tr>
    `).join("");
  };

  const loadAdminRsvps = async () => {
    const tbody = document.getElementById("rsvp-tbody");
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--ink-muted);">Memuat data...</td></tr>`;

    cachedRsvps = await fetchRsvps();
    const hadirCount = cachedRsvps.filter(i => i.status === "Hadir").length;

    document.getElementById("stat-total").textContent = cachedRsvps.length;
    document.getElementById("stat-hadir").textContent = hadirCount;
    document.getElementById("stat-absen").textContent = cachedRsvps.length - hadirCount;

    renderTableRows(document.getElementById("rsvp-search").value);
  };

  window.deleteRsvp = async (id) => {
    if (!confirm("Hapus data tamu ini?")) return;
    if (db) {
      const { error } = await db.from("rsvps").delete().eq("id", id);
      if (error) return alert("Gagal menghapus: " + error.message);
    } else {
      const updated = cachedRsvps.filter(item => item.id !== id);
      localStorage.setItem("mpat_rsvps_v1", JSON.stringify(updated));
    }
    await loadAdminRsvps();
  };

  document.getElementById("rsvp-search").addEventListener("input", e => {
    renderTableRows(e.target.value);
  });

  document.getElementById("clear-rsvp-btn").addEventListener("click", async () => {
    if (!confirm("Hapus permanen semua data RSVP?")) return;
    if (db) {
      const { error } = await db.from("rsvps").delete().neq("id", 0);
      if (error) return alert("Gagal mereset data: " + error.message);
    } else {
      localStorage.removeItem("mpat_rsvps_v1");
    }
    await loadAdminRsvps();
  });

  document.getElementById("export-csv-btn").addEventListener("click", () => {
    const headers = ["Kode Pass", "Nama", "Kelas", "Status", "Catatan Makanan", "Ucapan"];
    const rows = cachedRsvps.map(r => [r.code, r.name, r.kelas, r.status, r.diet, r.wish]
      .map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    link.download = "daftar-tamu-mpat-2026.csv";
    link.click();
  });

  loadAdminRsvps();

  /* --- SISTEM BLAST WHATSAPP (DENGAN STOP CONTROLLER YANG STABIL) --- */
  let blastTimer = null;
  let isBlasting = false;

  const startBtn = document.getElementById("start-blast-btn");
  const stopBtn = document.getElementById("stop-blast-btn");
  const progressWrap = document.getElementById("blast-progress-wrap");
  const progressBar = document.getElementById("blast-progress-bar");
  const progressText = document.getElementById("blast-progress-text");

  const normalizePhone = (raw) => {
    let digits = String(raw || "").replace(/\D/g, "");
    if (digits.startsWith("0")) digits = "62" + digits.slice(1);
    else if (digits.startsWith("8")) digits = "62" + digits;
    return digits;
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) return [];
    const delimiter = lines[0].includes(";") ? ";" : ",";
    const parsed = [];

    lines.forEach((line, idx) => {
      const cols = line.split(delimiter).map(c => c.replace(/^"|"$/g, "").trim());
      if (cols.length < 2) return;
      if (idx === 0 && /nama|name/i.test(cols[0])) return;

      const name = cols[0];
      const rawPhone = /\d{7,}/.test(cols[1]) ? cols[1] : (cols[2] || "");
      const phone = normalizePhone(rawPhone);

      if (name && phone.length >= 10) {
        parsed.push({ name, phone, status: "pending" });
      }
    });
    return parsed;
  };

  const buildWaUrl = (contact) => {
    const baseUrl = window.location.href.replace("admin.html", "index.html").split("?")[0];
    const inviteLink = `${baseUrl}?to=${encodeURIComponent(contact.name)}`;
    const template = document.getElementById("blast-template").value;
    const finalMsg = template
      .replace(/\{nama\}/gi, contact.name)
      .replace(/\{link\}/gi, inviteLink);
    return `https://wa.me/${contact.phone}?text=${encodeURIComponent(finalMsg)}`;
  };

  const renderBlastTable = () => {
    const list = getBlastList();
    const sentCount = list.filter(i => i.status === "sent").length;
    const pendingCount = list.length - sentCount;

    document.getElementById("blast-total").textContent = list.length;
    document.getElementById("blast-sent").textContent = sentCount;
    document.getElementById("blast-pending").textContent = pendingCount;

    const tbody = document.getElementById("blast-tbody");
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--ink-muted);">Belum ada kontak. Silakan upload file .CSV di atas.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map((item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${escapeHtml(item.name)}</strong></td>
        <td><code>+${escapeHtml(item.phone)}</code></td>
        <td>
          <span class="status-pill ${item.status === "sent" ? "sent" : "pending"}">
            ${item.status === "sent" ? "Terkirim ✓" : "Menunggu"}
          </span>
        </td>
        <td>
          <button type="button" class="btn-outline small" onclick="sendSingleBlast(${idx})">
            ${item.status === "sent" ? "Kirim Ulang" : "Kirim WA"}
          </button>
        </td>
      </tr>
    `).join("");
  };

  window.sendSingleBlast = (index) => {
    const list = getBlastList();
    const contact = list[index];
    if (!contact) return;

    window.open(buildWaUrl(contact), "_blank");
    list[index].status = "sent";
    saveBlastList(list);
    renderBlastTable();
  };

  const stopAutoBlast = (statusLabel = "") => {
    isBlasting = false;
    if (blastTimer) {
      clearTimeout(blastTimer);
      blastTimer = null;
    }
    startBtn.classList.remove("hidden");
    stopBtn.classList.add("hidden");
    if (statusLabel) progressText.textContent = statusLabel;
  };

  startBtn.addEventListener("click", () => {
    if (isBlasting) return;

    const list = getBlastList();
    const pendingIndices = list
      .map((item, idx) => (item.status !== "sent" ? idx : -1))
      .filter(i => i !== -1);

    if (!pendingIndices.length) {
      alert("Semua kontak dalam daftar sudah terkirim atau daftar CSV masih kosong.");
      return;
    }

    isBlasting = true;
    const delayMs = Number(document.getElementById("blast-delay").value) * 1000;

    startBtn.classList.add("hidden");
    stopBtn.classList.remove("hidden");
    progressWrap.classList.remove("hidden");

    let pointer = 0;
    const totalToSend = pendingIndices.length;

    const runStep = () => {
      if (!isBlasting) return;

      if (pointer >= totalToSend) {
        stopAutoBlast(`✓ Selesai! ${totalToSend} undangan WhatsApp telah dibuka.`);
        return;
      }

      const targetIndex = pendingIndices[pointer];
      window.sendSingleBlast(targetIndex);
      pointer++;

      const pct = Math.round((pointer / totalToSend) * 100);
      progressBar.style.width = `${pct}%`;

      if (pointer >= totalToSend) {
        stopAutoBlast(`✓ Selesai! ${totalToSend} undangan WhatsApp telah dibuka.`);
      } else {
        progressText.textContent = `Terkirim ${pointer}/${totalToSend} — Menunggu jeda ${delayMs / 1000} detik (Klik Hentikan untuk jeda)...`;
        blastTimer = setTimeout(runStep, delayMs);
      }
    };

    runStep();
  });

  stopBtn.addEventListener("click", () => {
    stopAutoBlast("❚❚ Auto-Blast dihentikan. Klik Mulai untuk melanjutkan sisa kontak.");
  });

  document.getElementById("csv-file-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    stopAutoBlast();
    const reader = new FileReader();
    reader.onload = (ev) => {
      const contacts = parseCSV(ev.target.result);
      if (!contacts.length) {
        alert("Format CSV tidak terbaca. Pastikan berisi kolom Nama dan Nomor WA (minimal 10 digit).");
        return;
      }
      saveBlastList(contacts);
      document.getElementById("csv-file-label").innerHTML = `File aktif: <strong>${escapeHtml(file.name)}</strong> (${contacts.length} kontak siap dikirim)`;
      renderBlastTable();
    };
    reader.readAsText(file);
  });

  document.getElementById("download-sample-csv").addEventListener("click", () => {
    const sample = [
      "Nama,NomorWA",
      "Raka Pratama,081234567890",
      "Alya Putri,085712345678",
      "Bapak Hendra Wijaya,6281398765432"
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([sample], { type: "text/csv;charset=utf-8;" }));
    link.download = "template-blast-mpat-2026.csv";
    link.click();
  });

  document.getElementById("clear-blast-btn").addEventListener("click", () => {
    stopAutoBlast();
    if (confirm("Hapus seluruh daftar kontak blast CSV?")) {
      saveBlastList([]);
      progressWrap.classList.add("hidden");
      document.getElementById("csv-file-label").innerHTML = "Klik di sini untuk upload file <strong>.csv</strong>";
      renderBlastTable();
    }
  });

  renderBlastTable();
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}