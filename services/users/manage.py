import sys
import unittest
import coverage

from flask.cli import FlaskGroup

from project import create_app, db
from project.api.models import User

COV = coverage.coverage(
    branch=True,
    include='project/*',
    omit=[
        'project/test/*',
        'project/config.py'
    ]
)
COV.start()

app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command('recreate_db')
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command()
def test():
    """Run test withou code coverage"""
    tests = unittest.TestLoader().discover('project/tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    sys.exit(result)


@cli.command('seed_db')
def seed_db():
    """Seeds the database."""
    db.session.add(User(
        username='michael',
        email='hermanmu@gmail.com',
        password='greaterthaneight'
    ))
    db.session.add(User(
        username='michaelherman',
        email='micheal@mherman.org',
        password='greaterthaneight'
    ))
    db.session.commit()


@cli.command()
def cov():
    """Runs the unit test with coverage."""
    tests = unittest.TestLoader().discover('project/tests')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        COV.stop()
        COV.save()
        print('Coverage Summary:')
        COV.report()
        COV.html_report()
        COV.erase()
        return 0
    sys.exit(result)


if __name__ == '__main__':
    cli()
