CREATE TABLE IF NOT EXISTS t_p72586878_court_order_cancella.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(32),
    pdp_agreed BOOLEAN NOT NULL DEFAULT FALSE,
    pdp_agreed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);
