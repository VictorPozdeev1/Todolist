export const createView = (containerNodeId, completeHandler, deleteHandler) => ({
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
