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

describe("Logged In Home Functions", () => {

    beforeEach(() => {
        cy.visit('/login')
        cy.get('input[data-test-id="username"]').type("testuser1")
        cy.get('input[data-test-id="password"]').type("1234567890")
        cy.get('button[data-test-id="login-button"]').click()
    })

    it("should refresh posts", () => {

        cy.visit("/")
        cy.contains("h5", "Latest discussions")

        cy.wait(2500)
        cy.intercept({pathname: "/frontpage/latest"}).as('list')

        cy.get("div[data-test-id='reload-threads'] button").first().click()

        cy.wait('@list').its('response.statusCode').should('eq', 200)

    })

    it("should switch view types", () => {

        cy.visit("/")

        cy.get("div[data-test-id='viewtype-button'] button").click()
        cy.get("li[data-test-id='latest']").click()

        cy.contains("h5", "Latest discussions")

        cy.intercept({pathname: "/frontpage/**"}).as('list')

        cy.get("div[data-test-id='viewtype-button'] button").click()
        cy.get("li[data-test-id='latest']").invoke("text").should("match", /✓/)

        cy.get("li[data-test-id='subs']").click()
        cy.get("li[data-test-id='subs']").invoke("text").should("match", /✓/)
        cy.contains("h5", "Subscriptions")
        cy.wait('@list').should((req) => {
            expect(req.request.url).to.match(/subs/)
            expect(req.response.statusCode).to.equal(200)
        })

        cy.get("div[data-test-id='viewtype-button'] button").click()
        cy.get("li[data-test-id='mostactive']").click()
        cy.get("li[data-test-id='mostactive']").invoke("text").should("match", /✓/)
        cy.contains("h5", "Most active")
        cy.wait('@list').should((req) => {
            expect(req.request.url).to.match(/mostactive/)
            expect(req.response.statusCode).to.equal(200)
        })

        cy.get("div[data-test-id='viewtype-button'] button").click()
        cy.get("li[data-test-id='startedbyme']").click()
        cy.get("li[data-test-id='startedbyme']").invoke("text").should("match", /✓/)
        cy.contains("h5", "Started by me")
        cy.wait('@list').should((req) => {
            expect(req.request.url).to.match(/startedbyme/)
            expect(req.response.statusCode).to.equal(200)
        })


        cy.get("div[data-test-id='viewtype-button'] button").click()
        cy.get("li[data-test-id='latest']").click()
        cy.wait('@list').should((req) => {
            expect(req.request.url).to.match(/latest/)
            expect(req.response.statusCode).to.equal(200)
        })

    })

})