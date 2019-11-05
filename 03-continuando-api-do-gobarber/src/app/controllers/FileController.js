class FileController {
    async store(request, response) {
        return response.send({ ok: true });
    }
}

export default new FileController();
