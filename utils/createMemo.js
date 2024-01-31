exports.__esModule = true;

exports.createMemo = function createMemo() {
    const cache = new Map();

    function getMemoryCell(path) {
        if (!Array.isArray(path)) {
            path = [path];
        }
        let currentLevel = cache;

        for (const pathPart of path) {
            if (!currentLevel.has(pathPart)) {
                currentLevel.set(pathPart, new Map());
            }

            currentLevel = currentLevel.get(pathPart);
        }
        return currentLevel;
    }

    const RESULT_KEY = 'result';

    return {
        set(path, value) {
            getMemoryCell(path).set(RESULT_KEY, value);
        },
        get(path, valueFactory) {
            const memoryCell = getMemoryCell(path);
            if (!memoryCell.has(RESULT_KEY) && valueFactory) {
                const value = valueFactory();
                memoryCell.set(RESULT_KEY, value);
            }
            return memoryCell.get(RESULT_KEY);
        },
        clear() {
            cache.clear();
        }
    };
}
