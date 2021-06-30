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

describe("Anonymous Navigation", () => {

    it("should visit each normal folder", () => {

        let folders = [
            'advice',
            'arts',
            'books',
            'cricket',
            'crosswords',
            'environment',
            'europe',
            'family',
            'film',
            'foodanddrink',
            'football',
            'history',
            'international',
            'issues',
            'itandcomputers',
            'media',
            'money',
            'music',
            'notesandqueries',
            'personal',
            'politics',
            'science',
            'sport',
            'thehaven',
            'travel',
            'uknews',
            'usa',
            'userspace',
            'workandcareers',
        ];

        folders.forEach(f => {
            cy.visit(`/${f}`)
            cy.get("div.discussion-item > a.discussion-link").first().should("have.attr", "href").and("match", new RegExp(`^/${f}`));
        });


    });

    it("should not visit each special folders", () => {
        cy.visit("/mod");
        cy.url().should("eq", Cypress.config().baseUrl + "/")

    });

    it("should visit a thread with no posts", () => {
        cy.visit("/mod/userspace/49805/jtt-crimes-and-punishments");
        cy.get("div.MuiAlert-message").should("have.text", "Create an account or log in to contribute to this discussion.")
    });

    it("should navigate direct to discussion from home", () => {
        cy.visit("/");
        cy.get("div.discussion-item").first().then($el => {
            let id = $el.attr("data-test-id")
            cy.wrap($el).find("> a.discussion-link").click()
            cy.url().should("match", new RegExp(`/${id}/`))
        });
    });

    it("should navigate direct to folder from discussion on home", () => {
        cy.visit("/");
        cy.get("div.discussion-item").first().then($el => {
            let key = $el.find("> a.folder-link").attr("data-test-folder")
            cy.wrap($el).find("> a.folder-link").click()
            cy.url().should("match", new RegExp(`^${Cypress.config().baseUrl}/${key}`))
        });
    });

    it("should navigate direct to discussion from folder", () => {
        cy.visit("/advice");
        cy.get("div.discussion-item").first().then($el => {
            let id = $el.attr("data-test-id")
            cy.wrap($el).find("> a.discussion-link").click()
            cy.url().should("match", new RegExp(`/${id}/`))
            cy.get("[data-test-id='post']").its('length').should('be.gt', 0)
        });
    });

    it("should navigate to a specific post", () => {
        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out/5000");
        cy.get("a[data-test-id='post-num']").first().should("have.text", "#5000")
    })

    it("should navigate to end of thread", () => {
        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out");
        cy.get("button[title='Last page']").click()
        cy.get("div.MuiAlert-message").should("have.text", "Create an account or log in to contribute to this discussion.")
    })

    it("should navigate to start of thread", () => {
        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out/5000");
        cy.get("button[title='First page']").click()
        cy.get("a[data-test-id='post-num']").first().should("have.text", "#1")
    })

    it("should navigate back one page", () => {
        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out/20");
        cy.get("button[title='Next page']").click()
        cy.get("a[data-test-id='post-num']").first().should("have.text", "#1")
    })

    it("should navigate forward one page", () => {
        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out/1");
        cy.get("button[title='Next page']").click()
        cy.contains("a", "#21")
    })

    it("should navigate up to folder", () => {
        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out/1");
        cy.get("button[title='Up to folder']").click()
        cy.url().should("eq", Cypress.config().baseUrl + "/advice")
    })

    it("should navigate to home", () => {
        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out/1");
        cy.get("button[title='Home']").click()
        cy.url().should("eq", Cypress.config().baseUrl +"/")
    })

    it("should autoload posts", () => {
        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out/1");
        cy.wait(2500)
        cy.get("#endOfListIndicator").scrollIntoView()
        cy.contains("a", "#21")
        cy.url().should("eq", Cypress.config().baseUrl + "/advice/43899/pussies-galore-the-slaves-finally-speak-out/21")
    })

    it("should report a post", () => {

        cy.visit("/advice/43899/pussies-galore-the-slaves-finally-speak-out/1")

        cy.intercept({pathname: "/user/report"}).as('submit')

        cy.get('.post').first().trigger('mouseover')
        cy.get("button[data-test-id='report-post']").first().click()

        cy.get("input[data-test-id='report-username-text']").type("John Woz Here")
        cy.get("input[data-test-id='report-email-text']").type("john@johndudmesh.com")

        cy.get("button[data-test-id='save-report']").click()

        cy.get("textarea[data-test-id='report-reporttext-text']").parent().should("have.class", "Mui-error")
        cy.get("textarea[data-test-id='report-reporttext-text']").type("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")

        cy.get("button[data-test-id='save-report']").click()


        cy.wait('@submit').its('response.statusCode').should('eq', 200)

    })

});