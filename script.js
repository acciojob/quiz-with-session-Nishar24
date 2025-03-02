//your JS code here.
// script.js
document.addEventListener('DOMContentLoaded', function() {
    const questions = document.querySelectorAll('#questions > div');
    const submitButton = document.getElementById('submit');
    const scoreDisplay = document.getElementById('score');

    // Load progress from session storage
    const progress = JSON.parse(sessionStorage.getItem('progress')) || {};
    questions.forEach((question, index) => {
        const questionName = 'q' + (index + 1);
        if (progress[questionName]) {
            const radioButtons = question.querySelectorAll(`input[name="${questionName}"]`);
            radioButtons.forEach(radio => {
                if (radio.value === progress[questionName]) {
                    radio.checked = true;
                }
            });
        }
        // Save progress on change
        question.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() {
                progress[questionName] = this.value;
                sessionStorage.setItem('progress', JSON.stringify(progress));
            });
        });
    });

    // Submit quiz
    submitButton.addEventListener('click', function() {
        let score = 0;
        const answers = {
            q1: '4',
            q2: 'Paris',
            q3: '15',
            q4: 'Jupiter',
            q5: '4'
        };

        questions.forEach((question, index) => {
            const questionName = 'q' + (index + 1);
            const selectedAnswer = document.querySelector(`input[name="${questionName}"]:checked`);
            if (selectedAnswer && selectedAnswer.value === answers[questionName]) {
                score++;
            }
        });

        scoreDisplay.textContent = `Your score is ${score} out of 5.`;
        localStorage.setItem('score', score);
    });

    // Display stored score on page load if it exists
    const storedScore = localStorage.getItem('score');
    if (storedScore) {
        scoreDisplay.textContent = `Your score is ${storedScore} out of 5.`;
    }
});