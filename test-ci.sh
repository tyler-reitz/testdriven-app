#!/bin/sh

env=$1
fails=""

inspect() {
  if [ $1 -ne 0 ]; then
    fails="${fails} $2"
  fi
}

# run client and server-side tests
dev() {
  docker-compose -f docker-compose-dev.yml up -d --build
  docker-compose -f docker-compose-dev.yml exec users python manage.py test
  inspect $? users
  #docker-compose -f docker-compose-dev.yml exec users flake8 project
  inspect $? users-lint
  docker-compose -f docker-compose-dev.yml up -d --build
  docker-compose -f docker-compose-dev.yml exec exercises python manage.py test
  inspect $? exercises
  #docker-compose -f docker-compose-dev.yml exec exercises flake8 project
  inspect $? exercises-lint
  docker-compose -f docker-compose-dev.yml exec scores python manage.py test
  inspect $? scores
  #docker-compose -f docker-compose-dev.yml exec scores flake8 project
  inspect $? scores-lint
  docker-compose -f docker-compose-dev.yml exec client npm test -- --coverage
  inspect $? client
  docker-compose -f docker-compose-dev.yml down
}

# run e2e tests
e2e() {
  docker-compose -f docker-compose-stage.yml up -d --build
  docker-compose -f docker-compose-stage.yml exec users python manage.py recreate_db
  ./node_modules/.bin/cypress run --config baseUrl=http://localhost --env REACT_APP_API_GATEWAY_URL=$REACT_APP_API_GATEWAY_URL,LOAD_BALANCER_DNS_NAME=$LOAD_BALANCER_DNS_NAME
  inspect $? e2e
  docker-compose -f docker-compose-stage.yml down
}

# run appropriate tests
if [[ "${env}" == "development" ]]; then
  echo "Running client and server-side tests!"
  dev
elif [[ "${env}" == "staging" ]]; then
  echo "Running e2e tests!"
  e2e stage
elif [[ "${env}" == "production" ]]; then
  echo "Running e2e tests!"
  e2e prod
else
  echo "Running client and server-side tests!"
  dev
fi

# return proper code
if [ -n "${fails}" ]; then
  echo "Tests failed: ${fails}"
  exit 1
else
  echo "Tests passed!"
  exit 0
fi
