DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS spaces CASCADE;

CREATE TABLE spaces (
  id          TEXT PRIMARY KEY,
  floor       TEXT NOT NULL,
  type        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'available',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
  id            SERIAL PRIMARY KEY,
  space_id      TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  plate         TEXT NOT NULL,
  entered_at    TIMESTAMPTZ DEFAULT NOW(),
  exited_at     TIMESTAMPTZ,
  duration_min  INTEGER,
  status        TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE reservations (
  id            SERIAL PRIMARY KEY,
  space_id      TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  plate         TEXT NOT NULL,
  reserved_for  TIMESTAMPTZ NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id          SERIAL PRIMARY KEY,
  session_id  INTEGER REFERENCES sessions(id) ON DELETE SET NULL,
  space_id    TEXT,
  plate       TEXT,
  amount      NUMERIC(10, 2) NOT NULL,
  method      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_payments_created ON payments(created_at DESC);