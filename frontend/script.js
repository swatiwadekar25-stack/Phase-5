
import { marked } from "/node_modules/marked/lib/marked.esm.js";
import DOMPurify from "/node_modules/dompurify/dist/purify.es.mjs";

const questionInput = document.getElementById("question");
const submitBtn = document.getElementById("submitBtn");
const answer = document.getElementById("answer");

// Configure Markdown formatting
marked.setOptions({
    gfm: true,
    breaks: true
});

submitBtn.addEventListener("click", async () => {
    const question = questionInput.value.trim();

    if (question === "") {
        answer.textContent = "Please enter a question.";
        return;
    }

    answer.textContent = "Thinking... 🤔";
    submitBtn.disabled = true;

    try {
        const response = await fetch("/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to get an answer.");
        }

        if (!data.answer) {
            throw new Error("The server returned an empty answer.");
        }

        // Convert Markdown into HTML and sanitize it
        const formattedHTML = await marked.parse(data.answer);
        answer.innerHTML = DOMPurify.sanitize(formattedHTML);

    } catch (error) {
        console.error("Error:", error);
        answer.textContent = error.message || "Something went wrong. Please try again.";
    } finally {
        submitBtn.disabled = false;
    }
});

// Allow Enter key to submit the question
questionInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        submitBtn.click();
    }
});
