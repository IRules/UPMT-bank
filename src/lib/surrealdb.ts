import { Surreal } from 'surrealdb.js';

const db = new Surreal();

const dbSession = db.connect("http://44.211.236.177:80/rpc", {
    namespace: 'upmt',
    database: 'upmt',

    auth: {
        username: 'upmt',
        password: 'HoF7J55BpXe6D73omP4e97cY',
    },
});

export default db;
export { dbSession };