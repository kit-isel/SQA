import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import {
  AppBar,
  Box,
  Button,
  Fab,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import QuestionList from "../components/QuestionList";
import FilterBox, { FilterConfig } from "../components/FilterBox";
import QuestionsPagination from "../components/QuestionsPagination";
import useQuestions from "../hooks/useQuestions";
import QuestionContent from "../components/QuestionContent";

const HEADER_HEIGHT = "64px";

function QuestionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    sort: searchParams.get("sort") || "newest",
    pagesize: parseInt(searchParams.get("pagesize") || "15"),
    noanswers: searchParams.get("filters") === "noanswers",
  });

  const { questions, pagination, isLoading } = useQuestions(
    searchParams.get("sort"),
    searchParams.get("page"),
    searchParams.get("pagesize"),
    searchParams.get("filters")
  );

  useEffect(() => {
    if (questions && questions.length > 0) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(null);
    }
  }, [questions]);

  const handlePageChange = (page: number) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set("page", page.toString());
      return prev;
    });
  };
  const handleFilterApply = () => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set("page", "1");
      prev.set("sort", filterConfig.sort);
      prev.set("pagesize", filterConfig.pagesize.toString());
      prev.set("filters", filterConfig.noanswers ? "noanswers" : "");
      return prev;
    });
  };
  return (
    <Stack height={`calc(100vh - ${HEADER_HEIGHT})`}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            学生質問箱
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<EditIcon />}
            component={Link}
            to="/questions/post"
          >
            質問する
          </Button>
        </Toolbar>
      </AppBar>
      <Stack direction="row" height="100%">
        <Stack
          direction="column"
          sx={{
            width: "40%",
            height: "100%",
            overflow: "hidden",
            flexShrink: 0,
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          <FilterBox
            config={filterConfig}
            onConfigChange={setFilterConfig}
            onApply={handleFilterApply}
          />
          <Box overflow="scroll">
            <Stack direction="column" alignItems="center" spacing="8px">
              <QuestionsPagination
                page={pagination?.currentPage}
                totalPages={pagination?.totalPages}
                onChange={handlePageChange}
              />
              <QuestionList
                questions={questions || []}
                selectedIndex={selectedIndex}
                onSelectedIndexChange={setSelectedIndex}
                isLoading={isLoading}
              />
              <QuestionsPagination
                page={pagination?.currentPage}
                totalPages={pagination?.totalPages}
                onChange={handlePageChange}
              />
            </Stack>
          </Box>
        </Stack>
        {questions && selectedIndex !== null && (
          <Box
            sx={{
              height: `calc(100% - ${HEADER_HEIGHT})`,
              overflow: "scroll",
              flexGrow: 1,
              bgcolor: "background.default",
              p: 3,
              position: "relative",
            }}
          >
            <QuestionContent
              question={questions[selectedIndex]}
              isLoading={isLoading}
            />
            <Fab
              color="primary"
              sx={{ position: "sticky", bottom: 0, left: 0 }}
              href={`/questions/${questions[selectedIndex].id}`}
            >
              <CommentIcon />
            </Fab>
          </Box>
        )}
      </Stack>
    </Stack>
  );
}

export default QuestionsPage;
