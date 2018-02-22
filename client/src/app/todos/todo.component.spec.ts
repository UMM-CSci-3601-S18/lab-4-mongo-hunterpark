import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Todo} from "./todo";
import {TodoComponent} from "./todo.component";
import {TodoListService} from "./todo-list.service";
import {Observable} from "rxjs";
//import { PipeModule } from "../../pipe.module";

describe("Todo component", () => {

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
                    _id: "Hunter_id",
                    owner: "Hunter",
                    status: true,
                    body: "In class",
                    category: "CSCI 3601"
                },
                {
                    _id: "Sungjae_id",
                    owner: "Sungjae",
                    status: false,
                    body: "Dungeon",
                    category: "CSCI 3601"
                },
                {
                    _id: "Nic_id",
                    owner: "Nic",
                    status: true,
                    body: "In class",
                    category: "IS 1091"
                }
            ].find(todo => todo._id === todoId))
        };

        TestBed.configureTestingModule({
            //imports: [PipeModule],
            declarations: [TodoComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoComponent);
            todoComponent = fixture.componentInstance;
        });
    }));

    it("can retrieve Hunter by ID", () => {
        todoComponent.setId("Hunter_id");
        expect(todoComponent.todo).toBeDefined();
        expect(todoComponent.todo.owner).toBe("Hunter");
        expect(todoComponent.todo.category).toBe("CSCI 3601");
    });

    it("returns undefined for KK", () => {
        todoComponent.setId("Kristan");
        expect(todoComponent.todo).not.toBeDefined();
    });

});
