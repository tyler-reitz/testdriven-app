# base image
FROM postgres:11.1-alpine

# run create on init
ADD create.sql /docker-entrypoint-initdb.d
