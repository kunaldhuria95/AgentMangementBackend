const notFound = (req, res) => {
    return res.status(404).send('Route Does not exists')
}
export default notFound