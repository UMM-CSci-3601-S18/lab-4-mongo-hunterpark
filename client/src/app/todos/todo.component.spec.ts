import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoComponent} from './todo.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('Todo component', () => {

    let todoComponent: TodoComponent;
    let fixture: ComponentFixture<TodoComponent>;

    let todoListServiceStub: {
        getTodoById: (todoId: string) => Observable<Todo>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodoById: (todoId: string) => Observable.of([
                {
                    _id: 'hunter_id',
                    owner: 'Hunter',
                    status: true,
                    body: 'likes sweatshorts',
                    category: 'sweatshorsts'
                },
                {
                    _id: 'sunjae_id',
                    owner: 'Sunjae',
                    status: false,
                    body: 'went to lab',
                    category: 'homework'
                },
                {
                    _id: 'nic_id',
                    owner: 'Nic',
                    status: true,
                    body: 'teaches at school',
                    category: 'morris'
                },
            ].find(todo => todo._id === todoId))
        };

        TestBed.configureTestingModule({
            declarations: [TodoComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoComponent);
            todoComponent = fixture.componentInstance;
        });
    }));

    it('can retrieve Hunter by ID', () => {
        todoComponent.setId('hunter_id');
        expect(todoComponent.todo).toBeDefined();
        expect(todoComponent.todo.owner).toBe('Hunter');
        expect(todoComponent.todo.body).toBe('likes sweatshorts');
    });

    it('returns undefined for Jesus', () => {
        todoComponent.setId('Jesus');
        expect(todoComponent.todo).not.toBeDefined();
    });

});
