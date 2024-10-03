import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";

interface AnswerFormState {
  description: string | undefined;
  error: boolean;
  helperText: string;
}

interface AnswerFormProps {
  onSend: (description: string) => void;
}

export default function AnswerForm({ onSend }: AnswerFormProps) {
  const [state, setState] = useState<AnswerFormState>({
    description: undefined,
    error: false,
    helperText: " ",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    const trimmedDescription = description.trim();
    if (trimmedDescription === "") {
      setState({
        description: description,
        error: true,
        helperText: "返信内容を入力してください",
      });
    } else if (trimmedDescription.length < 10) {
      setState({
        description: description,
        error: true,
        helperText: "返信内容は10文字以上で入力してください",
      });
    } else if (trimmedDescription.length > 1000) {
      setState({
        description: description,
        error: true,
        helperText: "返信内容は1000文字以内で入力してください",
      });
    } else {
      setState({
        description: description,
        error: false,
        helperText: " ",
      });
    }
  };

  return (
    <Stack direction="column" sx={{ m: "1.5rem" }} spacing="2rem">
      <Typography variant="h5" sx={{ mb: 2 }}>
        返信
      </Typography>
      <TextField
        required
        error={state.error}
        helperText={state.helperText}
        label="返信内容"
        multiline
        fullWidth
        minRows={10}
        rows={undefined}
        value={state.description}
        onChange={handleFormChange}
      />

      <Button
        variant="contained"
        endIcon={<SendIcon />}
        disabled={state.error || state.description === undefined}
        onClick={() => onSend(state.description || "")}
        sx={{
          fontSize: "1em",
          alignSelf: "flex-end",
          position: "relative",
          left: "-5%",
        }}
      >
        投稿する
      </Button>
    </Stack>
  );
}
