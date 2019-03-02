

from project.tests.base import BaseTestCase
from project.tests.utils import add_score

class TestScoresModel(BaseTestCase):

    def test_add_score(self):
        score = add_score(1, 1, True)
        self.assertTrue(score.id)
        self.assertTrue(score.user_id)
        self.assertTrue(score.exercise_id)
        self.assertTrue(score.correct)
