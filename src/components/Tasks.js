import React, { useEffect, useState } from 'react';

import { Checkbox } from './Checkbox';
import { useTasks } from '../hooks/useTasks';
import { collatedTasks } from '../constants';
import { getTitle, getCollatedTitle, collatedTasksExist } from '../helpers';
import { useSelectedProjectValue, useProjectsValue } from '../context';
import { AddTask } from './AddTask';

export const Tasks = () => {
    const { selectedProject } = useSelectedProjectValue();
    const { projects } = useProjectsValue();
    const { tasks } = useTasks(selectedProject);

    let projectName = '';

    if (projects && selectedProject && ! collatedTasksExist(selectedProject)) {
        console.log(projects, selectedProject);
        projectName = getTitle(projects, selectedProject).name;
    }

    if (collatedTasksExist(selectedProject) && selectedProject) {
        projectName = getCollatedTitle(collatedTasks, selectedProject).name;
    }

    useEffect(() => {
        document.title = `${projectName}: Todoist`;
    }, [projectName])

    return (
        <div className="tasks" data-testid="tasks">
            <h2 data-testid="project-name">{projectName}</h2>

            <ul className="tasks__list">
                {tasks.map(task => (
                    <li key={`${task.id}`}>
                        <Checkbox id={task.id} />
                        <span>{task.task}</span>
                    </li>
                ))}
            </ul>
            <AddTask />
        </div>
    );
}