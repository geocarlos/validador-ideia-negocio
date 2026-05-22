Feature: Multi-agent validation

  Scenario: Agents evaluate the idea and return scores
    Given an idea payload
    When the validation orchestrator runs
    Then each agent returns a score
    And an aggregated decision is produced
