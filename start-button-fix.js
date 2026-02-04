// Simple start button fix - add this to test.html before closing </body> tag
<script>
// Fix start button functionality
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-test-btn');
    if (startBtn) {
        console.log('Found start test button, adding event listener');
        
        // Remove existing listeners and add fresh ones
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Start test button clicked!');
            
            // Hide instructions modal
            const instructionsModal = document.getElementById('instructions-modal');
            if (instructionsModal) {
                instructionsModal.classList.add('hidden');
                console.log('Hidden instructions modal');
            }
            
            // Show quiz UI
            const quizUI = document.getElementById('quiz-ui');
            if (quizUI) {
                quizUI.classList.remove('hidden');
                console.log('Shown quiz UI');
            }
            
            // Try to initialize quiz if function exists
            if (typeof initQuiz === 'function') {
                initQuiz();
                console.log('Called initQuiz function');
            }
            
            // Set quiz started flag
            if (window.QUIZ_DATA) {
                window.QUIZ_DATA.isQuizStarted = true;
            }
        });
        
        // Fallback onclick
        newBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Start test onclick fallback triggered');
            
            const instructionsModal = document.getElementById('instructions-modal');
            if (instructionsModal) {
                instructionsModal.classList.add('hidden');
            }
            
            const quizUI = document.getElementById('quiz-ui');
            if (quizUI) {
                quizUI.classList.remove('hidden');
            }
            
            if (typeof initQuiz === 'function') {
                initQuiz();
            }
        };
        
        console.log('Start test button event listeners added successfully');
    } else {
        console.error('Start test button not found!');
    }
});
</script>
