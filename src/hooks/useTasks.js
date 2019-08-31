import { useState, useEffect } from 'react';
import moment from 'moment';

import { firebase } from '../firebase';

import { collatedTasksExist } from '../helpers'

export const useTasks = selectedProject => {
    const [tasks, setTasks] = useState([]);
    const [archivedTasks, setArchivedTasks] = useState([]);

    useEffect(() => {

        // get the tasks for the selected project from firebase
        // todo: refactor
        let unsubscribe = firebase
        .firestore()
        .collection('tasks')
        .where('userId', '==', 'lgyxSuremlAiuh');

        // getting data from firebase
        unsubscribe = selectedProject && !collatedTasksExist(selectedProject)
        ? (unsubscribe = unsubscribe.where('projectId', '==', selectedProject))
        : selectedProject === 'TODAY'
            ? (unsubscribe = unsubscribe.where(
            'date',
            '==',
            moment.format('DD/MM/YYYY')
            ))
            : selectedProject === 'INBOX' || selectedProject === 0
                ? (unsubscribe = unsubscribe.where('date', '==', ''))
                : unsubscribe;
        
        // extracting tasks from snapshot and setting in state
        unsubscribe = unsubscribe.onSnapshot(snapshot => {
            const newTasks = snapshot.docs.map(task => ({
                id: task.id,
                ...task.data(),
            }));

            // filtering and setting tasks state
            setTasks(
                selectedProject === 'NEXT_7'
                ? newTasks.filter(
                    task => moment(task.date, 'DD-MM-YYYY').diff(moment(), 'days') <= 7
                    &&
                    task.archived !== true
                )
                : newTasks.filter(task => task.archived !== true)
            );
            
            setArchivedTasks(newTasks.filter(task => task.archived === true));
        });

        // cleanup at the end
        return () => unsubscribe();

    }, [selectedProject]);

    return { tasks, archivedTasks };
}