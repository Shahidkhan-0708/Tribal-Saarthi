import React, { useState } from 'react';
import { Drawer, Box, IconButton, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, X as CloseIcon, ShieldAlert, Wallet, PieChart, Layers } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const NavigationShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems: NavItem[] = [
    { label: 'Dashboard', path: '/student', icon: <Layers size={20} /> },
    { label: 'Scheme Discovery', path: '/student/discovery', icon: <ShieldAlert size={20} /> },
    { label: 'DigiLocker Wallet', path: '/student/wallet', icon: <Wallet size={20} /> },
    { label: 'Gap Analytics', path: '/officer/coverage', icon: <PieChart size={20} /> },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isCurrent = (path: string) => {
    return location.pathname === path || (path !== '/student' && location.pathname.startsWith(path));
  };

  const drawerContent = (
    <Box className="h-full bg-slate-900 text-slate-200 flex flex-col justify-between">
      <Box>
        <Box className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <Typography variant="h6" className="font-bold tracking-tight text-amber-500">Adimool Portal</Typography>
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(false)} className="text-slate-400">
              <CloseIcon size={20} />
            </IconButton>
          )}
        </Box>
        <List className="px-3 py-4 space-y-1">
          {navigationItems.map((item) => {
            const active = isCurrent(item.path);
            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  className={`rounded-md transition-colors py-3 ${
                    active ? 'bg-slate-800 text-amber-400 font-semibold' : 'hover:bg-slate-800/60 text-slate-200'
                  }`}
                >
                  <Box className={`mr-4 ${active ? 'text-amber-400' : 'text-amber-500'}`}>{item.icon}</Box>
                  <ListItemText
                    primary={<span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box className="p-4 border-t border-slate-800 bg-slate-950">
        <Typography variant="caption" className="text-slate-500 block text-center font-mono">SIH 2026 Sandbox Build</Typography>
      </Box>
    </Box>
  );

  return (
    <Box className="flex min-h-screen bg-slate-50">
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar position="fixed" className="bg-slate-900 text-white shadow-none border-b border-slate-800">
          <Toolbar className="justify-between">
            <IconButton edge="start" onClick={() => setMobileOpen(true)} className="text-white mr-2">
              <MenuIcon size={24} />
            </IconButton>
            <Typography variant="h6" className="font-bold text-amber-500">Adimool Wallet</Typography>
            <Box className="w-6" /> {/* Balance layout anchor */}
          </Toolbar>
        </AppBar>
      )}

      {/* Responsive Drawer Layer */}
      <Box component="nav" sx={{ width: { md: 260 }, shrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }} // Better mobile performance
          sx={{
            '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-b', border: 'none' },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main App Workspace Canvas */}
      <Box component="main" className="flex-grow flex flex-col min-w-0" sx={{ pt: { xs: '64px', md: '0px' } }}>
        <Box className="p-4 sm:p-6 md:p-10 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
