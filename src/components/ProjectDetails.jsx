import React, { useState, useEffect } from 'react';
    import { useParams, Link } from 'react-router-dom';
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
      Typography,
      Checkbox,
      FormControlLabel,
      Grid,
      Card,
      CardContent
    } from '@mui/material';
    import DeleteIcon from '@mui/icons-material/Delete';
    import AddIcon from '@mui/icons-material/Add';
    
    function ProjectDetails() {
      const { projectId } = useParams();
      const [project, setProject] = useState(null);
      const [openTaskDialog, setOpenTaskDialog] = useState(false);
      const [newTaskName, setNewTaskName] = useState('');
    
      useEffect(() => {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          const foundProject = projects.find((p) => p.id === projectId);
          setProject(foundProject);
        }
      }, [projectId]);
    
      useEffect(() => {
        if (project) {
          const storedProjects = localStorage.getItem('projects');
          if (storedProjects) {
            const projects = JSON.parse(storedProjects);
            const updatedProjects = projects.map((p) =>
              p.id === project.id ? project : p,
            );
            localStorage.setItem('projects', JSON.stringify(updatedProjects));
          }
        }
      }, [project]);
    
      const handleOpenTaskDialog = () => {
        setOpenTaskDialog(true);
      };
    
      const handleCloseTaskDialog = () => {
        setOpenTaskDialog(false);
        setNewTaskName('');
      };
    
      const handleAddTask = () => {
        if (newTaskName.trim() !== '') {
          const newTask = { id: uuidv4(), name: newTaskName, completed: false, subtasks: [] };
          setProject({ ...project, tasks: [...(project?.tasks || []), newTask] });
          handleCloseTaskDialog();
        }
      };
    
      const handleDeleteTask = (taskId) => {
        const updatedTasks = project.tasks.filter((task) => task.id !== taskId);
        setProject({ ...project, tasks: updatedTasks });
      };
    
      const handleToggleComplete = (taskId) => {
        const updatedTasks = project.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        );
        setProject({ ...project, tasks: updatedTasks });
      };
    
      const handleOpenSubtaskDialog = (taskId) => {
        // Implement subtask dialog logic here
      };
    
      return (
        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            Project Details
          </Typography>
          {project ? (
            <Box>
              <Typography variant="h5" component="h3" gutterBottom>
                {project.name}
              </Typography>
              <Typography variant="h6" component="h4" gutterBottom>
                Tasks
              </Typography>
              <Grid container spacing={2}>
                {project.tasks &&
                  project.tasks.map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                      <Card>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={task.completed}
                                  onChange={() => handleToggleComplete(task.id)}
                                  name="completed"
                                />
                              }
                              label={
                                <Typography
                                  style={{
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                  }}
                                >
                                  {task.name}
                                </Typography>
                              }
                            />
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenSubtaskDialog(task.id)}
                          >
                            <AddIcon />
                          </IconButton>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
              <IconButton color="primary" onClick={handleOpenTaskDialog}>
                <AddIcon />
              </IconButton>
              <Dialog open={openTaskDialog} onClose={handleCloseTaskDialog}>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Task Name"
                    type="text"
                    fullWidth
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseTaskDialog}>Cancel</Button>
                  <Button onClick={handleAddTask} color="primary">
                    Add
                  </Button>
                </DialogActions>
              </Dialog>
              <Button component={Link} to="/">
                Back to Projects
              </Button>
            </Box>
          ) : (
            <Typography>Loading project details...</Typography>
          )}
        </Box>
      );
    }
    
    export default ProjectDetails;
