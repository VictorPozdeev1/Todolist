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

const createView = (containerNodeId, completeHandler, deleteHandler) => ({
    _container: document.getElementById(containerNodeId),

    add(itemData, key) {
        const domElementToAdd = document.createElement('li');
        domElementToAdd.classList.add('todoItem');
        domElementToAdd.textContent = itemData.text;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '\u2716';
        deleteButton.classList.add('button', 'deleteButton', 'roundButton');
        deleteButton.addEventListener('click', () => { deleteHandler(/* e.target.parentElement */ domElementToAdd) });
        domElementToAdd.insertAdjacentElement('beforeend', deleteButton);

        const completeButton = document.createElement('button');
        completeButton.textContent = '\u2714';
        completeButton.classList.add('button', 'completeButton', 'roundButton');
        completeButton.addEventListener('click', () => { completeHandler(/* e.target.parentElement */ domElementToAdd) });
        domElementToAdd.insertAdjacentElement('beforeend', completeButton);

        domElementToAdd.dataset.id = key;
        if (itemData.completed) {
            domElementToAdd.dataset.completed = true;
            domElementToAdd.classList.add('completed');
        }
        const whereTo = itemData.completed ? 'beforeend' : 'afterbegin';
        this._container.insertAdjacentElement(whereTo, domElementToAdd);
    },

    setCompleteState(todoDomElement, newState = true) {
        todoDomElement.dataset.completed = newState;
        if (newState) {
            todoDomElement.classList.add('completed');
            this._container.append(todoDomElement);
        } else {
            todoDomElement.classList.remove('completed');
            this._container.prepend(todoDomElement);
        }
    },

    getFirst() {
        return this._container.firstElementChild;
    },

    getNth(n) {
        return this._container.children[n];
    },

    getLast() {
        return this._container.lastElementChild;
    },

    markEveryNth(markAction, indexStart = 0, indexStep = 2) {
        const allTodoDomElements = this._container.children;
        for (let i = indexStart; i < allTodoDomElements.length; i += indexStep) {
            const currentElement = allTodoDomElements[i];
            markAction(currentElement);
        }
    }
});

(function init() {
    const newItem_innerContainer = document.getElementById('newItem_innerContainer');
    const newItem_textInput = document.getElementById('newItem_textInput');
    const newItem_okButton = document.getElementById('newItem_okButton');
    const newItem_toggleModeButton = document.getElementById('newItem_toggleModeButton');

    const view = createView('itemList_container', completeTodo, deleteTodo);

    state.items.forEach((value, key) => {
        view.add(value, key);
    });

    let itemAddingMode = false;
    newItem_toggleModeButton.addEventListener('click', handleClick_toggleModeButton);
    function handleClick_toggleModeButton() {
        itemAddingMode = !itemAddingMode;
        // todo: class toggling would be better, probably
        newItem_innerContainer.style.display = itemAddingMode ? "flex" : "none";
        newItem_toggleModeButton.textContent = itemAddingMode ? 'Отмена' : 'Добавить...';
    };

    newItem_okButton.addEventListener('click', handleClick_okButton);
    function handleClick_okButton() {
        const text = newItem_textInput.value;
        if (!text)
            return;
        addNewTodo({ text, completed: false });
        newItem_textInput.value = '';
    };

    function addNewTodo(itemToAdd) {
        const key = state.add(itemToAdd);
        view.add(itemToAdd, key);
    };

    function completeTodo(todoToComplete) {
        if (!todoToComplete)
            return;
        const newCompleteState = !(todoToComplete.dataset.completed?.toLowerCase?.() === 'true');
        state.setCompleteState(todoToComplete.dataset.id, newCompleteState);
        view.setCompleteState(todoToComplete, newCompleteState);
    };

    function deleteTodo(todoToDelete) {
        if (!todoToDelete)
            return;
        state.remove(todoToDelete.dataset.id);
        todoToDelete.remove(); //call a method of the view?
    }

    document.getElementById('someButtons_deleteFirstButton')
        .addEventListener('click', () => deleteTodo(view.getFirst()));
    document.getElementById('someButtons_deleteLastButton')
        .addEventListener('click', () => deleteTodo(view.getLast()));
    document.getElementById('someButtons_stylizeOddsButton')
        .addEventListener('click', () => {
            const newStyle = view.getFirst().style.color ? '' : 'black';
            view.markEveryNth(element => element.style.color = newStyle)
        });
    document.getElementById('someButtons_stylizeEvensButton')
        .addEventListener('click', () => {
            const newStyle = view.getNth(1).style.color ? '' : 'black';
            view.markEveryNth(element => element.style.color = newStyle, 1);
        });
})();
