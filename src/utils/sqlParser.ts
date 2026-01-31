import { v4 as uuidv4 } from 'uuid';
import { Table, Column, Relation, DataType, DatabaseEngine } from '../types/schema';

interface ParsedSchema {
    tables: Table[];
    relations: Relation[];
}

export const parseSQL = (sql: string, currentDatabase: DatabaseEngine = 'MySQL'): ParsedSchema => {
    const tables: Table[] = [];
    const relations: Relation[] = [];

    const cleanSql = sql
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/--.*$/gm, '')
        .trim();

    const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:`?(\w+)`?)(?:\s*\(([\s\S]*?)\))(?:\s*ENGINE\s*=\s*\w+)?(?:\s*DEFAULT\s*CHARSET\s*=\s*\w+)?;?/gim;

    let match;
    let tableIndex = 0;

    const tableNameToId: Record<string, string> = {};
    const tempTables: { name: string; body: string; id: string }[] = [];

    while ((match = createTableRegex.exec(cleanSql)) !== null) {
        const tableName = match[1];
        const body = match[2];
        const id = uuidv4();
        tableNameToId[tableName] = id;
        tempTables.push({ name: tableName, body, id });
    }

    tempTables.forEach((tempTable, index) => {
        const columns: Column[] = [];
        const lines = tempTable.body.split(',').map(l => l.trim()).filter(l => l);

        const processedLines: string[] = [];
        let currentLine = '';
        let parenCount = 0;

        for (const char of tempTable.body) {
            if (char === '(') parenCount++;
            if (char === ')') parenCount--;

            if (char === ',' && parenCount === 0) {
                processedLines.push(currentLine.trim());
                currentLine = '';
            } else {
                currentLine += char;
            }
        }
        if (currentLine.trim()) processedLines.push(currentLine.trim());

        const x = (index % 3) * 350 + 50;
        const y = Math.floor(index / 3) * 350 + 50;

        processedLines.forEach(line => {
            line = line.replace(/\s+/g, ' ').trim();

            if (/^PRIMARY\s+KEY\s*\((.+)\)/i.test(line)) {
                const pkMatch = line.match(/^PRIMARY\s+KEY\s*\((.+)\)/i);
                if (pkMatch) {
                    const pkCols = pkMatch[1].split(',').map(s => s.trim().replace(/`/g, ''));
                    pkCols.forEach(pkCol => {
                        const col = columns.find(c => c.name === pkCol);
                        if (col) col.isPrimaryKey = true;
                    });
                }
                return;
            }

            if (/^CONSTRAINT\s+`?\w+`?\s+FOREIGN\s+KEY\s*\(`?(\w+)`?\)\s+REFERENCES\s+`?(\w+)`?\s*\(`?(\w+)`?\)/i.test(line) ||
                /^FOREIGN\s+KEY\s*\(`?(\w+)`?\)\s+REFERENCES\s+`?(\w+)`?\s*\(`?(\w+)`?\)/i.test(line)) {

                const fkRegex = /(?:CONSTRAINT\s+`?\w+`?\s+)?FOREIGN\s+KEY\s*\(`?(\w+)`?\)\s+REFERENCES\s+`?(\w+)`?\s*\(`?(\w+)`?\)(?:\s+ON\s+DELETE\s+(CASCADE|SET NULL|NO ACTION|RESTRICT))?(?:\s+ON\s+UPDATE\s+(CASCADE|SET NULL|NO ACTION|RESTRICT))?/i;
                const fkMatch = line.match(fkRegex);

                if (fkMatch) {
                    const sourceColName = fkMatch[1];
                    const targetTableName = fkMatch[2];
                    const targetColName = fkMatch[3];
                    const onDelete = fkMatch[4] as any || 'CASCADE';
                    const onUpdate = fkMatch[5] as any || 'CASCADE';

                    const sourceCol = columns.find(c => c.name === sourceColName);
                    if (sourceCol) {
                        sourceCol.isForeignKey = true;

                        if (tableNameToId[targetTableName]) {

                        }
                    }
                }
                return;
            }

            const colMatch = line.match(/^`?(\w+)`?\s+(\w+)(?:\(([^)]+)\))?(.*)$/i);
            if (colMatch) {
                const name = colMatch[1];
                const rawType = colMatch[2].toUpperCase();
                const args = colMatch[3];
                const rest = colMatch[4].toUpperCase();

                let type: DataType = 'VARCHAR';
                if (['INT', 'INTEGER'].includes(rawType)) type = 'INT';
                else if (['BIGINT'].includes(rawType)) type = 'BIGINT';
                else if (['TINYINT'].includes(rawType)) type = 'TINYINT';
                else if (['VARCHAR'].includes(rawType)) type = 'VARCHAR';
                else if (['TEXT'].includes(rawType)) type = 'TEXT';
                else if (['BOOLEAN', 'BOOL'].includes(rawType)) type = 'BOOLEAN';
                else if (['DATE'].includes(rawType)) type = 'DATE';
                else if (['DATETIME'].includes(rawType)) type = 'DATETIME';
                else if (['DECIMAL'].includes(rawType)) type = 'DECIMAL';

                const isPrimaryKey = rest.includes('PRIMARY KEY');
                const isUnique = rest.includes('UNIQUE');
                const isNullable = !rest.includes('NOT NULL');
                const isAutoIncrement = rest.includes('AUTO_INCREMENT');

                columns.push({
                    id: uuidv4(),
                    name,
                    type,
                    isPrimaryKey,
                    isForeignKey: false,
                    isNullable,
                    isUnique,
                    isAutoIncrement
                });
            }
        });

        tables.push({
            id: tempTable.id,
            name: tempTable.name,
            x,
            y,
            columns,
            color: '#f8fafc'
        });
    });

    tempTables.forEach((tempTable) => {
        const sourceTableId = tempTable.id;
        const sourceTable = tables.find(t => t.id === sourceTableId);
        if (!sourceTable) return;

        const lines = tempTable.body.split(',').map(l => l.trim()).filter(l => l);

        const fkRegex = /(?:CONSTRAINT\s+`?\w+`?\s+)?FOREIGN\s+KEY\s*\(`?(\w+)`?\)\s+REFERENCES\s+`?(\w+)`?\s*\(`?(\w+)`?\)(?:\s+ON\s+DELETE\s+(CASCADE|SET NULL|NO ACTION|RESTRICT))?(?:\s+ON\s+UPDATE\s+(CASCADE|SET NULL|NO ACTION|RESTRICT))?/gim;

        let match;
        while ((match = fkRegex.exec(tempTable.body)) !== null) {
            const sourceColName = match[1];
            const targetTableName = match[2];
            const targetColName = match[3];
            const onDelete = (match[4] as any) || 'CASCADE';
            const onUpdate = (match[5] as any) || 'CASCADE';

            const targetTableId = tableNameToId[targetTableName];
            if (targetTableId) {
                const targetTable = tables.find(t => t.id === targetTableId);
                const sourceCol = sourceTable.columns.find(c => c.name === sourceColName);
                const targetCol = targetTable?.columns.find(c => c.name === targetColName);

                if (targetTable && sourceCol && targetCol) {
                    sourceCol.isForeignKey = true;
                    relations.push({
                        id: uuidv4(),
                        sourceTableId,
                        sourceColumnId: sourceCol.id,
                        sourceSide: 'right',
                        targetTableId,
                        targetColumnId: targetCol.id,
                        targetSide: 'left',
                        type: '1:N',
                        onDelete,
                        onUpdate
                    });
                }
            }
        }
    });

    return { tables, relations };
};
