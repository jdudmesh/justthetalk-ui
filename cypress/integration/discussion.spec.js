// This file is part of the JUSTtheTalkUI distribution (https://github.com/jdudmesh/justthetalk-ui).
// Copyright (c) 2021 John Dudmesh.

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, version 3.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

describe("Logged In Navigation", () => {

    const createValidDiscussion = () => {

        cy.visit("/advice");
        cy.get("div[data-test-id='create-discussion'] button").click()

        cy.get("div[data-test-id='discussion-title'] input").type(`Test Thread: ${new Date().toString()}`)
        cy.get("div[data-test-id='discussion-header'] textarea").type("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")

        cy.get("span[data-test-id='autosubscribe-discussion'] input[type='checkbox']").uncheck()
        cy.get("button[data-test-id='create-discussion']").click()

        cy.url().should("match", new RegExp(Cypress.config().baseUrl + `/advice/\\d+/test-thread.+`))

    }

    beforeEach(() => {
        cy.visit('/login')
        cy.get('input[data-test-id="username"]').type("testuser1")
        cy.get('input[data-test-id="password"]').type("1234567890")
        cy.get('button[data-test-id="login-button"]').click()
    })

    it("should not visit each special folders", () => {
        cy.visit("/mod");
        cy.url().should("eq", Cypress.config().baseUrl + "/")
    });

    it("should not create a new discussion with no data", () => {
        cy.visit("/advice");
        cy.get("div[data-test-id='create-discussion' button").click()
        cy.get("button[data-test-id='create-discussion']").click()
        cy.contains("div", "You must provide a title for the discussion")
        cy.contains("div", "You must explain your point")
    });

    it("should not create a new discussion with duplicate title", () => {

        cy.visit("/advice");
        cy.get("div[data-test-id='create-discussion' button").click()

        cy.get("div[data-test-id='discussion-title'] input").type(`Pussies Galore. The slaves finally speak out.`)
        cy.get("div[data-test-id='discussion-header'] textarea").type("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")

        cy.get("button[data-test-id='create-discussion']").click()

        cy.contains("div", "A discussion with that title already exists: Bad request")

    });


    it("should create a new discussion with valid data", () => {
        createValidDiscussion()
    });

    it("should create a new discussion with valid data and subscribe", () => {

        cy.visit("/advice");
        cy.get("div[data-test-id='create-discussion' button").click()

        cy.get("div[data-test-id='discussion-title'] input").type(`Test Thread: ${new Date().toString()}`)
        cy.get("div[data-test-id='discussion-header'] textarea").type("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")

        cy.get("span[data-test-id='autosubscribe-discussion'] input[type='checkbox']").check()

        cy.get("button[data-test-id='create-discussion']").click()

        cy.url().should("match", new RegExp(Cypress.config().baseUrl + `/advice/\\d+/test-thread.+`))

        cy.get("div[data-test-id='unsubscribe-discussion']").should("exist")

    });

    it("should subscribe and unsubscribe to a new discussion", () => {

        createValidDiscussion()

        cy.get("div[data-test-id='subscribe-discussion'] button").click()
        cy.get("div[data-test-id='unsubscribe-discussion']").should("exist")
        cy.get("div[data-test-id='unsubscribe-discussion'] button").click()
        cy.get("div[data-test-id='subscribe-discussion']").should("exist")

    })

    it("should edit a new discussion with no posts", () => {

        createValidDiscussion()

        cy.get("div[data-test-id='edit-discussion'] button").click()

        cy.get("div[data-test-id='discussion-title'] input").type("edited")
        cy.get("div[data-test-id='discussion-header'] textarea").type("edited")

        cy.get("button[data-test-id='create-discussion']").click()

        cy.get(".discussionTitle").invoke("text").should("match", /edited/)
        cy.get(".discussionHeader").invoke("text").should("match", /edited/)

    });

    it("should delete a new discussion with no posts", () => {

        createValidDiscussion()

        cy.get("div[data-test-id='delete-discussion'] button").click()
        cy.get("button[data-test-id='delete-discussion-ok']").click()

        cy.url().should("eq", Cypress.config().baseUrl + "/advice")

    });

    it("should not delete a new discussion with posts", () => {

        createValidDiscussion()

        cy.get("textarea[data-test-id='post-text']").type(`Test Post: ${new Date().toString()}`)
        cy.get("button[data-test-id='create-post']").click()

        cy.get("div[data-test-id='delete-discussion'] button").should("not.exist")

    });

    it("should not post on a new discussion with no text", () => {

        createValidDiscussion()
        cy.get("button[data-test-id='create-post']").click()

        cy.contains("div", "You must enter some text!")


    });

    it("should post on a new discussion with valid text", () => {

        createValidDiscussion()

        cy.get("textarea[data-test-id='post-text']").type(`Test Post: ${new Date().toString()}`)
        cy.get("button[data-test-id='create-post']").click()

        cy.contains("a", "#1")

    });

    it("should post on a new discussion with valid text and edit it", () => {

        createValidDiscussion()
        cy.get("textarea[data-test-id='post-text']").type(`Test Post: ${new Date().toString()}`)
        cy.get("button[data-test-id='create-post']").click()

        cy.get('.post').trigger('mouseover')
        cy.get("button[data-test-id='edit-post']").click()
        cy.get("textarea[data-test-id='edit-post-text']").type(`edited`)
        cy.get("button[data-test-id='edit-post-save']").click()

        cy.get(".postBody").first().invoke("text").should("match", /edited/)

    });

    it("should post on a new discussion with valid text and delete it", () => {

        createValidDiscussion()
        cy.get("textarea[data-test-id='post-text']").type(`Test Post: ${new Date().toString()}`)
        cy.get("button[data-test-id='create-post']").click()

        cy.get('.post').trigger('mouseover')
        cy.get("button[data-test-id='delete-post']").click()

        cy.contains("div", "Deleted post")

    });

    it("should report a post", () => {

        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out/1")

        cy.intercept({pathname: "/user/report"}).as('submit')

        cy.get('.post').first().trigger('mouseover')
        cy.get("button[data-test-id='report-post']").first().click()

        cy.get("input[data-test-id='report-username-text']").should("have.value", "testuser1")
        cy.get("input[data-test-id='report-email-text']").should("have.value", "test@notthetalk.com")

        cy.get("button[data-test-id='save-report']").click()

        cy.get("textarea[data-test-id='report-reporttext-text']").parent().should("have.class", "Mui-error")
        cy.get("textarea[data-test-id='report-reporttext-text']").type("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")

        cy.get("button[data-test-id='save-report']").click()


        cy.wait('@submit').its('response.statusCode').should('eq', 200)

    })

    it("should not post on a new discussion with duplicate text", () => {

        createValidDiscussion()

        cy.get("textarea[data-test-id='post-text']").type("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")
        cy.get("button[data-test-id='create-post']").click()

        cy.contains("a", "#1")

        cy.get("textarea[data-test-id='post-text']").type("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")
        cy.get("button[data-test-id='create-post']").click()

        cy.contains("div", "You've already posted this message!")

    });

    it("should create a new discussion with subscription", () => {

        cy.visit("/advice");
        cy.get("div[data-test-id='create-discussion' button").click()

        cy.get("div[data-test-id='discussion-title'] input").type(`Test Thread: ${new Date().toString()}`)
        cy.get("div[data-test-id='discussion-header'] textarea").type("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")

        cy.get("button[data-test-id='create-discussion']").click()

        cy.url().should("match", new RegExp(Cypress.config().baseUrl + `/advice/\\d+/test-thread.+`))

        cy.get("div[data-test-id='subscribe-discussion']").should("exist")

        cy.get("span[data-test-id='autosubscribe-discussion'] input[type='checkbox']").check()

        cy.get("textarea[data-test-id='post-text']").type(`Test Post: ${new Date().toString()}`)
        cy.get("button[data-test-id='create-post']").click()

        cy.get("div[data-test-id='unsubscribe-discussion']").should("exist")

        cy.get("span[data-test-id='autosubscribe-discussion'] input[type='checkbox']").uncheck()

    });

    it("should mark a discussion as unread", () => {
        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out/5000")
        cy.get("div[data-test-id='unread-discussion'] button").click()
        cy.wait(2500)
        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out")
        cy.contains("a", "#1")
    });

    it("should ignore a user and then unignore them", () => {

        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out/1")

        cy.get('.post').first().trigger('mouseover')
        cy.get("button[data-test-id='ignore-user']").first().click()

        cy.contains("div", "Post by ignored user")

        cy.get("button[data-test-id='user-menu']").click()
        cy.get("li[data-test-id='user-menu-profile']").click()
        cy.get("div[data-test-id='user-profile-ignoredusers']").click()

        cy.get("button[data-test-id='delete-ignored-user']").first().click()

        cy.contains("span", "KittyKarateRedux").should("not.exist")

        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out/1")
        cy.contains("a", "#1")

    })

})