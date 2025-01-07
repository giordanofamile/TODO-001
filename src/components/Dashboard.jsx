import React, { useState, useEffect } from 'react';
    import { v4 as uuidv4 } from 'uuid';
    import {
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
      CardContent,
      IconButton,
      Select,
      MenuItem,
      Chip,
      Input,
      FormControl,
      InputLabel,
      LinearProgress
    } from '@mui/material';
    import DeleteIcon from '@mui/icons-material/Delete';
    import AddIcon from '@mui/icons-material/Add';
    import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
    import CategoryIcon from '@mui/icons-material/Category';
    
    function Dashboard() {
      const [projects, setProjects] = useState([]);
      const [openTaskDialog, setOpenTaskDialog] = useState(false);
      const [newTask, setNewTask] = useState({
        name: '',
        category: '',
        tags: [],
        completed: false,
        subtasks: [],
        progress: 0,
        attachments: [],
      });
      const [categories, setCategories] = useState(['Personal', 'Work', 'Shopping']);
      const [newCategory, setNewCategory] = useState('');
      const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
      const [selectedTask, setSelectedTask] = useState(null);
      const [openSubtaskDialog, setOpenSubtaskDialog] = useState(false);
      const [newSubtask, setNewSubtask] = useState({ name: '', tags: [] });
    
      useEffect(() => {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
        }
      }, []);
    
      useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects));
      }, [projects]);
    
      const handleOpenTaskDialog = () => {
        setOpenTaskDialog(true);
      };
    
      const handleCloseTaskDialog = () => {
        setOpenTaskDialog(false);
        setNewTask({
          name: '',
          category: '',
          tags: [],
          completed: false,
          subtasks: [],
          progress: 0,
          attachments: [],
        });
      };
    
      const handleAddTask = () => {
        if (newTask.name.trim() !== '') {
          const updatedProjects = projects.map((project) => {
            if (project.name === 'Dashboard') {
              return {
                ...project,
                tasks: [...(project.tasks || []), { ...newTask, id: uuidv4() }],
              };
            }
            return project;
          });
          setProjects(
            updatedProjects.find((project) => project.name === 'Dashboard')
              ? updatedProjects
              : [...updatedProjects, { name: 'Dashboard', tasks: [{ ...newTask, id: uuidv4() }] }],
          );
          handleCloseTaskDialog();
        }
      };
    
      const handleDeleteTask = (taskId) => {
        const updatedProjects = projects.map((project) => {
          if (project.name === 'Dashboard') {
            return {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            };
          }
          return project;
        });
        setProjects(updatedProjects);
      };
    
      const handleToggleComplete = (taskId) => {
        const updatedProjects = projects.map((project) => {
          if (project.name === 'Dashboard') {
            return {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task,
              ),
            };
          }
          return project;
        });
        setProjects(updatedProjects);
      };
    
      const handleOpenCategoryDialog = () => {
        setOpenCategoryDialog(true);
      };
    
      const handleCloseCategoryDialog = () => {
        setOpenCategoryDialog(false);
        setNewCategory('');
      };
    
      const handleAddCategory = () => {
        if (newCategory.trim() !== '') {
          setCategories([...categories, newCategory]);
          handleCloseCategoryDialog();
        }
      };
    
      const handleTagChange = (event) => {
        const value = event.target.value;
        setNewTask({ ...newTask, tags: value.split(',').map((tag) => tag.trim()) });
      };
    
      const getTagColor = (tag) => {
        const colors = [
          '#FF5733',
          '#33FF57',
          '#5733FF',
          '#FF33A1',
          '#33A1FF',
          '#A1FF33',
        ];
        let hash = 0;
        for (let i = 0; i < tag.length; i++) {
          hash = tag.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        return colors[index];
      };
    
      const currentTasks =
        projects.find((project) => project.name === 'Dashboard')?.tasks || [];
    
      const openTasksCount = currentTasks.filter((task) => !task.completed).length;
      const completedTasksCount = currentTasks.filter((task) => task.completed).length;
    
      const handleOpenSubtaskDialog = (task) => {
        setSelectedTask(task);
        setOpenSubtaskDialog(true);
      };
    
      const handleCloseSubtaskDialog = () => {
        setOpenSubtaskDialog(false);
        setNewSubtask({ name: '', tags: [] });
        setSelectedTask(null);
      };
    
      const handleAddSubtask = () => {
        if (newSubtask.name.trim() !== '' && selectedTask) {
          const updatedProjects = projects.map((project) => {
            if (project.name === 'Dashboard') {
              return {
                ...project,
                tasks: project.tasks.map((task) =>
                  task.id === selectedTask.id
                    ? {
                        ...task,
                        subtasks: [...task.subtasks, { ...newSubtask, id: uuidv4() }],
                      }
                    : task,
                ),
              };
            }
            return project;
          });
          setProjects(updatedProjects);
          handleCloseSubtaskDialog();
        }
      };
    
      const handleSubtaskTagChange = (event) => {
        const value = event.target.value;
        setNewSubtask({ ...newSubtask, tags: value.split(',').map((tag) => tag.trim()) });
      };
    
      return (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h2">
              Dashboard
            </Typography>
            <Box>
              <IconButton color="primary" onClick={handleOpenCategoryDialog}>
                <CategoryIcon />
              </IconButton>
              <IconButton color="primary" onClick={handleOpenTaskDialog}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
          <Box mb={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Categories
            </Typography>
            <Box display="flex" flexWrap="wrap">
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  style={{ margin: '4px' }}
                />
              ))}
            </Box>
          </Box>
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Open Tasks</Typography>
                  <Typography variant="h4">{openTasksCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Completed Tasks</Typography>
                  <Typography variant="h4">{completedTasksCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Typography variant="h6" component="h3" gutterBottom>
            Current Tasks
          </Typography>
          <Grid container spacing={2}>
            {currentTasks.map((task) => (
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
                    <Box mt={1}>
                      {task.tags &&
                        task.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            style={{
                              backgroundColor: getTagColor(tag),
                              color: 'white',
                              margin: '2px',
                            }}
                          />
                        ))}
                    </Box>
                    <Box mt={1}>
                      <LinearProgress variant="determinate" value={task.progress} />
                    </Box>
                    <Box mt={1} display="flex" justifyContent="flex-end">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenSubtaskDialog(task)}
                      >
                        <PlaylistAddCheckIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Dialog open={openTaskDialog} onClose={handleCloseTaskDialog}>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Task Name"
                type="text"
                fullWidth
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={newTask.category}
                  label="Category"
                  onChange={(e) =>
                    setNewTask({ ...newTask, category: e.target.value })
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel htmlFor="tags-input">Tags (comma separated)</InputLabel>
                <Input
                  id="tags-input"
                  value={newTask.tags.join(', ')}
                  onChange={handleTagChange}
                />
              </FormControl>
              <TextField
                margin="dense"
                label="Progress (0-100)"
                type="number"
                fullWidth
                value={newTask.progress}
                onChange={(e) =>
                  setNewTask({ ...newTask, progress: parseInt(e.target.value, 10) })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseTaskDialog}>Cancel</Button>
              <Button onClick={handleAddTask} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog}>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Category Name"
                type="text"
                fullWidth
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCategoryDialog}>Cancel</Button>
              <Button onClick={handleAddCategory} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openSubtaskDialog} onClose={handleCloseSubtaskDialog}>
            <DialogTitle>Add New Subtask</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Subtask Name"
                type="text"
                fullWidth
                value={newSubtask.name}
                onChange={(e) => setNewSubtask({ ...newSubtask, name: e.target.value })}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel htmlFor="subtask-tags-input">
                  Tags (comma separated)
                </InputLabel>
                <Input
                  id="subtask-tags-input"
                  value={newSubtask.tags.join(', ')}
                  onChange={handleSubtaskTagChange}
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSubtaskDialog}>Cancel</Button>
              <Button onClick={handleAddSubtask} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      );
    }
    
    export default Dashboard;
