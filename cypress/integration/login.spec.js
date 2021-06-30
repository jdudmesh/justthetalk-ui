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

describe("Login", () => {

    it("should navigate to login page after clicking login button", () => {

        cy.visit('http://local-ui.justthetalk.com/')

        cy.get('a[data-test-id="login-button"]').click()

        cy.get('button[data-test-id="login-button"]').should('exist');

    });

    it("should navigate to home page after successful login", () => {

        cy.visit('http://local-ui.justthetalk.com/login')

        cy.get('input[data-test-id="username"]').type("testuser1")
        cy.get('input[data-test-id="password"]').type("1234567890")

        cy.get('button[data-test-id="login-button"]').click()

        cy.get('div[data-test-id="latest-button"]').should('exist');

    });

    it("should show an error after failed login", () => {

        cy.visit('http://local-ui.justthetalk.com/login')

        cy.get('input[data-test-id="username"]').type("testuser1")
        cy.get('input[data-test-id="password"]').type("11111111")

        cy.get('button[data-test-id="login-button"]').click()

        cy.get('div.MuiAlert-message').should('exist');

    });

    it("should show an error message after login for deleted user", () => {

        cy.visit('http://local-ui.justthetalk.com/login')

        cy.get('input[data-test-id="username"]').type("testuser3")
        cy.get('input[data-test-id="password"]').type("1234567890")

        cy.get('button[data-test-id="login-button"]').click()

        cy.get('div.MuiAlert-message').should('exist');

    });


});