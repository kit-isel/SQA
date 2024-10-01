import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface FilterBoxProps {
  sort: string;
  onSortChange: (sort: string) => void;
}

export default function FilterBox({ sort, onSortChange }: FilterBoxProps) {
  return (
    <Accordion disableGutters sx={{ width: "100%" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography>ソート・フィルター</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <FormControl>
            <FormLabel id="created-at-radio-group-label">ソート</FormLabel>
            <RadioGroup
              aria-labelledby="created-at-radio-group-label"
              defaultValue="newest"
              name="created-at-radio-button-group"
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
            >
              <FormControlLabel
                value="newest"
                control={<Radio />}
                label="Newest"
              />
              <FormControlLabel
                value="oldest"
                control={<Radio />}
                label="Oldest"
              />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel component="legend">フィルター</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="未回答"
              />
            </FormGroup>
          </FormControl>
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
