import { test, expect } from '../src/fixtures/quiz.fixture';
import { generateTestIdentity } from '../src/data/test-identity';
import { UserCreatedSignal } from '../src/outcome/user-created-signal';

test.describe('Charlie sign-up quiz — navigation', () => {
  test('walks through the quiz to a terminal state and creates a user', async ({ quizPage, page }) => {
    const identity = generateTestIdentity();
    const userCreated = new UserCreatedSignal(page);

    const result = await quizPage.completeNavigation(identity);

    expect(
      result.finished,
      `Navigation got stuck after ${result.steps} step(s) at ${result.lastUrl}: ${result.stuckReason}`,
    ).toBe(true);

    await expect(quizPage.finishSignal).toBeVisible();

    expect(
      await userCreated.observed(),
      'Expected POST /api/v1/users to return 2xx at some point during navigation',
    ).toBe(true);
  });
});
