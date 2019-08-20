const projects = [];

module.exports = {

    findAll(request, response) {
        return response.json(projects);
    },

    findById(request, response) {
        const { id } = request.params;

        const project = projects.find(prj => prj.id === id);
        if (!project) {
            return response.status(404).send(`Project with id ${id} was not found.`)
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

    update(request, response) {
        const { id } = request.params;
        const project = request.body;
        project.id = id;

        const index = projects.findIndex(prj => prj.id === id);
        if (index == -1) {
            projects.push(project);
            return response.status(201).json(project);
        }

        projects[index] = project;
        return response.json(project);
    }
}
