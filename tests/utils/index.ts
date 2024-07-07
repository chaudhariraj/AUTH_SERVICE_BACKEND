import { DataSource } from "typeorm";

export const truncateTable = async (dataSource: DataSource) => {

    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name);
        await repository.clear();
    }

}