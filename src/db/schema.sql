CREATE TABLE access_logs (
  ip_address      VARCHAR(200) PRIMARY KEY,
  times_accessed  BIGINT,
  last_accessed   BIGINT
);