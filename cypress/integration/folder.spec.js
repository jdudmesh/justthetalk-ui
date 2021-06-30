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


describe("Logged In Folder Functions", () => {

    beforeEach(() => {
        cy.visit('/login')
        cy.get('input[data-test-id="username"]').type("testuser1")
        cy.get('input[data-test-id="password"]').type("1234567890")
        cy.get('button[data-test-id="login-button"]').click()
    })

    it("should refresh posts", () => {

        cy.visit("/arts")
        cy.wait(2500)
        cy.intercept({pathname: "/folder/19/discussion"}).as('list')

        cy.get("div[data-test-id='refresh-folder'] button").first().click()

        cy.wait('@list').its('response.statusCode').should('eq', 200)

    })

    it("should subscribe and unsubscribe", () => {

        cy.visit("/arts")

        cy.get("div[data-test-id='subscribe-folder'] button").click()
        cy.get("div[data-test-id='unsubscribe-folder'] button").should("exist")

        cy.get("div[data-test-id='unsubscribe-folder'] button").click()
        cy.get("div[data-test-id='subscribe-folder'] button").should("exist")

    })

})