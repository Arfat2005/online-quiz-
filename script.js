const landingPage = document.querySelector(".landing-page");
const gameCategory = document.querySelector(".game-category");
const quizSection = document.querySelector(".quiz");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const scoreElement = document.getElementById("score"); // Get the score element

let currentQuestionIndex = 0;
let questions = [];
let score = 0; // Initialize score to 0

// Function to show the landing page and hide other sections
function showLandingPage() {
    landingPage.style.display = "";
    gameCategory.style.display = "none";
    quizSection.style.display = "none";
}

// Function to show the game category selection and hide other sections
function showGameCategory() {
    landingPage.style.display = "none";
    gameCategory.style.display = "";
    quizSection.style.display = "none";
}

// Function to show the quiz and hide other sections
function showQuiz(category) {
    landingPage.style.display = "none";
    gameCategory.style.display = "none";
    quizSection.style.display = "";
    // Load questions when quiz section is shown

    getQuestions(category);
}

// Function to fetch questions from the Open Trivia Database API
async function getQuestions(category) {
    const API_URL = `https://opentdb.com/api.php?amount=5&type=multiple&category=${encodeURIComponent(category)}`;
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Check if the question property exists
        if (data.results && data.results.length > 0 && data.results[0].question) {
            questions = data.results;
            displayQuestion();
        } else {
            console.error("Invalid data format:", data);
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

// Function to display the current question
function displayQuestion() {
    optionsContainer.style.display = '';
    const currentQuestion = questions[currentQuestionIndex];

    // Check if the currentQuestion object and its question property exist
    if (currentQuestion && currentQuestion.question) {
        questionElement.textContent = currentQuestion.question;

        optionsContainer.innerHTML = "";
        currentQuestion.incorrect_answers.forEach((option) => {
            addOption(option, false);
        });

        addOption(currentQuestion.correct_answer, true);
    } else {
        console.error("Invalid question format:", currentQuestion);
    }
}

// Function to add option buttons to the options container
function addOption(text, isCorrect) {
    const optionElement = document.createElement("button");
    optionElement.textContent = text;
    optionElement.classList.add("option");
    optionElement.dataset.correct = isCorrect;
    optionElement.addEventListener("click", selectOption);
    optionsContainer.appendChild(optionElement);
}

// Function to handle option selection
async function selectOption(event) {
    const selectedOption = event.target;
    const isCorrect = selectedOption.dataset.correct === "true";

    if (isCorrect) {
        questionElement.textContent = "Correct!";
        optionsContainer.style.display = 'none';
        score++; // Increment score if correct
    } else {
        questionElement.textContent = "Incorrect!";
        optionsContainer.style.display = 'none';
    }
    
    currentQuestionIndex++;

    if (currentQuestionIndex < 5) { // Stop the quiz after 5 questions
        // Wait for 0.5 seconds before showing the next question
        await new Promise(resolve => setTimeout(resolve, 500));
        displayQuestion();
    } else {
        // Quiz completed, wait for 0.5 seconds before showing final score and resetting
        await new Promise(resolve => setTimeout(resolve, 500));
        showFinalScore();
    }
}

// Function to show final score
function showFinalScore() {
    questionElement.textContent = `Quiz completed! Your final score is ${score} out of 5.`;
    optionsContainer.style.display = 'none';
    scoreElement.textContent = `Final Score: ${score} / 5`;
    // Wait for 2 seconds before resetting and showing landing page
    setTimeout(() => {
        currentQuestionIndex = 0;
        score = 0;
        showLandingPage();
    }, 2000);
}

// Initial setup
showLandingPage();