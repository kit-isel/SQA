import { BrowserRouter, Route, Routes } from "react-router-dom";

import QuestionsPage from "./pages/QuestionsPage";
import PostPage from "./pages/PostPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import { createTheme, CssBaseline, useMediaQuery } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { useMemo } from "react";
import { blueGrey, grey } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Palette {
    mode: "light" | "dark";
  }
  interface PaletteOptions {
    mode?: "light" | "dark";
  }
}

function App() {
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          // mode: isDarkMode ? "dark" : "light",
          mode: "light",
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<QuestionsPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/questions/post" element={<PostPage />} />
          <Route path="/questions/:id" element={<QuestionDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
