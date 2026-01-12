/**
 * MR340 Distance Calculator
 * All river miles measured from the mouth of the Missouri River.
 * Higher RM = further upstream (closer to Kaw Point start)
 * Lower RM = further downstream (closer to St. Charles finish)
 */

const locations = [
    { name: "Kaw Point", rm: 367.5, type: "checkpoint", label: "Start / Checkpoint 1", side: "RR" },
    { name: "KC Riverfront Park", rm: 363.1, type: "ramp", label: "Ramp", side: "RR" },
    { name: "LaBenite Park", rm: 352.6, type: "ramp", label: "Ramp", side: "RR" },
    { name: "Cooley Lake Access", rm: 341.2, type: "ramp", label: "Ramp", side: "RL" },
    { name: "Sibley / Fort Osage Access", rm: 337.2, type: "ramp", label: "Ramp", side: "RR" },
    { name: "Napoleon (Army Corps ramp)", rm: 328.7, type: "ramp", label: "Ramp", side: "RR" },
    { name: "Lexington Riverfront Park", rm: 316.4, type: "paddlestop", label: "Paddlestop", side: "RR" },
    { name: "Waverly Access", rm: 293.5, type: "checkpoint", label: "Checkpoint 2", side: "RR" },
    { name: "Miami Access", rm: 262.8, type: "paddlestop", label: "Paddlestop", side: "RR" },
    { name: "Dalton Bottoms Access", rm: 239.1, type: "ramp", label: "Ramp", side: "RL" },
    { name: "Glasgow / Stump Island", rm: 226.1, type: "checkpoint", label: "Checkpoint 3", side: "RL" },
    { name: "Franklin Island Access", rm: 195.2, type: "paddlestop", label: "Paddlestop", side: "RL" },
    { name: "Taylor's Landing Access", rm: 185.1, type: "ramp", label: "Ramp", side: "RR" },
    { name: "Huntsdale / Former Katfish Katy's", rm: 179.6, type: "ramp", label: "Ramp (supported)", side: "RL" },
    { name: "Cooper's Landing Marina", rm: 170.2, type: "paddlestop", label: "Paddlestop", side: "RL" },
    { name: "Hartsburg Access", rm: 159.8, type: "ramp", label: "Ramp", side: "RL" },
    { name: "Marion Access Area", rm: 158, type: "ramp", label: "Ramp", side: "RR" },
    { name: "Jefferson City (Noren / Wilson Serenity Point)", rm: 144, type: "checkpoint", label: "Checkpoint 4", side: "RL" },
    { name: "Mokane Access", rm: 124.7, type: "ramp", label: "Ramp", side: "RL" },
    { name: "Chamois Access", rm: 117.9, type: "ramp", label: "Ramp", side: "RR" },
    { name: "Hermann Riverfront Park", rm: 97.7, type: "checkpoint", label: "Checkpoint 5", side: "RR" },
    { name: "New Haven Boat Ramp", rm: 81.4, type: "paddlestop", label: "Paddlestop", side: "RR" },
    { name: "Washington City Access", rm: 68.3, type: "paddlestop", label: "Paddlestop", side: "RR" },
    { name: "Klondike Park Boat Ramp (Augusta area)", rm: 56.3, type: "checkpoint", label: "Checkpoint 6", side: "RL" },
    { name: "Weldon Spring Boat Launch", rm: 48.6, type: "ramp", label: "Ramp", side: "RL" },
    { name: "St. Charles (Lewis & Clark Boathouse)", rm: 28.8, type: "finish", label: "Finish", side: "RL" }
];

// DOM Elements - Location selects
const fromSelect = document.getElementById('from-location');
const toSelect = document.getElementById('to-location');
const resultSection = document.getElementById('result');

// DOM Elements - From Date/Time inputs
const fromDate = document.getElementById('from-date');
const fromHour = document.getElementById('from-hour');
const fromMinute = document.getElementById('from-minute');
const fromAmpm = document.getElementById('from-ampm');

