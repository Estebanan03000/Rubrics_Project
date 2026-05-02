"""
Archivo: Backend\academic_service\app\models\__init__.py
Proposito: Implementa la logica principal del archivo __init__.
"""
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

from .entities import (  # noqa: E402,F401
    User,
    Teacher,
    Student,
    Career,
    Semester,
    Subject,
    StudyPlan,
    Group,
    Enrollment,
    Registration,
    Rubric,
    Criterion,
    Scale,
    Evaluation,
    Grade,
    GradeDetail,
)
