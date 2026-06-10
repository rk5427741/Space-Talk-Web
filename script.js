document.addEventListener("DOMContentLoaded", (function() {
    const e = "tkLMWC1ykilccHuFq3avxxcBnkXABau3GHcn2LuQ";
    let t = 1,
        n = 1,
        a = 1;
    const o = {};
    let s = {
        query: "",
        yearStart: "",
        yearEnd: "",
        mediaType: ""
    };
    const i = (new Date).toISOString().split("T")[0];
    document.getElementById("apod-date").value = i, document.getElementById("neo-start-date").value = i, document.getElementById("neo-end-date").value = i, document.getElementById("earth-date").value = i, document.getElementById("epic-date").value = i, document.getElementById("sol").value = 1e3;
    const r = document.querySelectorAll(".nav-link"),
        l = document.querySelectorAll(".tab-content");

    function c(e) {
        r.forEach((t => {
            t.classList.remove("active"), t.getAttribute("data-tab") === e && t.classList.add("active")
        })), l.forEach((t => {
            t.classList.remove("active"), t.id === e && t.classList.add("active")
        })), "apod" !== e || document.getElementById("apod-image").hasChildNodes() ? "mars" !== e || document.getElementById("mars-photos").hasChildNodes() ? "neo" !== e || document.getElementById("neo-list").hasChildNodes() ? "earth" !== e || document.getElementById("earth-image").hasChildNodes() ? "epic" !== e || document.getElementById("epic-images").hasChildNodes() || E() : v() : y() : u() : d()
    }
    async function d() {
        const t = document.getElementById("apod-date").value,
            n = document.getElementById("apod-image"),
            a = document.getElementById("apod-title"),
            o = document.getElementById("apod-date-display"),
            s = document.getElementById("apod-explanation"),
            i = document.getElementById("apod-copyright"),
            r = document.getElementById("hd-link");
        n.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
        try {
            const l = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${e}&date=${t}`);
            if (!l.ok) throw new Error(`HTTP error! status: ${l.status}`);
            const c = await l.json();
            if (n.innerHTML = "", "image" === c.media_type) n.innerHTML = `<img src="${c.url}" alt="${c.title}">`, r.href = c.hdurl || c.url, r.style.display = "inline";
            else if ("video" === c.media_type) {
                if (c.url.includes("youtube.com") || c.url.includes("youtu.be")) {
                    const e = c.url.split(/v=|\//).pop();
                    n.innerHTML = `<iframe src="https://www.youtube.com/embed/${e}" frameborder="0" allowfullscreen></iframe>`
                } else n.innerHTML = `<iframe src="${c.url}" frameborder="0" allowfullscreen></iframe>`;
                r.style.display = "none"
            } else n.innerHTML = `<p>Unsupported media type: ${c.media_type}</p>`, r.style.display = "none";
            a.textContent = c.title, o.textContent = new Date(c.date).toDateString(), s.textContent = c.explanation, i.textContent = c.copyright ? `© ${c.copyright}` : ""
        } catch (e) {
            console.error("Error fetching APOD:", e), n.innerHTML = '<p class="error">Error loading APOD. Please try again later.</p>'
        }
    }
    async function m(t) {
        const n = t || document.getElementById("rover").value,
            a = document.getElementById("camera");
        a.innerHTML = '<option value="all">Loading cameras...</option>';
        try {
            const t = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${n}?api_key=${e}`);
            if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
            const o = await t.json();
            a.innerHTML = '<option value="all">All Cameras</option>', o.rover.cameras.forEach((e => {
                const t = document.createElement("option");
                t.value = e.name, t.textContent = `${e.name} (${e.full_name})`, a.appendChild(t)
            }))
        } catch (e) {
            console.error("Error loading cameras:", e), a.innerHTML = '<option value="all">Error loading cameras</option>'
        }
    }
    async function u() {
        const n = document.getElementById("rover").value,
            a = parseInt(document.getElementById("sol").value),
            s = document.getElementById("camera").value,
            i = document.getElementById("mars-photos");
        if (isNaN(a) || a < 0) g(i, "Please enter a valid sol number (≥ 0)");
        else {
            i.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading photos...</div>';
            try {
                const r = o[n]?.max_sol;
                if (a > r) return void
                function(e, t, n) {
                    e.innerHTML = `\n <div class="error">\n <i class="fas fa-exclamation-triangle"></i>\n <p>Maximum sol for ${t} is ${n}</p>\n <button class="random-btn">\n <i class="fas fa-random"></i> Try random sol\n </button>\n </div>\n `, e.querySelector(".random-btn").addEventListener("click", p)
                }(i, n, r);
                const l = await async function(n, a, o) {
                    let s = `https://api.nasa.gov/mars-photos/api/v1/rovers/${n}/photos?sol=${a}&page=${t}&api_key=${e}`;
                    "all" !== o && (s += `&camera=${o}`);
                    const i = await fetch(s);
                    if (!i.ok) throw new Error(`API request failed with status ${i.status}`);
                    return await i.json()
                }(n, a, s);
                ! function(e, n, a) {
                    if (e.innerHTML = "", n.photos?.length > 0) {
                        const a = document.createDocumentFragment();
                        n.photos.forEach((e => {
                            a.appendChild(function(e) {
                                const t = document.createElement("div");
                                return t.className = "photo-item", t.innerHTML = `\n <div class="photo-container">\n <img src="${e.img_src}" \n alt="Mars rover photo from sol ${e.sol}"\n onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=Image+Not+Available'">\n </div>\n <div class="photo-info">\n <p><strong>Sol:</strong> ${e.sol}</p>\n <p><strong>Camera:</strong> ${e.camera.full_name}</p>\n <p><strong>Earth Date:</strong> ${e.earth_date}</p>\n <a href="${e.img_src}" target="_blank" class="full-res-link">\n <i class="fas fa-expand"></i> View full resolution\n </a>\n </div>\n `, t
                            }(e))
                        })), e.appendChild(a), document.getElementById("page-info").textContent = `Page ${t}`
                    } else h(e, a)
                }(i, l, r)
            } catch (e) {
                g(i, `Error loading photos: ${e.message}`)
            }
        }
    }
    async function p() {
        const e = document.getElementById("rover").value,
            n = document.getElementById("mars-photos");
        try {
            const n = o[e]?.max_sol,
                a = Math.floor(Math.random() * n);
            document.getElementById("sol").value = a, t = 1, await u()
        } catch (e) {
            g(n, `Failed to get random sol: ${e.message}`)
        }
    }

    function g(e, t) {
        e.innerHTML = `\n <div class="error">\n <i class="fas fa-exclamation-triangle"></i>\n <h3>Error</h3>\n <p>${t}</p>\n <button class="retry-btn">\n <i class="fas fa-sync-alt"></i> Try again\n </button>\n </div>\n `, e.querySelector(".retry-btn").addEventListener("click", u)
    }

    function h(e, t) {
        e.innerHTML = `\n <div class="no-results">\n <i class="fas fa-image"></i>\n <h3>No photos found</h3>\n <p>Try different parameters:</p>\n <ul>\n <li>Different sol (current max: ${t})</li>\n <li>Another camera</li>\n <li>Different rover</li>\n </ul>\n </div>\n `
    }
    async function f() {
        const t = document.getElementById("neo-start-date").value,
            n = document.getElementById("neo-end-date").value,
            a = document.getElementById("neo-list");
        a.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading NEO data...</div>';
        try {
            const o = new Date(t),
                s = new Date(n),
                i = Math.abs(s - o) / 864e5;
            if (o > s) throw new Error("Start date must be before end date");
            if (i > 7) throw new Error("Date range must be 7 days or less");
            const r = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${t}&end_date=${n}&api_key=${e}`);
            if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
            const l = await r.json();
            a.innerHTML = "";
            let c = 0,
                d = 0;
            for (const e in l.near_earth_objects) l.near_earth_objects[e].forEach((e => {
                d++, e.is_potentially_hazardous_asteroid && c++;
                const t = `\n <div class="neo-card">\n <h3>${e.name.replace(/[()]/g,"")}</h3>\n <p>Diameter: ${e.estimated_diameter.meters.estimated_diameter_min.toFixed(0)}-${e.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} meters</p>\n <p>Close Approach: ${e.close_approach_data[0].close_approach_date}</p>\n <p>Miss Distance: ${Math.round(e.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km</p>\n <p class="${e.is_potentially_hazardous_asteroid?"hazardous":"safe"}">\n ${e.is_potentially_hazardous_asteroid?"⚠️ Potentially Hazardous":"🟢 Not Hazardous"}\n </p>\n </div>\n `;
                a.insertAdjacentHTML("beforeend", t)
            }));
            document.getElementById("neo-stats").innerHTML = `\n <h3>NEO Statistics</h3>\n <p>Total NEOs: ${d}</p>\n <p class="hazardous">Potentially Hazardous: ${c}</p>\n <p class="safe">Safe: ${d-c}</p>\n `
        } catch (e) {
            a.innerHTML = `<p class="error">${e.message}</p>`
        }
    }
    async function y() {
        const e = (new Date).toISOString().split("T")[0];
        document.getElementById("neo-start-date").value = e, document.getElementById("neo-end-date").value = e, f()
    }
    async function v() {
        const t = parseFloat(document.getElementById("earth-lat").value),
            n = parseFloat(document.getElementById("earth-lon").value),
            a = parseFloat(document.getElementById("earth-dim").value),
            o = document.getElementById("earth-date").value,
            s = document.getElementById("earth-image");
        s.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading Earth image...</div>';
        try {
            if (isNaN(t) || isNaN(n) || isNaN(a)) throw new Error("All inputs must be numbers");
            if (t < -90 || t > 90 || n < -180 || n > 180) throw new Error("Invalid coordinates (Lat: -90 to 90, Lon: -180 to 180)");
            if (a <= 0 || a > 1) throw new Error("Dimension must be between 0.1 and 1.0");
            const i = await fetch(`https://api.nasa.gov/planetary/earth/imagery?lon=${n}&lat=${t}&date=${o}&dim=${a}&api_key=${e}`);
            if (!i.ok) throw new Error("No image available - try different coordinates/date");
            s.innerHTML = `<img src="${i.url}" alt="Earth at ${t},${n}">`, document.getElementById("earth-info").innerHTML = `\n <h3>Location Details</h3>\n <p>Latitude: ${t}</p>\n <p>Longitude: ${n}</p>\n <p>Date: ${o}</p>\n <p>Dimension: ${a} km</p>\n <a href="https://www.google.com/maps/@${t},${n},10z" target="_blank">View on Google Maps</a>\n `
        } catch (e) {
            s.innerHTML = `<p class="error">${e.message}</p>`
        }
    }
    async function E() {
        const t = document.getElementById("epic-date"),
            n = document.getElementById("epic-type").value,
            a = document.getElementById("epic-images");
        t.value || (t.value = (new Date).toISOString().split("T")[0]);
        const o = new Date(t.value),
            s = new Date("2015-06-13"),
            i = new Date;
        if (o < s || o > i) return void(a.innerHTML = `\n <div class="error">\n <i class="fas fa-exclamation-triangle"></i>\n <p>Date out of range</p>\n <p>EPIC images are available from ${s.toISOString().split("T")[0]} to today</p>\n <button onclick="fetchEPICImages()">Try again</button>\n </div>\n `);
        const r = t.value.split("T")[0];
        a.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading EPIC images...</div>';
        try {
            const t = `https://api.nasa.gov/EPIC/api/${n}/date/${r}?api_key=${e}`,
                o = await fetch(t);
            if (!o.ok) throw new Error(`API request failed with status ${o.status}`);
            const s = await o.json();
            if (a.innerHTML = "", !s || 0 === s.length) return void(a.innerHTML = `\n <div class="no-results">\n <i class="fas fa-image"></i>\n <p>No EPIC images available for ${r}</p>\n <p>Possible reasons:</p>\n <ul>\n <li>No images were taken that day</li>\n <li>Satellite was in maintenance</li>\n <li>Try the "Enhanced" image type</li>\n </ul>\n <button onclick="fetchEPICImages()">Try again</button>\n </div>\n `);
            let i = "";
            s.forEach((e => {
                try {
                    const t = new Date(e.date),
                        a = t.getFullYear(),
                        o = String(t.getMonth() + 1).padStart(2, "0"),
                        s = String(t.getDate()).padStart(2, "0"),
                        l = `https://epic.gsfc.nasa.gov/archive/${"enhanced"===n?"enhanced":"natural"}/${a}/${o}/${s}/png/${e.image}.png`;
                    i += `\n <div class="photo-item">\n <img src="${l}" \n alt="EPIC ${n} image from ${r}" \n onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=Image+Not+Available'"\n loading="lazy">\n <div class="photo-info">\n <p><strong>Date:</strong> ${e.date.split(" ")[0]}</p>\n <p><strong>Time:</strong> ${e.date.split(" ")[1].substring(0,5)} UTC</p>\n ${e.caption?`<p><strong>Caption:</strong> ${e.caption}</p>`:""}\n <a href="${l}" target="_blank" class="view-full">\n <i class="fas fa-expand"></i> View full resolution\n </a>\n </div>\n </div>\n `
                } catch (e) {
                    console.error("Error processing EPIC image:", e)
                }
            })), a.innerHTML = i || '<p class="error">No valid images could be processed</p>'
        } catch (e) {
            console.error("EPIC Error:", e), a.innerHTML = `\n <div class="error">\n <i class="fas fa-exclamation-triangle"></i>\n <p>Failed to load EPIC images</p>\n <p>${e.message}</p>\n <button class="retry-btn" onclick="fetchEPICImages()">\n <i class="fas fa-sync-alt"></i> Retry\n </button>\n <button class="try-latest-btn" onclick="fetchLatestEPICImages()">\n <i class="fas fa-clock"></i> Try latest images\n </button>\n </div>\n `
        }
    }
    async function I() {
        const e = document.getElementById("search-query").value,
            t = document.getElementById("search-year-start").value,
            o = document.getElementById("search-year-end").value,
            i = document.getElementById("search-media-type").value,
            r = document.getElementById("library-results");
        s = {
            query: e,
            yearStart: t,
            yearEnd: o,
            mediaType: i
        }, r.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching NASA library...</div>';
        try {
            let s = `https://images-api.nasa.gov/search?q=${encodeURIComponent(e)}&page=${n}`;
            t && (s += `&year_start=${t}`), o && (s += `&year_end=${o}`), i && (s += `&media_type=${i}`);
            const r = await fetch(s);
            if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
            const l = await r.json();
            0 === l.collection.items.length ? h() : (! function(e) {
                const t = document.getElementById("library-results");
                let n = "";
                e.forEach((e => {
                    try {
                        const t = e.data[0],
                            a = e.links?.[0]?.href || "",
                            o = t.nasa_id,
                            s = t.title || "Untitled",
                            i = t.date_created?.substring(0, 10) || "Date unknown",
                            r = t.description?.substring(0, 100) || "No description available",
                            l = t.media_type || "image";
                        n += `\n <div class="library-item">\n <div class="media-container">\n ${a?`<img src="${a}" \n alt="${s}" \n onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=Image+Not+Available'">`:`<div class="no-thumbnail">\n <i class="fas fa-${"video"===l?"video":"image"}"></i>\n <p>No preview available</p>\n </div>`}\n </div>\n <div class="library-item-info">\n <h3>${s}</h3>\n <p><i class="fas fa-calendar-alt"></i> ${i}</p>\n <p class="description">${r}...</p>\n <a href="https://images.nasa.gov/details-${o}.html" target="_blank" class="details-link">\n <i class="fas fa-external-link-alt"></i> View details\n </a>\n </div>\n </div>\n `
                    } catch (e) {
                        console.error("Error processing item:", e)
                    }
                })), t.innerHTML = n
            }(l.collection.items), a = Math.ceil(l.collection.metadata.total_hits / 100), document.getElementById("lib-page-info").textContent = `Page ${n} of ${a} (${l.collection.metadata.total_hits} results)`)
        } catch (e) {
            ! function(e) {
                console.error("Search error:", e);
                const t = document.getElementById("library-results");
                t.innerHTML = `\n <div class="error">\n <i class="fas fa-exclamation-triangle"></i>\n <h3>Search failed</h3>\n <p>${e.message}</p>\n <button class="retry-search-btn">\n <i class="fas fa-sync-alt"></i> Try again\n </button>\n </div>\n `, t.querySelector(".retry-search-btn").addEventListener("click", I)
            }(e)
        }
    }

    function h() {
        const e = document.getElementById("library-results");
        e.innerHTML = `\n <div class="no-results">\n <i class="fas fa-search"></i>\n <h3>No results found</h3>\n <p>Try different search terms or filters</p>\n ${s.query?`<p>Your search: "${s.query}"</p>`:""}\n <button class="edit-search-btn">\n <i class="fas fa-edit"></i> Edit search\n </button>\n </div>\n `, document.getElementById("lib-page-info").textContent = "Page 0 of 0 (0 results)", e.querySelector(".edit-search-btn")?.addEventListener("click", (function() {
            document.getElementById("search-query").focus()
        }))
    }
    r.forEach((e => {
        e.addEventListener("click", (t => {
            t.preventDefault();
            c(e.getAttribute("data-tab"))
        }))
    })), document.getElementById("fetch-apod").addEventListener("click", d), document.getElementById("random-apod").addEventListener("click", (async function() {
        const e = new Date(1995, 5, 16),
            t = new Date,
            n = new Date(e.getTime() + Math.random() * (t.getTime() - e.getTime())).toISOString().split("T")[0];
        document.getElementById("apod-date").value = n, d()
    })), document.getElementById("fetch-mars").addEventListener("click", u), document.getElementById("random-mars").addEventListener("click", p), document.getElementById("prev-page").addEventListener("click", (function() {
        t > 1 && (t--, u())
    })), document.getElementById("next-page").addEventListener("click", (function() {
        t++, u()
    })), document.getElementById("rover").addEventListener("change", (function() {
        m(this.value)
    })), document.getElementById("fetch-neo").addEventListener("click", f), document.getElementById("today-neo").addEventListener("click", y), document.getElementById("fetch-earth").addEventListener("click", v), document.getElementById("random-earth").addEventListener("click", (function() {
        const e = (160 * Math.random() - 80).toFixed(4),
            t = (360 * Math.random() - 180).toFixed(4);
        document.getElementById("earth-lat").value = e, document.getElementById("earth-lon").value = t, document.getElementById("earth-dim").value = (.9 * Math.random() + .1).toFixed(1), v()
    })), document.getElementById("fetch-epic").addEventListener("click", E), document.getElementById("latest-epic").addEventListener("click", (async function() {
        const t = document.getElementById("epic-date"),
            n = document.getElementById("epic-images");
        n.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Finding latest images...</div>';
        try {
            const n = await fetch(`https://api.nasa.gov/EPIC/api/enhanced/all?api_key=${e}`);
            if (!n.ok) throw new Error(`API request failed with status ${n.status}`);
            const a = await n.json();
            if (!a || 0 === a.length) throw new Error("No EPIC images available in the archive");
            const o = a[0].date.substring(0, 10);
            t.value = o, await E()
        } catch (e) {
            console.error("Error fetching latest EPIC date:", e), n.innerHTML = `\n <div class="error">\n <i class="fas fa-exclamation-triangle"></i>\n <p>Failed to find latest EPIC images</p>\n <p>${e.message}</p>\n <button class="retry-btn" onclick="fetchLatestEPICImages()">\n <i class="fas fa-sync-alt"></i> Retry\n </button>\n </div>\n `
        }
    })), document.getElementById("search-nasa").addEventListener("click", I), document.getElementById("prev-lib-page").addEventListener("click", (function() {
        n > 1 ? (n--, I()) : document.getElementById("lib-page-info").textContent = "Already on first page"
    })), document.getElementById("next-lib-page").addEventListener("click", (function() {
        n < a ? (n++, I()) : document.getElementById("lib-page-info").textContent = "Already on last page"
    })), c("apod"), async function() {
        await Promise.all(["curiosity", "opportunity", "spirit", "perseverance"].map((t => async function(t) {
            try {
                const n = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${t}?api_key=${e}`);
                if (!n.ok) throw new Error(`HTTP error! status: ${n.status}`);
                const a = await n.json();
                o[t] = {
                    max_sol: a.photo_manifest.max_sol,
                    landing_date: a.photo_manifest.landing_date,
                    launch_date: a.photo_manifest.launch_date
                }
            } catch (e) {
                throw console.error("Error fetching rover manifest:", e), e
            }
        }(t)))), m()
    }()
}));