// DOM Elements - To Mode selector
const toMode = document.getElementById('to-mode');

// DOM Elements - To input containers
const toDatetimeInputs = document.getElementById('to-datetime-inputs');
const toSpeedInputs = document.getElementById('to-speed-inputs');
const toPaceInputs = document.getElementById('to-pace-inputs');
const toDurationInputs = document.getElementById('to-duration-inputs');

// DOM Elements - To Date/Time inputs
const toDate = document.getElementById('to-date');
const toHour = document.getElementById('to-hour');
const toMinute = document.getElementById('to-minute');
const toAmpm = document.getElementById('to-ampm');

// DOM Elements - To Speed input
const toSpeed = document.getElementById('to-speed');

// DOM Elements - To Pace inputs
const toPaceMin = document.getElementById('to-pace-min');
const toPaceSec = document.getElementById('to-pace-sec');

// DOM Elements - To Duration inputs
const toDurationHours = document.getElementById('to-duration-hours');
const toDurationMins = document.getElementById('to-duration-mins');

/**
 * Format location for dropdown display
 */
function formatLocationOption(loc) {
    const sideLabel = loc.side === 'RR' ? 'River Right' : 'River Left';
    return `${loc.name} — RM ${loc.rm} (${sideLabel})`;
}

/**
 * Populate dropdown selects with locations
 */
function populateDropdowns() {
    // Sort by river mile descending (upstream to downstream, start to finish)
    const sorted = [...locations].sort((a, b) => b.rm - a.rm);
    
    sorted.forEach(loc => {
        const optionText = formatLocationOption(loc);
        
        const fromOption = document.createElement('option');
        fromOption.value = loc.rm;
        fromOption.textContent = optionText;
        fromSelect.appendChild(fromOption);
        
        const toOption = document.createElement('option');
        toOption.value = loc.rm;
        toOption.textContent = optionText;
        toSelect.appendChild(toOption);
    });
}

/**
 * Find location by river mile
 */
function findLocation(rm) {
    return locations.find(loc => loc.rm === parseFloat(rm));
}

/**
 * Check if datetime inputs are complete
 */
function hasCompleteDateTime(dateInput, hour, minute) {
    return dateInput.value !== '' && hour.value !== '' && minute.value !== '';
}

/**
 * Get full Date object from date and time inputs
 */
function getDateTime(dateInput, hour, minute, ampm) {
    if (!dateInput.value || !hour.value || !minute.value) return null;
    
    // Parse the date (format: YYYY-MM-DD)
    const [year, month, day] = dateInput.value.split('-').map(Number);
    
    // Parse and convert hour to 24-hour format
    let h = parseInt(hour.value);
    if (ampm.value === 'AM' && h === 12) h = 0;
    if (ampm.value === 'PM' && h !== 12) h += 12;
    
    const m = parseInt(minute.value);
    
    // Create date object (month is 0-indexed)
    return new Date(year, month - 1, day, h, m, 0, 0);
}

/**
 * Format datetime for display
 */
function formatDateTime(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    if (hours === 0) hours = 12;
    
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    
    return `${month} ${day} ${h}:${m} ${ampm}`;
}

/**
 * Calculate elapsed time in milliseconds between two dates
 */
function calculateElapsedMs(fromDate, toDate) {
    return toDate.getTime() - fromDate.getTime();
}

/**
 * Format elapsed time for display (handles multi-day)
 */
