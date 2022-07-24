import { DataSource } from "typeorm";

const myDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "demo_typegraphql",
    entities: ["src/entity/*.*"],
    logging: true,
    synchronize: true,
});

export { myDataSource };
