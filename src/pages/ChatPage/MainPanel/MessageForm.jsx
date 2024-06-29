import { useState } from "react";

const MessageForm = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <form>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-24 border-2 rounded-md"
        />
        <div>
          <div className="flex flex-row gap-2.5 my-2">
            <button
              type="submit"
              className="flex flex-1 p-2.5 rounded-md text-white bg-cyan-800 hover:bg-cyan-600 text-center items-center justify-center"
              disabled={loading}
            >
              이미지
            </button>
            <button
              type="submit"
              className="flex flex-1 p-2.5 rounded-md text-white bg-cyan-800 hover:bg-cyan-600 text-center items-center justify-center"
              disabled={loading}
            >
              메시지 전송
            </button>
          </div>
        </div>
      </form>
      <input type="file" accept="image/jpeg, image/png" className="hidden" />
    </div>
  );
};

export default MessageForm;
