-- Tabelle: Budget
CREATE TABLE Budget (
    budget_id SERIAL PRIMARY KEY,
    titel TEXT NOT NULL,
    jahr INT NOT NULL,
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
    betrag NUMERIC(10, 2) NOT NULL
);

-- Budget
INSERT INTO Budget (titel, jahr, total_einnahmen, total_ausgaben)
VALUES ('Jahresbudget 2025', 2025, 24000, -18000);

-- 12 Monate
INSERT INTO Monat (budget_id, monat_name, start_datum, end_datum, total_einnahmen, total_ausgaben) VALUES
(1, 'Januar',   '2025-01-01', '2025-01-31', 2000,  -1500),
(1, 'Februar',  '2025-02-01', '2025-02-28', 1800,  -1400),
(1, 'März',     '2025-03-01', '2025-03-31', 2000,  -1600),
(1, 'April',    '2025-04-01', '2025-04-30', 1900,  -1500),
(1, 'Mai',      '2025-05-01', '2025-05-31', 2100,  -1700),
(1, 'Juni',     '2025-06-01', '2025-06-30', 2000,  -1500),
(1, 'Juli',     '2025-07-01', '2025-07-31', 1900,  -1600),
(1, 'August',   '2025-08-01', '2025-08-31', 2100,  -1400),
(1, 'September','2025-09-01', '2025-09-30', 2000,  -1500),
(1, 'Oktober',  '2025-10-01', '2025-10-31', 2200,  -1800),
(1, 'November', '2025-11-01', '2025-11-30', 2100,  -1500),
(1, 'Dezember', '2025-12-01', '2025-12-31', 2100,  -1600);

-- Buchungen (Einnahmen & Ausgaben) pro Monat, Beispiel je 4-5 Einträge
-- Januar
INSERT INTO Buchung (monat_id, typ, titel, datum, betrag) VALUES
(1, 'einnahme', 'Gehalt',      '2025-01-01', 1500),
(1, 'einnahme', 'Nebenjob',    '2025-01-10', 500),
(1, 'ausgabe',  'Miete',       '2025-01-05', -800),
(1, 'ausgabe',  'Lebensmittel','2025-01-12', -400),
(1, 'ausgabe',  'Freizeit',    '2025-01-20', -300);

-- Februar
INSERT INTO Buchung (monat_id, typ, titel, datum, betrag) VALUES
(2, 'einnahme', 'Gehalt',      '2025-02-01', 1500),
(2, 'einnahme', 'Nebenjob',    '2025-02-10', 300),
(2, 'ausgabe',  'Miete',       '2025-02-05', -800),
(2, 'ausgabe',  'Lebensmittel','2025-02-15', -300),
(2, 'ausgabe',  'Freizeit',    '2025-02-20', -300);

-- März
INSERT INTO Buchung (monat_id, typ, titel, datum, betrag) VALUES
(3, 'einnahme', 'Gehalt',      '2025-03-01', 1600),
(3, 'einnahme', 'Nebenjob',    '2025-03-15', 400),
(3, 'ausgabe',  'Miete',       '2025-03-05', -900),
(3, 'ausgabe',  'Lebensmittel','2025-03-12', -400),
(3, 'ausgabe',  'Freizeit',    '2025-03-22', -300);

-- April
INSERT INTO Buchung (monat_id, typ, titel, datum, betrag) VALUES
(4, 'einnahme', 'Gehalt',      '2025-04-01', 1400),
(4, 'einnahme', 'Nebenjob',    '2025-04-18', 500),
(4, 'ausgabe',  'Miete',       '2025-04-05', -800),
(4, 'ausgabe',  'Lebensmittel','2025-04-14', -400),
(4, 'ausgabe',  'Freizeit',    '2025-04-20', -300);

-- Mai
INSERT INTO Buchung (monat_id, typ, titel, datum, betrag) VALUES
(5, 'einnahme', 'Gehalt',      '2025-05-01', 1600),
(5, 'einnahme', 'Nebenjob',    '2025-05-20', 500),
(5, 'ausgabe',  'Miete',       '2025-05-05', -900),
(5, 'ausgabe',  'Lebensmittel','2025-05-10', -400),
(5, 'ausgabe',  'Freizeit',    '2025-05-25', -400);

