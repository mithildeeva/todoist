
import { useState, useEffect } from 'react';

import { firebase } from '../firebase';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        firebase
        .firestore()
        .collection('projects')
        .where('userId', '==', 'lgyxSuremlAiuh')
        .orderBy('projectId')
        .get()
        .then(snapshot => {
            const allProjects = snapshot.docs.map(project => ({
                ...project.data(),
                docId: project.id,
            }));

            // to prevent infinite loop
            // conditionally setting projects in state
            // cz projects in dependency and in state

            // setState will trigger useEffect will trigger setState will trigger useEffect will tr..
            if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
                setProjects(allProjects);
            }
        })

    }, [projects]);

    return { projects, setProjects };
}