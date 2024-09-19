import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  Fab,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useSWR from "swr";
import { useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import QuestionsPage from "./pages/QuestionsPage";
import PostPage from "./pages/PostPage";
interface Answer {
  id: number;
  questionId: number;
  description: string;
  isBest: boolean;
  createdAt: string;
}
interface Question {
  id: number;
  title: string;
  description: string;
  status: boolean;
  createdAt: string;
  answers: Answer[];
  answerCounts: number;
}

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
