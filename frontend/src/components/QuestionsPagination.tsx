import { Pagination } from "@mui/material";

interface QuestionsPaginationProps {
  page?: number;
  totalPages?: number;
  onChange: (page: number) => void;
}

export default function QuestionsPagination({
  page,
  totalPages,
  onChange,
}: QuestionsPaginationProps) {
  return (
    <Pagination
      count={totalPages || 1}
      color="primary"
      page={page || 1}
      onChange={(_, page) => onChange(page)}
      sx={{
        "& .MuiPaginationItem-root": {
          margin: "16px 0",
        },
      }}
    />
  );
}
