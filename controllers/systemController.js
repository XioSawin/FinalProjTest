const getInfo = (req, res) => {
    res.render("info", {
        argEntrada: process.argv, 
        os: process.platform, 
        nodeVs: process.version, 
        memoryUsage: process.memoryUsage(), 
        excPath: process.execPath, 
        processID: process.pid, 
        folder: process.cwd()
       });
};

module.exports = {
    getInfo
};