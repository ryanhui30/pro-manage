module.exports = {
    apps: [
        {
            name: "project-manager",
            script: "npm",
            args: "run dev",
            env: {
                NODE_ENV: "development",
            },
        },
    ],
};
