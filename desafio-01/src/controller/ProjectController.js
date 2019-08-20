const projects = [];

module.exports = {

    findAll(request, response) {
        return response.json(projects);
    },

    create(request, response) {
        const project = request.body;

        if (projects.filter(prj => prj.id === project.id).length != 0) {
            return response.status(422).send(`Project with the id ${project.id} already exists.`);
        }
        
        projects.push(project);

        return response.status(201).json(project);
    }
}