-- Juni
INSERT INTO Buchung (monat_id, typ, titel, datum, betrag) VALUES
(6, 'einnahme', 'Gehalt',      '2025-06-01', 1500),
(6, 'einnahme', 'Nebenjob',    '2025-06-18', 500),
(6, 'ausgabe',  'Miete',       '2025-06-05', -800),
(6, 'ausgabe',  'Lebensmittel','2025-06-15', -400),
(6, 'ausgabe',  'Freizeit',    '2025-06-20', -300);

-- Juli
INSERT INTO Buchung (monat_id, typ, titel, datum, betrag) VALUES
(7, 'einnahme', 'Gehalt',      '2025-07-01', 1400),
(7, 'einnahme', 'Nebenjob',    '2025-07-18', 500),
(7, 'ausgabe',  'Miete',       '2025-07-05', -900),
(7, 'ausgabe',  'Lebensmittel','2025-07-15', -400),
(7, 'ausgabe',  'Freizeit',    '2025-07-20', -300);

-- August
INSERT INTO Buchung (monat_id, typ, titel, datum, betrag) VALUES
(8, 'einnahme', 'Gehalt',      '2025-08-01', 1600),
(8, 'einnahme', 'Nebenjob',    '2025-08-18', 500),
(8, 'ausgabe',  'Miete',       '2025-08-05', -800),
(8, 'ausgabe',  'Lebensmittel','2025-08-15', -400),
(8, 'ausgabe',  'Freizeit',    '2025-08-20', -200);

-- September
INSERT INTO Buchung (monat_id, typ, titel, datum, betrag) VALUES
(9, 'einnahme', 'Gehalt',      '2025-09-01', 1500),
(9, 'einnahme', 'Nebenjob',    '2025-09-18', 500),
(9, 'ausgabe',  'Miete',       '2025-09-05', -900),
(9, 'ausgabe',  'Lebensmittel','2025-09-15', -400),
(9, 'ausgabe',  'Freizeit',    '2025-09-20', -200);

-- Oktober
INSERT INTO Buchung (monat_id, typ, titel, datum, betrag) VALUES
(10, 'einnahme', 'Gehalt',      '2025-10-01', 1600),
(10, 'einnahme', 'Nebenjob',    '2025-10-18', 600),
(10, 'ausgabe',  'Miete',       '2025-10-05', -900),
(10, 'ausgabe',  'Lebensmittel','2025-10-15', -500),
(10, 'ausgabe',  'Freizeit',    '2025-10-20', -400);

-- November
INSERT INTO Buchung (monat_id, typ, titel, datum, betrag) VALUES
(11, 'einnahme', 'Gehalt',      '2025-11-01', 1600),
(11, 'einnahme', 'Nebenjob',    '2025-11-18', 500),
(11, 'ausgabe',  'Miete',       '2025-11-05', -900),
(11, 'ausgabe',  'Lebensmittel','2025-11-15', -400),
(11, 'ausgabe',  'Freizeit',    '2025-11-20', -300);

-- Dezember
INSERT INTO Buchung (monat_id, typ, titel, datum, betrag) VALUES
(12, 'einnahme', 'Gehalt',      '2025-12-01', 1600),
(12, 'einnahme', 'Nebenjob',    '2025-12-18', 600),
(12, 'ausgabe',  'Miete',       '2025-12-05', -900),
(12, 'ausgabe',  'Lebensmittel','2025-12-15', -400),
(12, 'ausgabe',  'Freizeit',    '2025-12-20', -300);

INSERT INTO 
    Template (template_id, typ, titel, betrag)
VALUES 
    (1, 'einnahme', 'Lohn', 200),
    (2, 'einnahme', 'Twitch', 50),
    (3, 'ausgabe', 'Active Fitness', -300);