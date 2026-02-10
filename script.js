document.addEventListener('DOMContentLoaded', () => {
    
    const navBars = document.getElementById("nav-i");
    const navClose = document.getElementById("nav-ul-i");
    const navList = document.getElementById("navList");

    if (navBars && navClose && navList) {
        navBars.addEventListener("click", () => {
            navList.classList.add("active");
        });

        navClose.addEventListener("click", () => {
            navList.classList.remove("active");
        });
    }


    const pgGenerateBtn = document.getElementById("pg-generate");
    
    if (pgGenerateBtn) {
        pgGenerateBtn.addEventListener("click", () => {
            const lengthInput = document.getElementById("pg-length");
            const length = lengthInput ? parseInt(lengthInput.value) : 12;

            const useUpper = document.getElementById("pg-upper")?.checked;
            const useLower = document.getElementById("pg-lower")?.checked;
            const useNumbers = document.getElementById("pg-numbers")?.checked;
            const useSymbols = document.getElementById("pg-symbols")?.checked;

            let chars = "";
            if (useUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            if (useLower) chars += "abcdefghijklmnopqrstuvwxyz";
            if (useNumbers) chars += "0123456789";
            if (useSymbols) chars += "!@#$%^&*()_+-=[]{}<>?";

            if (chars.length === 0) {
                alert("Zaznacz przynajmniej jedną opcję.");
                return;
            }

            let password = "";
            for (let i = 0; i < length; i++) {
                password += chars[Math.floor(Math.random() * chars.length)];
            }

            const resultField = document.getElementById("pg-result");
            if (resultField) resultField.value = password;
        });

        const pgCopyBtn = document.getElementById("pg-copy");
        if (pgCopyBtn) {
            pgCopyBtn.addEventListener("click", () => {
                const resultField = document.getElementById("pg-result");
                if (resultField && resultField.value !== "") {
                    resultField.select();
                    navigator.clipboard.writeText(resultField.value); 
                }
            });
        }
    }


    const searchInput = document.getElementById('slownikInput');
    const boxes = document.querySelectorAll('.slownik-box');
    const grids = document.querySelectorAll('.slownik-grid');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();

            boxes.forEach(box => {
                const keywords = box.getAttribute('data-name')?.toLowerCase() || "";
                
                if (keywords.includes(searchTerm)) {
                    box.style.display = 'flex';
                } else {
                    box.style.display = 'none'; 
                }
            });

            grids.forEach(grid => {
                const hasVisibleItems = Array.from(grid.querySelectorAll('.slownik-box'))
                                             .some(box => box.style.display !== 'none');
                
                const sectionTitle = grid.previousElementSibling; 

                if (!hasVisibleItems) {
                    grid.style.display = 'none';
                    if (sectionTitle && sectionTitle.classList.contains('slownik-title')) {
                        sectionTitle.style.display = 'none';
                    }
                } else {
                    grid.style.display = 'flex';
                    if (sectionTitle && sectionTitle.classList.contains('slownik-title')) {
                        sectionTitle.style.display = 'block';
                    }
                }
            });
        });
    }
});


    const questions = [
        {
            q: "Czy powinieneś używać tego samego hasła do wszystkich kont?",
            a: ["Tak, to wygodne", "Nie, każde konto powinno mieć unikalne hasło"],
            correct: 1
        },
        {
            q: "Co oznacza skrót 2FA?",
            a: ["Dwustopniowa autoryzacja", "Dwukierunkowy firewall"],
            correct: 0
        },
        {
            q: "Co robi phishing?",
            a: ["Wykrada dane podszywając się pod zaufane instytucje", "Skanuje komputer w poszukiwaniu wirusów"],
            correct: 0
        },
        {
            q: "Co to jest VPN?",
            a: ["Program do czyszczenia komputera", "Szyfrowane połączenie chroniące prywatność"],
            correct: 1
        },
        {
            q: "Silne hasło powinno zawierać:",
            a: ["Tylko małe litery", "Różne znaki: litery, cyfry, symbole"],
            correct: 1
        },
        {
            q: "Atak DDoS polega na:",
            a: ["Przeciążeniu serwera ogromną liczbą żądań", "Włamaniu do bazy danych SQL"],
            correct: 0
        },
        {
            q: "Co to jest ransomware?",
            a: ["Oprogramowanie szyfrujące dane i żądające okupu", "Program antywirusowy"],
            correct: 0
        },
        {
            q: "HTTPS oznacza:",
            a: ["Bezpieczne połączenie szyfrowane", "Niezabezpieczony protokół"],
            correct: 0
        },
        {
            q: "Co to jest firewall?",
            a: ["Zapora filtrująca ruch sieciowy", "Program do edycji zdjęć"],
            correct: 0
        },
        {
            q: "Najbezpieczniejsze hasło to:",
            a: ["Twoje imię + rok urodzenia", "Losowy ciąg znaków"],
            correct: 1
        }
    ];

    let current = 0;
    let answers = Array(questions.length).fill(null);

    const qNum = document.getElementById("quiz-question-number");
    const qText = document.getElementById("quiz-question-text");
    const qAns = document.getElementById("quiz-answers");
    const nextBtn = document.getElementById("quiz-next");
    const prevBtn = document.getElementById("quiz-prev");
    const progressBar = document.getElementById("quiz-progress-bar");
    const resultBox = document.getElementById("quiz-result");

    function renderQuestion() {
        const q = questions[current];

        qNum.textContent = `Pytanie ${current + 1} z ${questions.length}`;
        qText.textContent = q.q;

        qAns.innerHTML = "";

        q.a.forEach((ans, i) => {
            const div = document.createElement("div");
            div.classList.add("answer-option");
            div.textContent = ans;

            if (answers[current] === i) {
                div.classList.add("answer-selected");
            }

            div.addEventListener("click", () => {
                answers[current] = i;

                document.querySelectorAll(".answer-option").forEach(opt => {
                    opt.classList.remove("answer-selected");
                });

                div.classList.add("answer-selected");

                nextBtn.disabled = false;
            });

            qAns.appendChild(div);
        });

        prevBtn.disabled = current === 0;
        nextBtn.disabled = answers[current] === null;

        progressBar.style.width = `${((current + 1) / questions.length) * 100}%`;
    }

    nextBtn.addEventListener("click", () => {
        if (current < questions.length - 1) {
            current++;
            renderQuestion();
        } else {
            showResults();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (current > 0) {
            current--;
            renderQuestion();
        }
    });

    function showResults() {
    qAns.style.display = "none";
    document.getElementById("quiz-buttons").style.display = "none";
    qText.style.display = "none";
    qNum.style.display = "none";

    let score = 0;
    let html = `<h2 style="color:#4de2ff; margin-bottom:20px;">Wyniki testu</h2>`;

    questions.forEach((q, i) => {
        const correct = q.correct === answers[i];
        if (correct) score++;

        html += `
            <div class="quiz-result-item ${correct ? "correct" : "wrong"}">
                <strong>Pytanie ${i + 1}:</strong> ${q.q}<br><br>
                <span style="color:#ccc;">Twoja odpowiedź:</span> ${answers[i] !== null ? q.a[answers[i]] : "Brak"}<br>
                <span style="color:#ccc;">Poprawna odpowiedź:</span> <span style="color:#4de2ff;">${q.a[q.correct]}</span><br><br>
                <span style="color:${correct ? "lightgreen" : "red"}; font-weight:bold;">
                    ${correct ? "✔ Poprawnie" : "✘ Źle"}
                </span>
            </div>
        `;
    });

    html += `<div class="quiz-score">Twój wynik: ${score} / ${questions.length}</div>`;

    resultBox.innerHTML = html;
    resultBox.style.display = "block";
}


    renderQuestion();

