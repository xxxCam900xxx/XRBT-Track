-- Tabelle: Budget
CREATE TABLE Budget (
    budget_id SERIAL PRIMARY KEY,
    titel TEXT NOT NULL,
    total_einnahmen NUMERIC(10, 2) DEFAULT 0,
    total_ausgaben NUMERIC(10, 2) DEFAULT 0,
    total_umsatz NUMERIC(10, 2) GENERATED ALWAYS AS (total_einnahmen + total_ausgaben) STORED
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
    total_umsatz NUMERIC(10, 2) GENERATED ALWAYS AS (total_einnahmen + total_ausgaben) STORED
);

-- Tabelle: Buchung
CREATE TABLE Buchung (
    buchung_id SERIAL PRIMARY KEY,
    monat_id INTEGER NOT NULL REFERENCES Monat(monat_id) ON DELETE CASCADE,
    typ VARCHAR(10) CHECK (typ IN ('einnahme', 'ausgabe')) NOT NULL,
    titel TEXT NOT NULL,
    datum DATE NOT NULL,
    betrag NUMERIC(10, 2) NOT NULL
);

-- Tabelle: Template
CREATE TABLE Template (
    template_id SERIAL PRIMARY KEY,
    typ VARCHAR(10) CHECK (typ IN ('einnahme', 'ausgabe')) NOT NULL,
    titel TEXT NOT NULL,
    datum DATE NOT NULL,
    betrag NUMERIC(10, 2) NOT NULL
);

-- Tabellen Insert Budget
INSERT INTO
    Budget (titel, total_einnahmen, total_ausgaben)
VALUES
    ('Testbudget', 900, -1300);

INSERT INTO 
    Monat (budget_id, monat_name, start_datum, end_datum, total_einnahmen, total_ausgaben)
VALUES 
    (1, 'Januar', '2025-01-01', '2025-01-31', 900, -1300);

INSERT INTO 
    Buchung (monat_id, typ, titel, datum, betrag)
VALUES 
    (1, 'einnahme', 'Einnahme A', '2025-01-01', 200),
    (1, 'einnahme', 'Einnahme B', '2025-01-02', 400),
    (1, 'ausgabe', 'Ausgabe A', '2025-01-03', -300),
    (1, 'einnahme', 'Einnahme C', '2025-01-04', 300),
    (1, 'ausgabe', 'Ausgabe B', '2025-01-05', -1000);