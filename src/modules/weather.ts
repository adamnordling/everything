// =============================================================================
// WEATHER, ATMOSPHERE & SOLAR ARC PRECISION ENGINE
// =============================================================================

const SVG_WX = {
    sun: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>`,
    cloudSun: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M12 2v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M20 12h2"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M19.07 4.93l-1.41 1.41"></path><path d="M15.5 17a4.5 4.5 0 1 0-8.9-1.5A3.5 3.5 0 1 0 5 21h12a3 3 0 0 0 .5-6z" stroke="#38bdf8"></path></svg>`,
    cloud: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
    rain: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M16 13v8"></path><path d="M8 13v8"></path><path d="M12 15v8"></path><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`
};

export async function initWeather(): Promise<void> {
    const tempEl = document.getElementById('wx-temp');
    const condLabel = document.getElementById('wx-condition-label');
    const condPill = document.getElementById('wx-condition-pill');
    const uvEl = document.getElementById('wx-uv');
    const humidityEl = document.getElementById('wx-humidity');
    const windEl = document.getElementById('wx-wind');
    const sunDot = document.getElementById('solar-sun-dot');
    const fiveDayStrip = document.getElementById('five-day-strip');
    const hourlyStrip = document.getElementById('hourly-strip');

    // Default to Stockholm, Sweden coordinates
    let lat = 59.3293;
    let lon = 18.0686;

    if ('geolocation' in navigator) {
        try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
            });
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
        } catch {
            // Keep default coordinates
        }
    }

    try {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset&timezone=auto`
        );
        if (!res.ok) throw new Error();

        interface WxResponse {
            current: { temperature_2m: number; relative_humidity_2m: number; weather_code: number; wind_speed_10m: number; };
            daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; uv_index_max: number[]; sunrise: string[]; sunset: string[]; };
            hourly: { time: string[]; temperature_2m: number[]; weather_code: number[]; };
        }

        const data = (await res.json()) as WxResponse;

        if (tempEl) tempEl.textContent = String(Math.round(data.current.temperature_2m));
        if (humidityEl) humidityEl.textContent = `${data.current.relative_humidity_2m}%`;
        if (windEl) windEl.textContent = `${data.current.wind_speed_10m.toFixed(1)} m/s`;

        const uv = data.daily.uv_index_max[0] ?? 1;
        if (uvEl) uvEl.textContent = `${uv.toFixed(1)} (${uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : 'High'})`;

        const condition = getConditionInfo(data.current.weather_code);
        if (condLabel) condLabel.textContent = condition.name;
        if (condPill) condPill.innerHTML = `${condition.svg} <span style="font-weight:600;">${condition.name}</span>`;

        // Solar Arc Math
        if (sunDot && data.daily.sunrise[0] && data.daily.sunset[0]) {
            const sr = new Date(data.daily.sunrise[0]).getTime();
            const ss = new Date(data.daily.sunset[0]).getTime();
            const now = Date.now();
            let progress = Math.max(0, Math.min(1, (now - sr) / (ss - sr)));

            const angle = Math.PI * (1 - progress);
            const cx = 90 + 70 * Math.cos(angle);
            const cy = 85 - 70 * Math.sin(angle);
            sunDot.setAttribute('cx', cx.toFixed(1));
            sunDot.setAttribute('cy', cy.toFixed(1));
        }

        // 5-Day Strip
        if (fiveDayStrip) {
            fiveDayStrip.innerHTML = '';
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            for (let i = 0; i < 5; i++) {
                const dateStr = data.daily.time[i];
                if (!dateStr) continue;
                const d = new Date(dateStr);
                const info = getConditionInfo(data.daily.weather_code[i] ?? 0);
                const max = Math.round(data.daily.temperature_2m_max[i] ?? 0);
                const min = Math.round(data.daily.temperature_2m_min[i] ?? 0);

                const col = document.createElement('div');
                col.className = 'day-mini-card';
                col.innerHTML = `
                    <span style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700;">${i === 0 ? 'Today' : dayNames[d.getDay()]}</span>
                    <div>${info.svg}</div>
                    <span style="font-size:0.75rem; font-family:var(--font-mono); font-weight:700;">${max}° <small style="color:var(--text-muted);">${min}°</small></span>
                `;
                fiveDayStrip.appendChild(col);
            }
        }

        // 24h Hourly Strip
        if (hourlyStrip) {
            hourlyStrip.innerHTML = '';
            const nowH = new Date().getHours();
            for (let i = nowH; i < nowH + 24; i++) {
                const timeStr = data.hourly.time[i];
                if (!timeStr) continue;
                const hDate = new Date(timeStr);
                const info = getConditionInfo(data.hourly.weather_code[i] ?? 0);
                const temp = Math.round(data.hourly.temperature_2m[i] ?? 0);

                const chip = document.createElement('div');
                chip.className = 'hour-chip';
                chip.innerHTML = `
                    <span style="font-size:0.65rem; color:var(--text-muted);">${String(hDate.getHours()).padStart(2, '0')}:00</span>
                    <div>${info.svg}</div>
                    <span style="font-size:0.72rem; font-weight:700;">${temp}°</span>
                `;
                hourlyStrip.appendChild(chip);
            }
        }
    } catch {
        if (condLabel) condLabel.textContent = 'Weather Offline';
    }
}

function getConditionInfo(code: number): { name: string; svg: string } {
    if (code === 0) return { name: 'Clear Sky', svg: SVG_WX.sun };
    if (code <= 3) return { name: 'Partly Cloudy', svg: SVG_WX.cloudSun };
    if (code <= 48) return { name: 'Overcast', svg: SVG_WX.cloud };
    if (code <= 67) return { name: 'Rain', svg: SVG_WX.rain };
    return { name: 'Showers', svg: SVG_WX.rain };
}