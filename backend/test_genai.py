from dotenv import load_dotenv
import os
from google import genai

class Genai():
    def __init__(self, current_num=0, num_questions=5):
        load_dotenv()  # .envファイルを読み込む
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=self.api_key)
        self.current_num = current_num
        self.num_questions = num_questions
        self.char_code = 'utf-8'
        
        self.q_path = "question.txt"
        self.ans_path = "answer.txt"

    #前回の質問・回答を踏まえて新たな質問を考える
    def question(self):
        
        #2回目以降の質問ではこれまでの質問・回答を取得
        questions = []
        answers = []
        if(self.current_num>0):
            with open(self.q_path, encoding=self.char_code) as f:
                questions = [line.strip() for line in f.readlines()]
            with open(self.ans_path, encoding=self.char_code) as f:
                answers = [line.strip() for line in f.readlines()]
        #初回時は過去に書き込まれたテキストファイルを初期化
        else:
            with open(self.q_path, mode='w', encoding=self.char_code) as f:
                f.write("")
            with open(self.ans_path, mode='w', encoding=self.char_code) as f:
                f.write("")
        
        prompt =""
        if(len(questions)>0):
            prompt +=f"前回の質問は「{questions[-1]}」で、回答は{answers[-1]}です。\n"

        # 質問をAPIに生成させる
        prompt += """回答者に最適な自分磨き(読書・運動・美容など)を提案するために必要な質問を1つ出してください。
                    質問は「はい」「いいえ」「わからない」で答えられるものにしてください。また質問文のみを出力してください。"""
        # 質問生成
        question_time = f"質問は上限{self.num_questions}で、次に出力する質問は{self.current_num+1}回目です。"
        response = self.client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt+question_time
        )
        question = response.text.strip()
        #print(f"質問{self.current_num+1}: {question}")
        with open(self.q_path, mode='a', encoding=self.char_code) as f:
            if(self.current_num>0):
                f.write("\n")
            f.write(question)

    #回答を記録する
    def answer(self, answer):
        with open(self.ans_path, mode='a', encoding=self.char_code) as f:
            if(self.current_num>0):
                f.write("\n")
            f.write(answer)

    #これまでの質問・回答をまとめて送信して、自分磨きを提案する
    def propose(self):
        questions = []
        answers = []
        with open(self.q_path, encoding=self.char_code) as f:
            questions = [line.strip() for line in f.readlines()]
        with open(self.ans_path, encoding=self.char_code) as f:
            answers = [line.strip() for line in f.readlines()]
        
        # 最適な自分磨き提案をAPIに依頼
        summary_prompt = "あなたは自分磨きのアドバイザーです。以下の質問と回答を参考に、回答者に最適な自分磨き(読書・運動・美容など)の内容を100文字以内で提案してください。\n"
        for i in range(len(questions)):
            summary_prompt += f"質問{i+1}: {questions[i]}\n回答{i+1}: {answers[i]}\n"

        #デバッグ用
        #print(summary_prompt)
        
        response = self.client.models.generate_content(
            model="gemini-2.5-flash", contents=summary_prompt
        )
        print("\n最適な自分磨き提案:")
        print(response.text.strip())


#デバッグ用
#for i in range(5):
#    Gen = Genai(current_num=i)
#    Gen.question()
#    Gen.answer(answer=["はい", "いいえ", "わからない"][i % 3])

#Genai().propose()