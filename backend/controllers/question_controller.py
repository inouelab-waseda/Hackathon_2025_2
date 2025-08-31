from fastapi import HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import QuestionRequest, QuestionResponse, AnswerRequest, AnswerResponse, ProposalRequest, ProposalResponse, User
from services.question_service import QuestionService
from services.auth_service import get_current_active_user


class QuestionController:
    def __init__(self):
        self.question_service = QuestionService()
        # セッション管理用の辞書（実際の運用ではRedisなどを使用することを推奨）
        self.genai_sessions = {}
    
    def get_genai_service(self, user_id: int) -> QuestionService:
        """ユーザー固有のQuestionServiceインスタンスを取得"""
        if user_id not in self.genai_sessions:
            self.genai_sessions[user_id] = QuestionService()
        return self.genai_sessions[user_id]
    
    async def get_question(
        self,
        request: QuestionRequest,
        current_user: User = Depends(get_current_active_user)
    ) -> QuestionResponse:
        """新しい質問を取得"""
        try:
            genai_service = self.get_genai_service(current_user.id)
            question = genai_service.get_question(
                current_num=request.current_num,
                num_questions=request.num_questions
            )
            return QuestionResponse(
                question=question,
                current_num=request.current_num + 1,
                total_questions=request.num_questions
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"質問の生成に失敗しました: {str(e)}")
    
    async def save_answer(
        self,
        request: AnswerRequest,
        current_user: User = Depends(get_current_active_user)
    ) -> AnswerResponse:
        """回答を保存"""
        try:
            genai_service = self.get_genai_service(current_user.id)
            genai_service.save_answer(
                answer=request.answer,
                current_num=request.current_num
            )
            return AnswerResponse(
                message="回答が正常に保存されました",
                current_num=request.current_num + 1
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"回答の保存に失敗しました: {str(e)}")
    
    async def get_proposal(
        self,
        request: ProposalRequest,
        current_user: User = Depends(get_current_active_user)
    ) -> ProposalResponse:
        """自分磨きの提案を取得"""
        try:
            genai_service = self.get_genai_service(current_user.id)
            proposal = genai_service.get_proposal()
            return ProposalResponse(proposal=proposal)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"提案の生成に失敗しました: {str(e)}")
    
    async def get_session_data(
        self,
        current_user: User = Depends(get_current_active_user)
    ) -> dict:
        """現在のセッションデータを取得"""
        try:
            genai_service = self.get_genai_service(current_user.id)
            return genai_service.get_session_data()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"セッションデータの取得に失敗しました: {str(e)}")
    
    async def reset_session(
        self,
        current_user: User = Depends(get_current_active_user)
    ) -> dict:
        """セッションをリセット"""
        try:
            genai_service = self.get_genai_service(current_user.id)
            genai_service.reset_session()
            return {"message": "セッションが正常にリセットされました"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"セッションのリセットに失敗しました: {str(e)}")
