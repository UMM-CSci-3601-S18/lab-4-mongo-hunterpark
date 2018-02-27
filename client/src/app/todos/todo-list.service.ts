import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Todo} from './todo';
import {environment} from '../../environments/environment';

@Injectable()
export class TodoListService {
    readonly baseUrl: string = environment.API_URL + 'todos';
    private todoUrl: string = this.baseUrl;

    constructor(private httpClient: HttpClient) {
    }

    //the todos will be sorted if a parameter is given
    getTodos(status?: string, owner?: string): Observable<Todo[]> {

        if (status != null || owner != null) {
            this.todoUrl = this.baseUrl + '?';
        }

        //add status filter
        if (status != null && status != "all") {
            /*let statusBool: boolean;
            if (status === 'complete') {
                statusBool = true;
            }
            else if (status === 'incomplete') {
                statusBool = false;
            }*/

            this.todoUrl += 'status=' + status + '&';
        }

        //add owner filter
        if (owner != null) {
            this.todoUrl += 'owner=' + owner;
        }

        return this.httpClient.get<Todo[]>(this.todoUrl);
    }

    getTodoById(id: string): Observable<Todo> {
        return this.httpClient.get<Todo>(this.todoUrl + '/' + id);
    }

    addNewTodo(newTodo: Todo): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new todo with the todo data as the body with specified headers.
        return this.httpClient.post<{'$oid': string}>(this.baseUrl + '/new', newTodo, httpOptions);
    }
}
