from fastapi import APIRouter, Depends

from models import QuestionRequest, QuestionResponse, AnswerRequest, AnswerResponse, ProposalRequest, ProposalResponse, User
from controllers.question_controller import QuestionController
from services.auth_service import get_current_active_user

question_router = APIRouter(prefix="/api/questions", tags=["質問"])
question_controller = QuestionController()

@question_router.post("/", response_model=QuestionResponse)
async def get_question(
    request: QuestionRequest,
    current_user: User = Depends(get_current_active_user)
):
    """新しい質問を取得"""
    return await question_controller.get_question(request=request, current_user=current_user)

@question_router.post("/answer", response_model=AnswerResponse)
async def save_answer(
    request: AnswerRequest,
    current_user: User = Depends(get_current_active_user)
):
    """回答を保存"""
    return await question_controller.save_answer(request=request, current_user=current_user)

@question_router.post("/proposal", response_model=ProposalResponse)
async def get_proposal(
    request: ProposalRequest,
    current_user: User = Depends(get_current_active_user)
):
    """自分磨きの提案を取得"""
    return await question_controller.get_proposal(request=request, current_user=current_user)

@question_router.get("/session")
async def get_session_data(
    current_user: User = Depends(get_current_active_user)
):
    """現在のセッションデータを取得"""
    return await question_controller.get_session_data(current_user=current_user)

@question_router.post("/reset")
async def reset_session(
    current_user: User = Depends(get_current_active_user)
):
    """セッションをリセット"""
    return await question_controller.reset_session(current_user=current_user)
