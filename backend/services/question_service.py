from dotenv import load_dotenv
import os
from google import genai

class QuestionService:
    def __init__(self):
        load_dotenv()  # .envファイルを読み込む
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            raise ValueError("GEMINI_API_KEYが正しく設定されていません。環境変数GEMINI_API_KEYを設定してください。")
        self.client = genai.Client(api_key=self.api_key)
        self.char_code = 'utf-8'
        
        # メモリベースの保存に変更
        self.questions = []
        self.answers = []

    def reset_session(self):
        """セッションをリセット"""
        self.questions = []
        self.answers = []

    def get_question(self, current_num: int, num_questions: int = 5) -> str:
        """新しい質問を生成"""
        if current_num >= num_questions:
            raise ValueError("質問数の上限に達しました")
        
        # 質問の種類を定義
        question_types = [
            "読書習慣について",
            "運動習慣について", 
            "美容・健康について",
            "人間関係について",
            "目標設定について"
        ]
        
        # 現在の質問番号に基づいて質問タイプを選択
        question_type = question_types[current_num] if current_num < len(question_types) else "全般的な自己改善について"
        
        prompt = ""
        if len(self.questions) > 0 and len(self.answers) > 0:
            # 前回の回答を考慮した質問を生成
            prompt += f"これまでの質問と回答:\n"
            for i in range(len(self.questions)):
                if i < len(self.answers):
                    prompt += f"質問{i+1}: {self.questions[i]}\n回答{i+1}: {self.answers[i]}\n"
            prompt += f"\n前回の回答を踏まえて、次の質問を生成してください。\n"

        # 質問生成のプロンプト
        prompt += f"""あなたは自分磨きの専門家です。回答者に最適な自分磨きを提案するために、{question_type}に関する質問を1つ出してください。

質問の条件:
- 「はい」「いいえ」「わからない」で答えられるもの
- 具体的で分かりやすい内容
- 回答者の状況を把握するのに役立つ内容
- 質問文のみを出力（説明は不要）

現在は{current_num + 1}回目の質問です（全{num_questions}問）。"""
        
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash", contents=prompt
            )
            question = response.text.strip()
            
            # 質問が空でないことを確認
            if not question or len(question) < 10:
                # フォールバック質問
                fallback_questions = [
                    "あなたは毎日読書をしていますか？",
                    "週に3回以上運動をしていますか？",
                    "自分の外見や健康に気を使っていますか？",
                    "新しい人との出会いを積極的に求めていますか？",
                    "将来の目標を明確に持っていますか？"
                ]
                question = fallback_questions[current_num] if current_num < len(fallback_questions) else "自分をより良くしたいと思っていますか？"
            
        except Exception as e:
            # エラー時のフォールバック質問
            fallback_questions = [
                "あなたは毎日読書をしていますか？",
                "週に3回以上運動をしていますか？",
                "自分の外見や健康に気を使っていますか？",
                "新しい人との出会いを積極的に求めていますか？",
                "将来の目標を明確に持っていますか？"
            ]
            question = fallback_questions[current_num] if current_num < len(fallback_questions) else "自分をより良くしたいと思っていますか？"
        
        # 質問を保存
        self.questions.append(question)
        return question

    def save_answer(self, answer: str, current_num: int):
        """回答を保存"""
        if current_num != len(self.answers):
            raise ValueError("回答の順序が正しくありません")
        
        if current_num >= len(self.questions):
            raise ValueError("対応する質問が存在しません")
        
        self.answers.append(answer)

    def get_proposal(self) -> str:
        """自分磨きの提案を生成"""
        if len(self.questions) == 0:
            raise ValueError("質問がありません")
        
        if len(self.answers) == 0:
            raise ValueError("回答がありません")
        
        # 最適な自分磨き提案をAPIに依頼
        summary_prompt = """あなたは経験豊富な自分磨きのアドバイザーです。以下の質問と回答を参考に、回答者に最適な自分磨きの提案をしてください。

提案の条件:
- 具体的で実践可能な内容
- 回答者の状況に合わせた提案
- 読書、運動、美容、人間関係、目標設定などの分野を含む
- 100-150文字程度で簡潔に
- 励ましの言葉も含める

質問と回答:
"""
        for i in range(len(self.questions)):
            if i < len(self.answers):
                summary_prompt += f"質問{i+1}: {self.questions[i]}\n回答{i+1}: {self.answers[i]}\n"
            else:
                summary_prompt += f"質問{i+1}: {self.questions[i]}\n回答{i+1}: 未回答\n"
        
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash", contents=summary_prompt
            )
            return response.text.strip()
        except Exception as e:
            # エラー時のフォールバック提案
            return "あなたの回答を基に、読書習慣の改善、定期的な運動、健康的な生活習慣の確立をお勧めします。小さな一歩から始めて、継続することが大切です。応援しています！"

    def get_session_data(self):
        """現在のセッションデータを取得"""
        return {
            "questions": self.questions.copy(),
            "answers": self.answers.copy(),
            "current_num": len(self.questions)
        }
