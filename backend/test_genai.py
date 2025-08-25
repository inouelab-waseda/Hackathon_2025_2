from google import genai

# 質問を定義
q1 = "今の自分を変化させたいと感じる時、まず「見た目」から変えたいと思いますか？"
q2 = "その自分磨きは、仕事や将来のキャリアに直接役立てたいですか？"
q3 = "体を動かして汗を流すことに、ポジティブな気持ちや達成感を感じますか？"
q4 = "目標達成のために、毎日コツコツと時間をかけるのは得意な方ですか？"
q5 = "目に見える「形」や「成果」（点数、資格、体重の変化など）がわかる方が、モチベーションを維持しやすいですか？"

# 回答例（実際はユーザー入力に置き換えてください）
a1 = "はい"
a2 = "いいえ"
a3 = "わからない"
a4 = "はい"
a5 = "いいえ"

# プロンプトを作成
prompt = f"""
あなたは自分磨きのアドバイザーです。
以下の質問と回答を参考に、回答者に最適な自分磨きの内容を100文字以内で提案してください。

質問1: {q1}
回答1: {a1}
質問2: {q2}
回答2: {a2}
質問3: {q3}
回答3: {a3}
質問4: {q4}
回答4: {a4}
質問5: {q5}
回答5: {a5}
"""


# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client(api_key="")

response = client.models.generate_content(
    model="gemini-2.5-flash", contents=prompt
)
print(response.text)