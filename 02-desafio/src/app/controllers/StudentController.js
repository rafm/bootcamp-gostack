class StudentController {
    async store(request, response) {
        return response.send(`Student POST, userId: ${request.userId}`);
    }

    async update(request, response) {
        return response.send(`Student PUT, userId: ${request.userId}`);
    }
}

export default new StudentController();
