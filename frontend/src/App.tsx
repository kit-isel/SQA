import { BrowserRouter, Route, Routes } from "react-router-dom";

import QuestionsPage from "./pages/QuestionsPage";
import PostPage from "./pages/PostPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuestionsPage />} />
        <Route path="/questions/post" element={<PostPage />} />
        <Route path="/questions/:id" element={<QuestionDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