function formatElapsedTime(elapsedMs) {
    const totalMinutes = Math.floor(elapsedMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

/**
 * Calculate speed given distance and elapsed time
 */
function calculateSpeedFromMs(distance, elapsedMs) {
    const hours = elapsedMs / (1000 * 60 * 60);
    if (hours <= 0) return null;
    return distance / hours;
}

/**
 * Calculate pace (min:sec per mile) from elapsed time and distance
 */
function formatPace(elapsedMs, distance) {
    if (distance <= 0) return null;
    const totalMinutes = elapsedMs / (1000 * 60);
    const paceMinutes = totalMinutes / distance;
    const mins = Math.floor(paceMinutes);
    const secs = Math.round((paceMinutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get the closest Tuesday to today
 */
function getClosestTuesday() {
    const today = new Date();
    const day = today.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    
    // Calculate days from Tuesday (day 2)
    const daysFromTuesday = day - 2;
    
    let offset;
    if (daysFromTuesday === 0) {
        // Today is Tuesday
        offset = 0;
    } else if (daysFromTuesday > 0 && daysFromTuesday <= 3) {
        // Wed, Thu, Fri - go back to last Tuesday
        offset = -daysFromTuesday;
    } else if (daysFromTuesday > 3) {
        // Sat - go forward to next Tuesday
        offset = 7 - daysFromTuesday;
    } else {
        // Sun, Mon - go forward to next Tuesday
        offset = -daysFromTuesday;
    }
    
    const tuesday = new Date(today);
    tuesday.setDate(today.getDate() + offset);
    return tuesday;
}

/**
 * Format date as YYYY-MM-DD for input value
 */
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Switch To input mode visibility
 */
function switchToMode(mode) {
    // Hide all mode inputs
    toDatetimeInputs.classList.add('hidden');
    toSpeedInputs.classList.add('hidden');
    toPaceInputs.classList.add('hidden');
    toDurationInputs.classList.add('hidden');
    
    // Show selected mode
    switch(mode) {
        case 'datetime':
            toDatetimeInputs.classList.remove('hidden');
            break;
        case 'speed':
            toSpeedInputs.classList.remove('hidden');
            break;
        case 'pace':
            toPaceInputs.classList.remove('hidden');
            break;
        case 'duration':
            toDurationInputs.classList.remove('hidden');
            break;
    }
}

/**
 * Calculate arrival datetime based on mode
 */
function calculateArrivalFromMode(fromDateTime, distance, mode) {
    let durationMs = null;
    
    switch(mode) {
        case 'speed':
            const speed = parseFloat(toSpeed.value);
            if (!isNaN(speed) && speed > 0) {
                durationMs = (distance / speed) * 60 * 60 * 1000;
            }
            break;
        case 'pace':
            const paceMin = parseInt(toPaceMin.value) || 0;
            const paceSec = parseInt(toPaceSec.value) || 0;
            const paceMinutes = paceMin + paceSec / 60;
            if (paceMinutes > 0) {
                durationMs = paceMinutes * distance * 60 * 1000;
            }
            break;
        case 'duration':
            const hours = parseInt(toDurationHours.value) || 0;
            const mins = parseInt(toDurationMins.value) || 0;
            const totalMins = hours * 60 + mins;
            if (totalMins > 0) {
                durationMs = totalMins * 60 * 1000;
            }
            break;
    }
    
    if (durationMs !== null && durationMs > 0) {
        return {
            arrivalDate: new Date(fromDateTime.getTime() + durationMs),
            elapsedMs: durationMs
        };
    }
    return null;
}

/**
 * Set default From values (closest Tuesday at 8 AM)
 */
function setDefaultFromValues() {
    // Only set defaults if no saved data
    const saved = localStorage.getItem('mr340-calculator');
    if (saved) return;
    
    const tuesday = getClosestTuesday();
    fromDate.value = formatDateForInput(tuesday);
    fromHour.value = '8';
    fromMinute.value = '00';
    fromAmpm.value = 'AM';
}

/**
 * Save all form values to localStorage
 */
function saveToLocalStorage() {
    const data = {
        fromLocation: fromSelect.value,
        toLocation: toSelect.value,
        fromDateVal: fromDate.value,
        fromHourVal: fromHour.value,
        fromMinuteVal: fromMinute.value,
        fromAmpmVal: fromAmpm.value,
        toModeVal: toMode.value,
        toDateVal: toDate.value,
        toHourVal: toHour.value,
        toMinuteVal: toMinute.value,
        toAmpmVal: toAmpm.value,
        toSpeedVal: toSpeed.value,
        toPaceMinVal: toPaceMin.value,
        toPaceSecVal: toPaceSec.value,
        toDurationHoursVal: toDurationHours.value,
        toDurationMinsVal: toDurationMins.value
    };
    localStorage.setItem('mr340-calculator', JSON.stringify(data));
}

/**
 * Load saved form values from localStorage
 */
function loadFromLocalStorage() {
    const saved = localStorage.getItem('mr340-calculator');
    if (!saved) return false;
    
    try {
        const data = JSON.parse(saved);
        
        if (data.fromLocation) fromSelect.value = data.fromLocation;
        if (data.toLocation) toSelect.value = data.toLocation;
        if (data.fromDateVal) fromDate.value = data.fromDateVal;
        if (data.fromHourVal) fromHour.value = data.fromHourVal;
        if (data.fromMinuteVal) fromMinute.value = data.fromMinuteVal;
        if (data.fromAmpmVal) fromAmpm.value = data.fromAmpmVal;
        if (data.toModeVal) {
            toMode.value = data.toModeVal;
            switchToMode(data.toModeVal);
        }
        if (data.toDateVal) toDate.value = data.toDateVal;
        if (data.toHourVal) toHour.value = data.toHourVal;
        if (data.toMinuteVal) toMinute.value = data.toMinuteVal;
        if (data.toAmpmVal) toAmpm.value = data.toAmpmVal;
        if (data.toSpeedVal) toSpeed.value = data.toSpeedVal;
        if (data.toPaceMinVal) toPaceMin.value = data.toPaceMinVal;
        if (data.toPaceSecVal) toPaceSec.value = data.toPaceSecVal;
        if (data.toDurationHoursVal) toDurationHours.value = data.toDurationHoursVal;
        if (data.toDurationMinsVal) toDurationMins.value = data.toDurationMinsVal;
        
        // Recalculate if we have data
        calculateDistance();
        return true;
    } catch (e) {
        // Ignore invalid data
        return false;
    }
}

/**
 * Format arrival time for display (just time, no date prefix)
 */
function formatArrivalTime(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    if (hours === 0) hours = 12;
    
    const m = minutes.toString().padStart(2, '0');
    
    return `${month} ${day}<br>${hours}:${m} ${ampm}`;
}

/**
 * Calculate and display distance
 */
function calculateDistance() {
    const fromRM = parseFloat(fromSelect.value);
    const toRM = parseFloat(toSelect.value);
    
    // Need both selections
    if (isNaN(fromRM) || isNaN(toRM)) {
        resultSection.classList.remove('visible');
        resultSection.innerHTML = '';
        return;
    }
    
    const fromLoc = findLocation(fromRM);
    const toLoc = findLocation(toRM);
    
    // Calculate distance (absolute value)
    const distance = Math.abs(fromRM - toRM);
    
    // Format distance to one decimal place
    const formattedDistance = distance.toFixed(1);
    
    // Check for datetime inputs and build grid items
    const hasFromDateTime = hasCompleteDateTime(fromDate, fromHour, fromMinute);
    const currentMode = toMode.value;
    
    let hasTimeData = false;
    let arrivalHtml = '';
    let durationHtml = '';
    let speedHtml = '';
    let paceHtml = '';
    
    if (hasFromDateTime && distance > 0) {
        const fromDateTime = getDateTime(fromDate, fromHour, fromMinute, fromAmpm);
        
        if (fromDateTime) {
            let elapsedMs = null;
            let toDateTime = null;
            
            if (currentMode === 'datetime') {
                // Original behavior - use entered datetime
                const hasToDateTime = hasCompleteDateTime(toDate, toHour, toMinute);
                if (hasToDateTime) {
                    toDateTime = getDateTime(toDate, toHour, toMinute, toAmpm);
                    if (toDateTime) {
                        elapsedMs = calculateElapsedMs(fromDateTime, toDateTime);
                    }
                }
            } else {
                // Calculate arrival from speed/pace/duration
                const result = calculateArrivalFromMode(fromDateTime, distance, currentMode);
                if (result) {
                    toDateTime = result.arrivalDate;
                    elapsedMs = result.elapsedMs;
                }
            }
            
            // Only show time-based results if elapsed time is positive
            if (elapsedMs !== null && elapsedMs > 0) {
                hasTimeData = true;
                const speed = calculateSpeedFromMs(distance, elapsedMs);
                const pace = formatPace(elapsedMs, distance);
                const elapsed = formatElapsedTime(elapsedMs);
                const arrivalStr = formatArrivalTime(toDateTime);
                
                // Top row: Arrival and Duration (Distance is always first)
                arrivalHtml = `
                    <div class="result-item">
                        <div class="value">${arrivalStr}</div>
                        <div class="label">arrival</div>
                    </div>
                `;
                
                durationHtml = `
                    <div class="result-item">
                        <div class="value">${elapsed}</div>
                        <div class="label">duration</div>
                    </div>
                `;
                
                // Bottom row: Speed and Pace (half-width each)
                speedHtml = `
                    <div class="result-item half-width">
                        <div class="value">${speed.toFixed(1)}</div>
                        <div class="label">mph</div>
                    </div>
                `;
                
                paceHtml = `
                    <div class="result-item half-width">
                        <div class="value">${pace}</div>
                        <div class="label">pace</div>
                    </div>
                `;
            }
        }
    }
    
    // Build result HTML with grid layout
    // When no time data: just show distance centered
    // With time data: 3|2 layout (Distance, Arrival, Duration | Speed, Pace)
    let gridContent;
    if (hasTimeData) {
        gridContent = `
            <div class="result-item">
                <div class="value">${formattedDistance}</div>
                <div class="label">miles</div>
            </div>
            ${arrivalHtml}
            ${durationHtml}
            ${speedHtml}
            ${paceHtml}
        `;
    } else {
        gridContent = `
            <div class="result-item distance-only">
                <div class="value">${formattedDistance}</div>
                <div class="label">miles</div>
            </div>
        `;
    }
    
    resultSection.innerHTML = `
        <div class="result-grid">
            ${gridContent}
        </div>
        <div class="result-locations">
            <span>${fromLoc.name} → ${toLoc.name}</span>
        </div>
    `;
    
    // Trigger animation
    resultSection.classList.add('visible');
}

/**
 * Handle input change - calculate and save
 */
function handleChange() {
    calculateDistance();
    saveToLocalStorage();
}

/**
 * Handle mode change
 */
function handleModeChange() {
    switchToMode(toMode.value);
    handleChange();
}

// Event listeners - Location selects
fromSelect.addEventListener('change', handleChange);
toSelect.addEventListener('change', handleChange);

// Event listeners - From Date/Time inputs
fromDate.addEventListener('change', handleChange);
fromHour.addEventListener('input', handleChange);
fromMinute.addEventListener('input', handleChange);
fromAmpm.addEventListener('change', handleChange);

// Event listener - To Mode selector
toMode.addEventListener('change', handleModeChange);

// Event listeners - To Date/Time inputs
toDate.addEventListener('change', handleChange);
toHour.addEventListener('input', handleChange);
toMinute.addEventListener('input', handleChange);
toAmpm.addEventListener('change', handleChange);

// Event listeners - To Speed input
toSpeed.addEventListener('input', handleChange);

// Event listeners - To Pace inputs
toPaceMin.addEventListener('input', handleChange);
toPaceSec.addEventListener('input', handleChange);

// Event listeners - To Duration inputs
toDurationHours.addEventListener('input', handleChange);
toDurationMins.addEventListener('input', handleChange);

// Initialize
populateDropdowns();
const hadSavedData = loadFromLocalStorage();
if (!hadSavedData) {
    setDefaultFromValues();
}
