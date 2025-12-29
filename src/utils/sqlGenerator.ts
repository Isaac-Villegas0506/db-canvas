import { ProjectState } from '../types/schema';

export const generateSQL = (project: ProjectState): string => {
    const { database, tables, relations } = project;
    let sql = `-- Database: ${project.name}\n`;
    sql += `-- Generated at: ${new Date().toISOString()}\n\n`;

    tables.forEach(table => {
        sql += `CREATE TABLE ${escapeId(table.name, database)} (\n`;

        const columnDefs = table.columns.map(col => {
            let def = `  ${escapeId(col.name, database)} ${col.type}`;

            if (col.type === 'VARCHAR') def += '(255)';

            if (col.isPrimaryKey) def += ' PRIMARY KEY';
            if (!col.isNullable) def += ' NOT NULL';
            if (col.isUnique && !col.isPrimaryKey) def += ' UNIQUE';

            return def;
        });

        sql += columnDefs.join(',\n');
        sql += `\n);\n\n`;
    });

    if (relations.length > 0) {
        sql += `-- Relationships\n`;
        relations.forEach(rel => {
            const sourceTable = tables.find(t => t.id === rel.sourceTableId);
            const targetTable = tables.find(t => t.id === rel.targetTableId);

            if (sourceTable && targetTable) {
                sql += `ALTER TABLE ${escapeId(sourceTable.name, database)} ADD CONSTRAINT fk_${shortId(rel.id)} `;
                sql += `FOREIGN KEY (${escapeId(rel.sourceColumnId || 'target_id', database)}) `;
                sql += `REFERENCES ${escapeId(targetTable.name, database)}(id);\n`;
            }
        });
    }

    return sql;
};

const escapeId = (str: string, db: string): string => {
    if (db === 'PostgreSQL') return `"${str}"`;
    return `\`${str}\``;
};

const shortId = (id: string) => id.substring(0, 8);
