Feature: Idea Validation

  Scenario: Submit idea for validation
    Given an authenticated user
    When they POST to "/validar" with an idea payload
    Then the response status is 201
    And the validation process is started

  Scenario: View validation history
    Given an authenticated user
    When they GET "/validations"
    Then the response status is 200
    And the response contains a list of validations
