import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
browser.driver.controlFlow().execute = function () {
    let args = arguments;
    //queue 100ms wait between test
    //This delay is only put here so that you can watch the browser do its thing.
    //If you're tired of it taking long you can remove this call
    origFn.call(browser.driver.controlFlow(), function () {
        return protractor.promise.delayed(1);
    });

    return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Todo list', () => {
    let page: TodoPage;

    beforeEach(() => {
        page = new TodoPage();
    });

    it('should get and highlight Todos title attribute ', () => {
        page.navigateTo();
        expect(page.getTodoTitle()).toEqual('Todos');
    });


    //owner filter testing
    it('should type something in search for owner text box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeAOwner('wo');
        expect(page.getUniqueTodo('58af3a600343927e48e87219')).toEqual('highlight_off\n' +
            '  Workman');
        page.clearOwnerField();
        page.typeAOwner('rob');
        expect(page.getUniqueTodo('58af3a600343927e48e87220')).toEqual('highlight_off\n' +
            '  Roberta');
    });


    //body filter testing
    it('should type something in filter body text box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeABody('nulla eiusmod fugiat');
        expect(page.getUniqueTodo('58af3a600343927e48e87229')).toEqual('highlight_off\n' +
            '  Dawn');
        page.clearBodyField();
        page.typeABody('ad nisi elit dolore laboris');
        expect(page.getUniqueTodo('58af3a600343927e48e87213')).toEqual('check_circle\n' +
            '  Blanche');
    });


    //testing one of status
    it('should select filter by status: \'complete\' radio button and check that complete status is returned', () => {
        page.navigateTo();
        page.chooseCompleteStatus();
        expect(page.getUniqueTodo('58af3a600343927e48e87218')).toEqual('check_circle\n' +
            '  Workman');
    })



    //testing one of categories
    it('should select the groceries category and check that correct element is returned', () => {
        page.navigateTo();
        page.chooseGroceries();
        expect(page.getUniqueTodo('58af3a600343927e48e87213')).toEqual('check_circle\n' +
            '  Blanche');
    })


    // using all four filters
    it('should specify something in all four fields and return correct element for Dawn', () => {
        page.navigateTo();
        page.typeAOwner('roberta');
        page.typeABody('magna');
        page.chooseCompleteStatus();
        page.chooseGroceries();
        expect(page.getUniqueTodo('58af3a600343927e48e87238')).toEqual('check_circle\n' +
            '  Roberta');
    })


    //add todobutton.
    it('Should have an add todo button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should open a dialog box when add todo button is clicked', () => {
        page.navigateTo();
        expect(element(by.css('add-todo')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.id('addNewTodo')).click();
        expect(element(by.css('add-todo')).isPresent()).toBeTruthy('There should be a modal window now');
    });


    //this section actually add list on web-page

    it('will add list on wbepage', () => {
        page.navigateTo();
        page.clickAddTodoButton();
        element(by.id('ownerField')).sendKeys('Sungjae');
        element(by.id('categoryField')).sendKeys('video games');
        element(by.id('statusField')).sendKeys('True');
        element(by.id('confirmAddTodoButton')).click();
    });

    it('add todo list with using all four filers.', () => {
        page.navigateTo();
        page.clickAddTodoButton();
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be a owner field');
        element(by.id('ownerField')).sendKeys('Sungjae');
        expect(element(by.id('categoryField')).isPresent()).toBeTruthy('There should be a category field');
        element(by.id('categoryField')).sendKeys('video games');
        expect(element(by.id('statusField')).isPresent()).toBeTruthy('There should be an status field');
        element(by.id('statusField')).sendKeys('true');
        expect(element(by.id('bodyField')).isPresent()).toBeTruthy('There should be an body field');
        element(by.id('bodyField')).sendKeys('I want have some rest and play games');
    });
});

