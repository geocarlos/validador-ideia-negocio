Feature: Authentication

  Scenario: User logs in with valid credentials
    Given a user with email "user@example.com" and password "password123"
    When they POST to "/auth/login" with the credentials
    Then the response status is 200
    And the response contains a JWT token
