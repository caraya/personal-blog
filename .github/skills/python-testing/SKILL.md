---
name: python-testing
description: "Python testing skill for test structure, pytest best practices, and coverage validation. Trigger phrases: Python tests, pytest, unittest, test fixtures, test parameterization, coverage, mock objects, test discovery."
---

# Python Testing

Use this SKILL for pytest/unittest setup, fixture design, parameterization, and diagnosing test isolation or coverage issues.

Recommended tools:
- pytest (fixtures, plugins, simple syntax)
- unittest (stdlib-only projects)
- coverage.py / pytest-cov for coverage

Checklist
- Descriptive test names and independent tests
- Appropriate fixture scopes to avoid pollution
- Parameterize repetitive checks
- Mock external dependencies and assert calls precisely

Templates & Examples

Example pytest test:

```py
def test_add():
    assert add(1, 2) == 3
```

Conftest snippet (fixture):

```py
import pytest

@pytest.fixture
def db(tmp_path):
    # setup
    yield db_conn
    # teardown
```

Coverage/issue CSV header:

File,TestName,IssueType,SuggestedFix
app/auth.py,test_auth_flow,Missing branch coverage,Add tests for invalid tokens and expired sessions

Output requirements
- For each finding provide: file and line, coverage or isolation risk, why it matters, minimal fix with code example.
