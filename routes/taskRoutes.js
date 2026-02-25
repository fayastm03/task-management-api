const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Task = require('../models/Task'); 

router.get('/test', auth, async (req, res) => {
    res.json({
        message: 'Task route is working' ,
        user: req.user,
    })
});

router.post('/',auth ,async (req,res) => {
    try{
        const newTask = new Task({
            ...req.body,
            owner: req.user._id
        });

        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
     }catch(error){
        res.status(500).json({ message: 'Error creating task', error: error.message });
     }
});

router.get('/', auth ,async(req,res)=>{
    try{
        const tasks = await Task.find({ owner: req.user._id });
        res.status(200).json({ tasks, count: tasks.length ,message : 'Tasks retrieved successfully'});
    }catch(error){
        res.status(500).json({ message: 'Error in retrieving tasks', error: error.message });
    }
});

 router.get('/:id',auth , async(req,res)=>{
    const taskId = req.params.id;
    try{
        const task = await Task.findOne({
            _id: taskId,
            owner: req.user._id
        });
        if(!task){
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ task, message: 'Task retrieved successfully' });
    }catch(error){
        res.status(500).json({ message: 'Error in retrieving task', error: error.message });
    }

 });

 router.patch('/:id', auth ,async(req,res)=>{

    const taskId = req.params.id;
    try{
        const task = await Task.findOne(
            {
                _id: taskId,
                owner: req.user._id
            }
        );
        if(!task){
            return res.status(404).json({ message: 'Task not found' });
        }
        const updates = Object.keys(req.body);
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.status(200).json({ task: task, message: 'Task updated successfully' });
    }catch(error){
        res.status(500).json({ message: 'Error in updating task', error: error.message });
    }
 });

router.delete('/:id', auth ,async(req,res)=>{
    const taskId = req.params.id;
    try{
        const task = await Task.findOneAndDelete({
            _id: taskId,
            owner: req.user._id
        });
        if(!task){
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    }catch(error){
        res.status(500).json({ message: 'Error in deleting task', error: error.message });
    }
});


module.exports = router;  