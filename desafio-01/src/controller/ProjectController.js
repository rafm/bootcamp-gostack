const projects = [];

module.exports = {
    
    findAll(request, response) {
        return response.json(projects);
    }
}
