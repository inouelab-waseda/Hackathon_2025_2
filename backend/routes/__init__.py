from .auth_routes import auth_router
from .user_routes import user_router
from .question_routes import question_router

__all__ = [
    'auth_router',
    'user_router',
    'question_router'
]
