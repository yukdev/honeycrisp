\echo 'Delete and recreate honeycrisp db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE honeycrisp;
CREATE DATABASE honeycrisp;
\connect honeycrisp

\i honeycrisp-schema.sql
\i honeycrisp-seed.sql

\echo 'Delete and recreate honeycrisp_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE honeycrisp_test;
CREATE DATABASE honeycrisp_test;
\connect honeycrisp_test

\i honeycrisp-schema.sql
