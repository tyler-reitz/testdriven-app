#!/bin/bash

fails=""

inspect() {
  if [ $1 -ne 0 ]; then
    fails="${fails} $2"
  fi
}


# run unit and integration tests
docker-compose -f docker-compose-dev.yml up -d --build
docker-compose -f docker-compose-dev.yml exec users python manage.py test
inspect $? users
docker-compose -f docker-compose-dev.yml exec users flake8 project
inspect $? users-lint
docker-compose -f docker-compose-dev.yml exec client npm test -- --coverage
inspect $? client
docker-compose -f docker-compose-dev.yml down

docker-compose -f docker-compose-prod.yml up -d --build
docker-compose -f docker-compose-prod.yml exec users python manage.py recreate_db
npx cypress run --config baseUrl=http://localhost
inspect $? e2e
docker-compose -f docker-compose-prod.yml down


# return proper code
if [ -n "${fails}" ]; then
  echo "Test failed: ${fails}"
  exit 1
else
  echo "Tests passed!"
  exit 0
fi
