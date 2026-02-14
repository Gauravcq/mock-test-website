# TODO: Fix Last Attempt Issues

## Issues:
1. Questions only showing reasoning for all tests
2. Last attempt is not storing the last score

## Root Cause Analysis:
- The questions might be stored without proper subject in the backend
- The questions might be fetched incorrectly from the backend
- The score might not be saved/retrieved properly

## Files to Fix:
1. js/test-logic.js - Ensure proper subject assignment for questions
2. js/testService.js - Ensure proper data handling for score and questions
3. js/review.js - Ensure proper question display

## Fix Plan:
1. In test-logic.js:
   - Ensure questions are saved with proper subject property
   - Add debug logging for questions

2. In testService.js:
   - Ensure getLastAttempt properly fetches questions
   - Add fallback to localStorage if questions not in backend

3. In review.js:
   - Ensure questions are properly normalized
   - Add fallback to fetch questions from API if not in attempt

4. In index.html:
   - Ensure View Attempt modal shows correct data
