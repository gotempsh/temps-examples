-- SPDX-FileCopyrightText: 2024-2026 Temps Contributors
-- SPDX-License-Identifier: MIT OR Apache-2.0

CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'plaintext',
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
