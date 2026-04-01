import re
import unittest
from pathlib import Path


class ApiContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = Path('apps/api/src/server.js').read_text(encoding='utf-8')

    def test_health_endpoint_exists(self):
        self.assertIn("app.get('/health'", self.source)

    def test_auth_endpoints_exist(self):
        self.assertIn("app.post('/auth/register'", self.source)
        self.assertIn("app.post('/auth/login'", self.source)

    def test_worker_search_endpoint_exists(self):
        self.assertIn("app.get('/workers/search'", self.source)

    def test_jobs_endpoints_exist(self):
        self.assertIn("app.post('/jobs'", self.source)
        self.assertIn("app.patch('/jobs/:id/status'", self.source)

    def test_register_validation_has_required_fields(self):
        # Basic contract assertion for MVP payload fields in zod schema.
        pattern = re.compile(
            r"app\.post\('/auth/register'.*?z\.object\(\{(.*?)\}\)",
            re.DOTALL,
        )
        match = pattern.search(self.source)
        self.assertIsNotNone(match, 'No se encontró schema de registro')
        schema_block = match.group(1)
        for field in ['role:', 'fullName:', 'email:', 'password:', 'city:']:
            self.assertIn(field, schema_block)


if __name__ == '__main__':
    unittest.main()
