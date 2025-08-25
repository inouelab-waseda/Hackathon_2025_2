from dotenv import load_dotenv
import os
from google import genai

class genai():
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=self.api_key)

    def propose(self):
        load_dotenv()  # .envファイルを読み込む

        questions = []
        answers = []
        num_questions = 5

        # 最初の質問をAPIに生成させる
        prompt = """回答者に最適な自分磨き(読書・運動・美容など)を提案するために必要な質問を1つ出してください。「はい」「いいえ」「わからない」で答えられるものにしてください。また質問文のみを出力してください。"""
        for i in range(num_questions):
            # 質問生成
            question_time = f"質問は上限{num_questions}で、次に出力する質問は{i+1}回目です。"
            response = self.client.models.generate_content(
                model="gemini-2.5-flash", contents=prompt+question_time
            )
            question = response.text.strip()
            questions.append(question)
            print(f"質問{i+1}: {question}")

            # 回答（ここでは例として「はい」「いいえ」「わからない」を順番に使用）
            answer = ["はい", "いいえ", "わからない"][i % 3]
            answers.append(answer)
            print(f"回答{i+1}: {answer}\n")

            # 次の質問生成用プロンプト
            prompt = f"前回の質問: {question}\n回答: {answer}\n次に、最適な自分磨き(読書・運動・美容など)を提案するために必要な質問を1つ出してください。「はい」「いいえ」「わからない」で答えられるものにしてください。また質問文のみを出力してください。"

        # 最適な自分磨き提案をAPIに依頼
        summary_prompt = "あなたは自分磨きのアドバイザーです。以下の質問と回答を参考に、回答者に最適な自分磨き(読書・運動・美容など)の内容を100文字以内で提案してください。\n"
        for i in range(5):
            summary_prompt += f"質問{i+1}: {questions[i]}\n回答{i+1}: {answers[i]}\n"

        response = self.client.models.generate_content(
            model="gemini-2.5-flash", contents=summary_prompt
        )
        print("\n最適な自分磨き提案:")
        print(response.text.strip())