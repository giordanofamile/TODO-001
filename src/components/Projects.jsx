import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { v4 as uuidv4 } from 'uuid';
    import {
      List,
      ListItem,
      ListItemText,
      IconButton,
      TextField,
      Button,
      Dialog,
      DialogTitle,
      DialogContent,
      DialogActions,
      Box,
      Typography
    } from '@mui/material';
    import DeleteIcon from '@mui/icons-material/Delete';
    import AddIcon from '@mui/icons-material/Add';
    
    function Projects() {
      const [projects, setProjects] = useState([]);
      const [openDialog, setOpenDialog] = useState(false);
      const [newProjectName, setNewProjectName] = useState('');
    
      useEffect(() => {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
        }
      }, []);
    
      useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects));
      }, [projects]);
    
      const handleOpenDialog = () => {
        setOpenDialog(true);
      };
    
      const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewProjectName('');
      };
    
      const handleAddProject = () => {
        if (newProjectName.trim() !== '') {
          const newProject = { id: uuidv4(), name: newProjectName, tasks: [] };
          setProjects([...projects, newProject]);
          handleCloseDialog();
        }
      };
    
      const handleDeleteProject = (id) => {
        setProjects(projects.filter((project) => project.id !== id));
      };
    
      return (
        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            Projects
          </Typography>
          <List>
            {projects.map((project) => (
              <ListItem
                key={project.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText>
                  <Link to={`/project/${project.id}`}>{project.name}</Link>
                </ListItemText>
              </ListItem>
            ))}
          </List>
          <IconButton color="primary" onClick={handleOpenDialog}>
            <AddIcon />
          </IconButton>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Project Name"
                type="text"
                fullWidth
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleAddProject} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      );
    }
    
    export default Projects;
