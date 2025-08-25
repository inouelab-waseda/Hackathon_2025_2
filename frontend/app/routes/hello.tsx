import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react"; // useStateをインポート

// loader関数 (サーバーサイドでのみ実行される)
// この部分は変更ありません
export async function loader({ }: LoaderFunctionArgs)
{
    // 本番環境では localhost ではなく、実際のAPIサーバーのURLを指定してください
    const res = await fetch("http://localhost:8000/hello", {
        method: "GET",
    });

    // fetchが失敗した場合のエラーハンドリングを追加するとより堅牢になります
    if (!res.ok)
    {
        throw new Response("Failed to fetch data", { status: 500 });
    }

    const response: message = await res.json();
    return json(response);
}

export type message = {
    status: string;
    message: string;
};

export default function Hello()
{
    // loaderからデータを取得（ここまでは同じ）
    const data = useLoaderData<typeof loader>() as message;

    // メッセージの表示状態を管理するためのstateを定義
    // 初期値は false (非表示)
    const [isMessageVisible, setIsMessageVisible] = useState(false);

    // ボタンがクリックされたときに実行される関数
    const handleButtonClick = () =>
    {
        // isMessageVisibleを true に更新し、メッセージを表示状態にする
        setIsMessageVisible(true);
    };

    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
            <h1>RemixでHello!</h1>

            {/* ボタンを設置し、クリックイベントに handleButtonClick を割り当てる */}
            <button onClick={handleButtonClick} disabled={isMessageVisible}>
                メッセージを表示
            </button>

            {/* isMessageVisibleがtrueの時だけメッセージを表示する */}
            {isMessageVisible && data?.message && (
                <div style={{ marginTop: "20px" }}>
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>{data.message}</p>
                </div>
            )}
        </div>
    );
}