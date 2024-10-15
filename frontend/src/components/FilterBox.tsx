import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  SxProps,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface FilterBoxProps {
  config: FilterConfig;
  onConfigChange: (config: FilterConfig) => void;
  onApply: () => void;
  sx?: SxProps;
}

export interface FilterConfig {
  sort: string;
  pagesize: number;
  noanswers: boolean;
}

export default function FilterBox({
  config,
  onConfigChange,
  onApply,
  sx,
}: FilterBoxProps) {
  return (
    <Accordion disableGutters sx={sx} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{ display: { xs: "flex", sm: "none" } }}
      >
        <Typography>ソート・フィルター</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl>
          <FormLabel id="created-at-radio-group-label">ソート</FormLabel>
          <RadioGroup
            aria-labelledby="created-at-radio-group-label"
            defaultValue="newest"
            name="created-at-radio-button-group"
            value={config.sort}
            onChange={(event) =>
              onConfigChange({ ...config, sort: event.target.value })
            }
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
              control={
                <Checkbox
                  checked={config.noanswers}
                  onChange={(event) => {
                    onConfigChange({
                      ...config,
                      noanswers: event.target.checked,
                    });
                  }}
                />
              }
              label="未回答"
            />
          </FormGroup>
        </FormControl>
        <Typography>表示件数</Typography>
        <ToggleButtonGroup
          value={config.pagesize}
          exclusive
          color="primary"
          onChange={(_, value) =>
            onConfigChange({ ...config, pagesize: value })
          }
          fullWidth
        >
          <ToggleButton value={5}>5</ToggleButton>
          <ToggleButton value={15}>15</ToggleButton>
          <ToggleButton value={30}>30</ToggleButton>
          <ToggleButton value={50}>50</ToggleButton>
        </ToggleButtonGroup>
        <Button onClick={onApply}>適用</Button>
      </AccordionDetails>
    </Accordion>
  );
}
