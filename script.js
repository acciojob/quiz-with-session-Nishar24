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

// cypress/integration/quiz.spec.js
describe('Multiple Choice Quiz', () => {
    beforeEach(() => {
        cy.visit('index.html');
        cy.window().then((win) => {
          win.sessionStorage.clear();
          win.localStorage.clear();
        });
    });

    it('Test 1: Checking Questions and UI Elements', () => {
        cy.get('div#questions > div').should('have.length', 5);
        cy.get('input[type="radio"]').should('have.length', 20);
        cy.get('button#submit').should('exist');
        cy.get('div#score').should('be.empty');
    });

    it('Test 2: Checking Session Storage (Progress Save)', () => {
        cy.get('input[name="q1"][value="4"]').check();
        cy.get('input[name="q2"][value="Paris"]').check();
        cy.get('input[name="q3"][value="15"]').check();
        cy.get('input[name="q4"][value="Jupiter"]').check();
        cy.get('input[name="q5"][value="4"]').check();

        cy.reload();

        cy.get('input[name="q1"][value="4"]').should('be.checked');
        cy.get('input[name="q2"][value="Paris"]').should('be.checked');
        cy.get('input[name="q3"][value="15"]').should('be.checked');
        cy.get('input[name="q4"][value="Jupiter"]').should('be.checked');
        cy.get('input[name="q5"][value="4"]').should('be.checked');
    });

    it('Test 3: Checking Final Score Calculation & Local Storage', () => {
        cy.get('input[name="q1"][value="4"]').check();
        cy.get('input[name="q2"][value="Paris"]').check();
        cy.get('input[name="q3"][value="15"]').check();
        cy.get('input[name="q4"][value="Jupiter"]').check();
        cy.get('input[name="q5"][value="4"]').check();

        cy.get('button#submit').click();

        cy.get('div#score').should('contain', 'Your score is 5 out of 5.');
        cy.window().its('localStorage.score').should('eq', '5');
    });
});