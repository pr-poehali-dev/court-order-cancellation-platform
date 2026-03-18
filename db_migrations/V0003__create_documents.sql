CREATE TABLE IF NOT EXISTS t_p72586878_court_order_cancella.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    payment_id VARCHAR(64),
    court_name VARCHAR(255),
    creditor_name VARCHAR(255),
    debt_amount VARCHAR(128),
    order_number VARCHAR(64),
    order_date VARCHAR(32),
    form_data JSONB NOT NULL,
    pdf_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_documents_user_email ON t_p72586878_court_order_cancella.documents(user_email);
