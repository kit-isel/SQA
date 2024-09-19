import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

const HEADER_HEIGHT = "64px";

// Post Question Page
function PostPage() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            学生質問箱
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default PostPage;
