DROP DATABASE bookly;
CREATE DATABASE bookly;
\connect bookly

\i bookly-schema.sql

DROP DATABASE bookly_test;
CREATE DATABASE bookly_test;
\connect bookly_test

\i bookly-schema.sql