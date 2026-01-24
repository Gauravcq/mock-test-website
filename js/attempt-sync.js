// js/attempt-sync.js
// Reads result summary from the DOM after final submit
// and sends it to the backend via ExamAxisAPI.saveTestAttempt

document.addEventListener('DOMContentLoaded', () => {
  if (!window.ExamAxisAPI) return;

  const finalSubmitBtn = document.getElementById('final-submit-btn');
  if (!finalSubmitBtn) return;

  finalSubmitBtn.addEventListener('click', () => {
    // Only for logged-in users
    if (!ExamAxisAPI.isLoggedIn()) return;

    // Wait for test-logic.js to render the summary UI
    setTimeout(() => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const testId = urlParams.get('testId') || urlParams.get('id');
        if (!testId) return;

        // Use ALL_TESTS to get test meta
        let testTitle = '';
        let subject = '';
        if (typeof ALL_TESTS !== 'undefined' && Array.isArray(ALL_TESTS)) {
          const info = ALL_TESTS.find(t => String(t.id) === String(testId));
          if (info) {
            testTitle = info.title || '';
            subject = info.subject || '';
          }
        }

        // Read values from the result summary cards
        const scoreText = document.querySelector('.stat-card.total-score .stat-value')?.textContent || '0';
        const correctText = document.querySelector('.stat-card.correct .stat-value')?.textContent || '0';
        const incorrectText = document.querySelector('.stat-card.incorrect .stat-value')?.textContent || '0';
        const unattemptedText = document.querySelector('.stat-card.unattempted .stat-value')?.textContent || '0';
        const timeText = document.querySelector('.stat-card.time-taken .stat-value')?.textContent || '00:00';
        const accuracyText = document.querySelector('.stat-card.accuracy .stat-value')?.textContent || '0%';

        const score = Number(scoreText) || 0;
        const correct = parseInt(correctText, 10) || 0;
        const incorrect = parseInt(incorrectText, 10) || 0;
        const unattempted = parseInt(unattemptedText, 10) || 0;

        const [mm, ss] = timeText.split(':');
        const timeTakenMinutes = parseInt(mm, 10) || 0;

        const accuracy = Number(accuracyText.replace('%', '')) || 0;

        const totalQuestions = correct + incorrect + unattempted;
        const maxScore = totalQuestions * 2;

        const payload = {
          testId,
          testTitle,
          subject,
          totalQuestions,
          correct,
          incorrect,
          unattempted,
          score,
          maxScore,
          accuracy,
          timeTakenMinutes
        };

        console.log('Sending attempt payload:', payload);

        ExamAxisAPI.saveTestAttempt(payload)
          .then(res => {
            console.log('saveTestAttempt response:', res);
          })
          .catch(err => {
            console.error('saveTestAttempt error:', err);
          });
      } catch (e) {
        console.error('attempt-sync error:', e);
      }
    }, 500); // 0.5s delay to let DOM update
  });
});