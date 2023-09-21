const state = {
    loadFromStorage(fallback = {
        _maxId: 2,
        items: { 1: { text: 'Поспать' }, 2: { text: 'Покушать' } }
    }) {
        const data = JSON.parse(localStorage.getItem('todos')) ?? fallback;
        this._maxId = Number(data._maxId);
        this.items = new Map(Object.entries(data.items));
    },

    saveToStorage() {
        const dataToSave = { _maxId: this._maxId, items: Object.fromEntries(this.items) };
        localStorage.setItem('todos', JSON.stringify(dataToSave));
    },

    add(todoItem) {
        this.items.set((++this._maxId).toString(), todoItem);
        this.saveToStorage();
        return this._maxId;
    },

    remove(todoId) {
        this.items.delete(todoId);
        this.saveToStorage();
    },

    setCompleteState(todoId, completed = true) {
        this.items.set(todoId, {...this.items.get(todoId), completed});
        this.saveToStorage();
    },
};

state.loadFromStorage();

export default state;