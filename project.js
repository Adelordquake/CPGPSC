document.addEventListener("DOMContentLoaded", () => {
    const logos = document.querySelectorAll(".logo");
    
    logos.forEach((logo, index) => {
        logo.style.animationDelay = `${1 + index * 0.2}s`;
        logo.classList.add("animated");
        setTimeout(() => {
    const finalBG = document.querySelector(".final-bg");
    finalBG.style.animation = "finalBgShow 2s forwards";
}, 4500); 

    });

    const header = document.querySelector("header h4");
    if (header) {
        header.classList.add("animated");
    }

    const intro = document.querySelector(".image-intro");
    setTimeout(() => {
        intro.classList.add("fade-out");
    }, 4000);
});
// SHOW/HIDE PASSWORD
function toggleVisibility() {
    const box = document.getElementById("password");
    box.type = (box.type === "password") ? "text" : "password";
}



// ENTER KEY TRIGGERS POPUP
document.getElementById("password").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        analyzePassword();
    }
});



// CRACK TIME ESTIMATOR
function estimateCrackTime(pwd) {
    let charset = 0;

    if (/[a-z]/.test(pwd)) charset += 26;     // lowercase
    if (/[A-Z]/.test(pwd)) charset += 26;     // uppercase
    if (/[0-9]/.test(pwd)) charset += 10;     // numbers
    if (/[^A-Za-z0-9]/.test(pwd)) charset += 33; // special chars

    if (charset === 0) return "Instantly";

    const guesses = BigInt(charset) ** BigInt(pwd.length);
    const perSecond = BigInt(50_000_000_000); // 50 billion guesses/sec

    const seconds = guesses / perSecond;
    const sec = Number(seconds);

    if (sec < 1) return "Instantly";
    if (sec < 60) return `${sec.toFixed(2)} seconds`;
    if (sec < 3600) return `${(sec / 60).toFixed(2)} minutes`;
    if (sec < 86400) return `${(sec / 3600).toFixed(2)} hours`;
    if (sec < 604800) return `${(sec / 86400).toFixed(2)} days`;
    if (sec < 2628000) return `${(sec / 604800).toFixed(2)} weeks`;
    if (sec < 31536000) return `${(sec / 2628000).toFixed(2)} months`;

    return `${(sec / 31536000).toFixed(2)} years`;
}



// MAIN ANALYSIS FUNCTION
async function analyzePassword() {
    const password = document.getElementById("password").value.trim();
    if (!password) return;

    let lines = [];

    // LENGTH
    if (password.length >= 8) lines.push("✔ Password is 8+ characters");
    else lines.push("✖ Password is too short");

    // SPECIALS
    if (/[^A-Za-z0-9]/.test(password)) lines.push("✔ Contains special characters");
    else lines.push("✖ No special characters");

    // NUMBERS
    if (/\d/.test(password)) lines.push("✔ Contains numbers");
    else lines.push("✖ No numbers");

    // DICTIONARY CHECK
    let found = false;
    try {
        const file = await fetch("weak-passwords.txt");
        const text = await file.text();
        const list = text.split("\n").map(x => x.trim().toLowerCase());
        found = list.includes(password.toLowerCase());
    } catch {
        lines.push("⚠ Wordlist not loaded");
    }

    if (found) {
        lines.push("❗ This password appears in leaked password lists!");
    } else {
        lines.push("✔ Not found in leaked passwords");
    }

    // CRACK TIME (NEW)
    const crackTime = estimateCrackTime(password);
    lines.push(`⏳ Estimated Crack Time: <strong>${crackTime}</strong>`);


    // INSERT RESULTS
    let html = "";
    lines.forEach((line, i) => {
        html += `<p class='analysis-line' style='animation-delay:${i * 0.12}s'>${line}</p>`;
    });

    document.getElementById("analysis-content").innerHTML = html;

    // SHOW POPUP
    const overlay = document.getElementById("analysis-overlay");
    overlay.classList.remove("hidden");
    overlay.classList.add("show");
}



// CLOSE POPUP
function closeAnalysis() {
    const overlay = document.getElementById("analysis-overlay");
    overlay.classList.remove("show");
    setTimeout(() => overlay.classList.add("hidden"), 200);
}
