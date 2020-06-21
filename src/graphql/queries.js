/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOrganization = /* GraphQL */ `
  query GetOrganization($id: ID!) {
    getOrganization(id: $id) {
      id
      name
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;
export const listOrganizations = /* GraphQL */ `
  query ListOrganizations(
    $filter: ModelOrganizationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrganizations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        isActive
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOrganizationTransaction = /* GraphQL */ `
  query GetOrganizationTransaction($organizationId: ID!, $id: ID!) {
    getOrganizationTransaction(organizationId: $organizationId, id: $id) {
      organizationId
      id
      username
      points
      type
      note
      createdBy
      createdAt
      updatedAt
      user {
        organizationId
        username
        name
        role
        isActive
        currentPoints
        earnedPoints
        createdAt
        updatedAt
        organization {
          id
          name
          description
          isActive
          createdAt
          updatedAt
        }
        tasks {
          nextToken
        }
        transactions {
          nextToken
        }
      }
    }
  }
`;
export const listOrganizationTransactions = /* GraphQL */ `
  query ListOrganizationTransactions(
    $organizationId: ID
    $id: ModelIDKeyConditionInput
    $filter: ModelOrganizationTransactionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOrganizationTransactions(
      organizationId: $organizationId
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        organizationId
        id
        username
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const getOrganizationUser = /* GraphQL */ `
  query GetOrganizationUser($organizationId: ID!, $username: String!) {
    getOrganizationUser(organizationId: $organizationId, username: $username) {
      organizationId
      username
      name
      role
      isActive
      currentPoints
      earnedPoints
      createdAt
      updatedAt
      organization {
        id
        name
        description
        isActive
        createdAt
        updatedAt
      }
      tasks {
        items {
          organizationId
          id
          taskName
          username
          status
          note
          transactionId
          createdAt
          updatedAt
        }
        nextToken
      }
      transactions {
        items {
          organizationId
          id
          username
          points
          type
          note
          createdBy
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const listOrganizationUsers = /* GraphQL */ `
  query ListOrganizationUsers(
    $organizationId: ID
    $username: ModelStringKeyConditionInput
    $filter: ModelOrganizationUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOrganizationUsers(
      organizationId: $organizationId
      username: $username
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        organizationId
        username
        name
        role
        isActive
        currentPoints
        earnedPoints
        createdAt
        updatedAt
        organization {
          id
          name
          description
          isActive
          createdAt
          updatedAt
        }
        tasks {
          nextToken
        }
        transactions {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getOrganizationUserTask = /* GraphQL */ `
  query GetOrganizationUserTask($organizationId: ID!, $id: ID!) {
    getOrganizationUserTask(organizationId: $organizationId, id: $id) {
      organizationId
      id
      taskName
      username
      status
      note
      transactionId
      createdAt
      updatedAt
      user {
        organizationId
        username
        name
        role
        isActive
        currentPoints
        earnedPoints
        createdAt
        updatedAt
        organization {
          id
          name
          description
          isActive
          createdAt
          updatedAt
        }
        tasks {
          nextToken
        }
        transactions {
          nextToken
        }
      }
      transaction {
        organizationId
        id
        username
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export const listOrganizationUserTasks = /* GraphQL */ `
  query ListOrganizationUserTasks(
    $organizationId: ID
    $id: ModelIDKeyConditionInput
    $filter: ModelOrganizationUserTaskFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOrganizationUserTasks(
      organizationId: $organizationId
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        organizationId
        id
        taskName
        username
        status
        note
        transactionId
        createdAt
        updatedAt
        user {
          organizationId
          username
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
        transaction {
          organizationId
          id
          username
          points
          type
          note
          createdBy
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const getTransactionsByUserByCreatedAt = /* GraphQL */ `
  query GetTransactionsByUserByCreatedAt(
    $username: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTransactionsByUserByCreatedAt(
      username: $username
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        organizationId
        id
        username
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const getTransactionsByUserByOrganization = /* GraphQL */ `
  query GetTransactionsByUserByOrganization(
    $username: String
    $organizationId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTransactionsByUserByOrganization(
      username: $username
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        organizationId
        id
        username
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const getTasksByUserByCreatedAt = /* GraphQL */ `
  query GetTasksByUserByCreatedAt(
    $username: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationUserTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTasksByUserByCreatedAt(
      username: $username
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        organizationId
        id
        taskName
        username
        status
        note
        transactionId
        createdAt
        updatedAt
        user {
          organizationId
          username
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
        transaction {
          organizationId
          id
          username
          points
          type
          note
          createdBy
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const getTasksByUserByOrganization = /* GraphQL */ `
  query GetTasksByUserByOrganization(
    $username: String
    $organizationId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationUserTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTasksByUserByOrganization(
      username: $username
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        organizationId
        id
        taskName
        username
        status
        note
        transactionId
        createdAt
        updatedAt
        user {
          organizationId
          username
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
        transaction {
          organizationId
          id
          username
          points
          type
          note
          createdBy
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
