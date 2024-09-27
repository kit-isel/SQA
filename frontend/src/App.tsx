import { BrowserRouter, Route, Routes } from "react-router-dom";

import QuestionsPage from "./pages/QuestionsPage";
import PostPage from "./pages/PostPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuestionsPage />} />
        <Route path="/questions/post" element={<PostPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
