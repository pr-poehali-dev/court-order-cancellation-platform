CREATE TABLE IF NOT EXISTS t_p72586878_court_order_cancella.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    yukassa_payment_id VARCHAR(64) UNIQUE,
    plan_id VARCHAR(32) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    user_email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p72586878_court_order_cancella.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    plan_id VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    documents_total INTEGER NOT NULL DEFAULT 0,
    documents_used INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
