import state from './todosStore.js';
import { createView } from './todosContainerView.js';

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