from sqlalchemy import (
    Column, Integer, String, Text, Date, Numeric,
    ForeignKey, CheckConstraint, Computed
)
from sqlalchemy.orm import relationship
from .database import Base  # <- wichtig: Base kommt aus deiner database.py

class Budget(Base):
    __tablename__ = 'budget'

    budget_id = Column(Integer, primary_key=True)
    titel = Column(Text, nullable=False)
    total_einnahmen = Column(Numeric(10, 2), default=0)
    total_ausgaben = Column(Numeric(10, 2), default=0)
    total_umsatz = Column(Numeric(10, 2), Computed("total_einnahmen - total_ausgaben", persisted=True))

    monate = relationship("Monat", back_populates="budget", cascade="all, delete-orphan")


class Monat(Base):
    __tablename__ = 'monat'

    monat_id = Column(Integer, primary_key=True)
    budget_id = Column(Integer, ForeignKey('budget.budget_id', ondelete='CASCADE'), nullable=False)
    monat_name = Column(String(20), nullable=False)
    start_datum = Column(Date, nullable=False)
    end_datum = Column(Date, nullable=False)
    total_einnahmen = Column(Numeric(10, 2), default=0)
    total_ausgaben = Column(Numeric(10, 2), default=0)
    total_umsatz = Column(Numeric(10, 2), Computed("total_einnahmen - total_ausgaben", persisted=True))

    budget = relationship("Budget", back_populates="monate")
    buchungen = relationship("Buchung", back_populates="monat", cascade="all, delete-orphan")


class Buchung(Base):
    __tablename__ = 'buchung'

    buchung_id = Column(Integer, primary_key=True)
    monat_id = Column(Integer, ForeignKey('monat.monat_id', ondelete='CASCADE'), nullable=False)
    typ = Column(String(10), nullable=False)
    titel = Column(Text, nullable=False)
    datum = Column(Date, nullable=False)
    betrag = Column(Numeric(10, 2), nullable=False)

    monat = relationship("Monat", back_populates="buchungen")

    __table_args__ = (
        CheckConstraint("typ IN ('Einnahme', 'Ausgabe')", name='buchung_typ_check'),
    )


class Template(Base):
    __tablename__ = 'template'

    template_id = Column(Integer, primary_key=True)
    typ = Column(String(10), nullable=False)
    titel = Column(Text, nullable=False)
    datum = Column(Date, nullable=False)
    betrag = Column(Numeric(10, 2), nullable=False)

    __table_args__ = (
        CheckConstraint("typ IN ('Einnahme', 'Ausgabe')", name='template_typ_check'),
    )