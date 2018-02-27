
import {Component} from '@angular/core';
import {TodoListService} from './todo-list.service';
import {Todo} from './todo';

/**
 * @title Basic buttons
 */
@Component({
    selector: 'todo-button.component',
    templateUrl: 'todo-button.component.html',
})
export class TodoButton {
    public todos: Todo[];
    public filteredTodos: Todo[];
}
