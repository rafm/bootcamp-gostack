const projects = [];

function _findById(id) {
    return projects.filter(project => project.id === id)[0] || null;
}

module.exports = {

    findAll(request, response) {
        return response.json(projects);
    },

    findById(request, response) {
        const { id } = request.params;

        const project = _findById(id);
        if (!project) {
            return response.status(404).send(`Project with id ${id} was not found.`)
        }

        return response.json(project);
    },

    create(request, response) {
        const project = request.body;

        if (_findById(project.id)) {
            return response.status(422).send(`Project with the id ${project.id} already exists.`);
        }

        projects.push(project);

        return response.status(201).json(project);
    }
}
