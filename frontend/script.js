
const questionInput = document.getElementById("question");
const submitBtn = document.getElementById("submitBtn");
const answerDiv = document.getElementById("answer");

submitBtn.addEventListener("click", async () => {
    const question = questionInput.value.trim();

    // Check if question is empty
    if (question === "") {
        answerDiv.innerText = "Please enter a question.";
        return;
    }

    // Show loading message
    answerDiv.innerText = "Thinking... 🤔";

    try {
        // Send question to backend
        const response = await fetch("/api/ask", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })
        });

        // Convert backend response to JSON
        const data = await response.json();

        // show answer
        answerDiv.innerText = data.answer;

    } catch (error) {
        console.error(error);
        answerDiv.innerText = "Something went wrong. Please try again.";
    }
})
