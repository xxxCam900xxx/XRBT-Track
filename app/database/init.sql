-- Tabelle: Budget
CREATE TABLE Budget (
    budget_id SERIAL PRIMARY KEY,
    titel TEXT NOT NULL,
    total_einnahmen NUMERIC(10, 2) DEFAULT 0,
    total_ausgaben NUMERIC(10, 2) DEFAULT 0,
    total_umsatz NUMERIC(10, 2) GENERATED ALWAYS AS (total_einnahmen - total_ausgaben) STORED
);

-- Tabelle: Monat
CREATE TABLE Monat (
    monat_id SERIAL PRIMARY KEY,
    budget_id INTEGER NOT NULL REFERENCES Budget(budget_id) ON DELETE CASCADE,
    monat_name VARCHAR(20) NOT NULL,
    start_datum DATE NOT NULL,
    end_datum DATE NOT NULL,
    total_einnahmen NUMERIC(10, 2) DEFAULT 0,
    total_ausgaben NUMERIC(10, 2) DEFAULT 0,
    total_umsatz NUMERIC(10, 2) GENERATED ALWAYS AS (total_einnahmen - total_ausgaben) STORED
);

-- Tabelle: Buchung
CREATE TABLE Buchung (
    buchung_id SERIAL PRIMARY KEY,
    monat_id INTEGER NOT NULL REFERENCES Monat(monat_id) ON DELETE CASCADE,
    typ VARCHAR(10) CHECK (typ IN ('Einnahme', 'Ausgabe')) NOT NULL,
    titel TEXT NOT NULL,
    datum DATE NOT NULL,
    betrag NUMERIC(10, 2) NOT NULL
);

-- Tabelle: Template
CREATE TABLE Template (
    template_id SERIAL PRIMARY KEY,
    typ VARCHAR(10) CHECK (typ IN ('Einnahme', 'Ausgabe')) NOT NULL,
    titel TEXT NOT NULL,
    datum DATE NOT NULL,
    betrag NUMERIC(10, 2) NOT NULL
);

-- Tabellen Insert Budget
INSERT INTO
    Budget (titel, total_einnahmen, total_ausgaben)
VALUES
    ('Monat April', 3000.00, 2200.00),
    ('Monat Mai', 3200.00, 2500.00),
    ('Sommerurlaub', 1500.00, 1800.00),
    ('Auto Reparatur', 0.00, 900.00),
    ('Nebenprojekt', 500.00, 100.00);

-- Beispiel 1: Januar für Budget 1 (Privat)
INSERT INTO 
    Monat (budget_id, monat_name, start_datum, end_datum, total_einnahmen, total_ausgaben)
VALUES 
    (1, 'Januar', '2025-01-01', '2025-01-31', 3000.00, 2500.00),
    (1, 'Februar', '2025-02-01', '2025-02-28'),
    (2, 'März', '2025-03-01', '2025-03-31', 1000.00, 1500.00)
    (2, 'April', '2025-04-01', '2025-04-30', 2000.00, 2000.00);
