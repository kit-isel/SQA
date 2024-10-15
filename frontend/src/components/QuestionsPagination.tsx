import { Pagination, SxProps } from "@mui/material";

interface QuestionsPaginationProps {
  page?: number;
  totalPages?: number;
  onChange: (page: number) => void;
  sx?: SxProps;
}

export default function QuestionsPagination({
  page,
  totalPages,
  onChange,
  sx,
}: QuestionsPaginationProps) {
  return (
    <Pagination
      count={totalPages || 1}
      color="primary"
      defaultPage={1}
      page={page || 1}
      onChange={(_, page) => onChange(page)}
      sx={sx}
    />
  );
}
