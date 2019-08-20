const projects = [];

module.exports = {

    findAll(request, response) {
        return response.json(projects);
    },

    findById(request, response) {
        const { id } = request.params;

        const project = projects.find(prj => prj.id === id);
        if (!project) {
            return response.status(404).send(`Project with id ${id} was not found.`);
        }

        return response.json(project);
    },

    create(request, response) {
        const project = request.body;

        if (projects.find(prj => prj.id === project.id)) {
            return response.status(422).send(`Project with the id ${project.id} already exists.`);
        }

        projects.push(project);

        return response.status(201).json(project);
    },

    updateTitle(request, response) {
        const { id } = request.params;
        const { title } = request.body;

        const project = projects.find(prj => prj.id === id);
        if (!project) {
            return response.status(404).send(`Project with id ${id} was not found.`);
        }

        project.title = title;
        return response.json(project);
    },

    remove(request, response) {
        const { id } = request.params;

        const index = projects.findIndex(prj => prj.id === id);
        if (index !== -1) {
            projects.splice(index, 1);
        }

        return response.send();
    }
}
