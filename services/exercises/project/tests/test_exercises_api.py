# services/exercises/project/tests/test_exercises_api.py


import json
import unittest


from project.tests.base import BaseTestCase
from project.tests.utils import add_exercise


class TestExercisesService(BaseTestCase):
    """Test for the Exercises Service."""

    def test_all_exercises(self):
        """Ensure get all exercises behaves correctly."""
        add_exercise()
        add_exercise(
            'Just a sample', 'print("Hello, World!")', 'Hello, World!'
        )
        with self.client:
            response = self.client.get('/exercises')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['data']['exercises']), 2)
            self.assertIn(
                'Define a function called sum',
                data['data']['exercises'][0]['body'])
            self.assertEqual(
                'Just a sample',
                data['data']['exercises'][1]['body'])
            self.assertEqual(
                'sum(2, 2)',
                data['data']['exercises'][0]['test_code'])
            self.assertEqual(
                'print("Hello, World!")',
                data['data']['exercises'][1]['test_code'])
            self.assertEqual(
                '4',
                data['data']['exercises'][0]['test_code_solution'])
            self.assertEqual(
                'Hello, World!',
                data['data']['exercises'][1]['test_code_solution'])
            self.assertIn('success', data['status'])

    def test_add_exercise(self):
        """Ensure a new exercise can be added to the database."""
        with self.client:
            response = self.client.post(
                 '/exercises',
                 data=json.dumps({
                     'body': 'Sample sample',
                     'test_code': 'get_sume(2, 2)',
                     'test_code_solution': '4',
                 }),
                 content_type='application/json',
                 headers=({'Authorization': 'Bearer test'})
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 201)
            self.assertEqual('New exercise was added!', data['message'])
            self.assertIn('success', data['status'])

    def test_add_exercise_invalid_json(self):
        """Ensure error is thrown if the JSON object is empty."""
        with self.client:
            response = self.client.post(
                 '/exercises',
                 data=json.dumps({}),
                 content_type='application/json',
                 headers=({'Authorization': 'Bearer test'})
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertEqual('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_exercise_no_header(self):
        """Ensure error is thrown if 'Authorization' header is empty."""
        with self.client:
            response = self.client.post(
                 '/exercises',
                 data=json.dumps({
                     'body': 'Sample sample',
                     'test_code': 'get_sume(2, 2)',
                     'test_code_solution': '4',
                 }),
                 content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 403)
            self.assertEqual('Provide a valid auth token.', data['message'])
            self.assertIn('error', data['status'])


if __name__ == '__main__':
    unittest.main()
