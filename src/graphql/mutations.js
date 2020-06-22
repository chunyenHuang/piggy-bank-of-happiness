/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOrganization = /* GraphQL */ `
  mutation CreateOrganization(
    $input: CreateOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    createOrganization(input: $input, condition: $condition) {
      id
      name
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;
export const updateOrganization = /* GraphQL */ `
  mutation UpdateOrganization(
    $input: UpdateOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    updateOrganization(input: $input, condition: $condition) {
      id
      name
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;
export const deleteOrganization = /* GraphQL */ `
  mutation DeleteOrganization(
    $input: DeleteOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    deleteOrganization(input: $input, condition: $condition) {
      id
      name
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;
export const createOrganizationTask = /* GraphQL */ `
  mutation CreateOrganizationTask(
    $input: CreateOrganizationTaskInput!
    $condition: ModelOrganizationTaskConditionInput
  ) {
    createOrganizationTask(input: $input, condition: $condition) {
      organizationId
      name
      isActive
      programName
      description
      point
      pointMin
      pointMax
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const updateOrganizationTask = /* GraphQL */ `
  mutation UpdateOrganizationTask(
    $input: UpdateOrganizationTaskInput!
    $condition: ModelOrganizationTaskConditionInput
  ) {
    updateOrganizationTask(input: $input, condition: $condition) {
      organizationId
      name
      isActive
      programName
      description
      point
      pointMin
      pointMax
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const deleteOrganizationTask = /* GraphQL */ `
  mutation DeleteOrganizationTask(
    $input: DeleteOrganizationTaskInput!
    $condition: ModelOrganizationTaskConditionInput
  ) {
    deleteOrganizationTask(input: $input, condition: $condition) {
      organizationId
      name
      isActive
      programName
      description
      point
      pointMin
      pointMax
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const createOrganizationTransaction = /* GraphQL */ `
  mutation CreateOrganizationTransaction(
    $input: CreateOrganizationTransactionInput!
    $condition: ModelOrganizationTransactionConditionInput
  ) {
    createOrganizationTransaction(input: $input, condition: $condition) {
      organizationId
      id
      username
      refTransactionId
      isCancelled
      points
      type
      note
      createdBy
      createdAt
      updatedAt
      user {
        organizationId
        username
        idNumber
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
      }
    }
  }
`;
export const updateOrganizationTransaction = /* GraphQL */ `
  mutation UpdateOrganizationTransaction(
    $input: UpdateOrganizationTransactionInput!
    $condition: ModelOrganizationTransactionConditionInput
  ) {
    updateOrganizationTransaction(input: $input, condition: $condition) {
      organizationId
      id
      username
      refTransactionId
      isCancelled
      points
      type
      note
      createdBy
      createdAt
      updatedAt
      user {
        organizationId
        username
        idNumber
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
      }
    }
  }
`;
export const deleteOrganizationTransaction = /* GraphQL */ `
  mutation DeleteOrganizationTransaction(
    $input: DeleteOrganizationTransactionInput!
    $condition: ModelOrganizationTransactionConditionInput
  ) {
    deleteOrganizationTransaction(input: $input, condition: $condition) {
      organizationId
      id
      username
      refTransactionId
      isCancelled
      points
      type
      note
      createdBy
      createdAt
      updatedAt
      user {
        organizationId
        username
        idNumber
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
      }
    }
  }
`;
export const createOrganizationUser = /* GraphQL */ `
  mutation CreateOrganizationUser(
    $input: CreateOrganizationUserInput!
    $condition: ModelOrganizationUserConditionInput
  ) {
    createOrganizationUser(input: $input, condition: $condition) {
      organizationId
      username
      idNumber
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
    }
  }
`;
export const updateOrganizationUser = /* GraphQL */ `
  mutation UpdateOrganizationUser(
    $input: UpdateOrganizationUserInput!
    $condition: ModelOrganizationUserConditionInput
  ) {
    updateOrganizationUser(input: $input, condition: $condition) {
      organizationId
      username
      idNumber
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
    }
  }
`;
export const deleteOrganizationUser = /* GraphQL */ `
  mutation DeleteOrganizationUser(
    $input: DeleteOrganizationUserInput!
    $condition: ModelOrganizationUserConditionInput
  ) {
    deleteOrganizationUser(input: $input, condition: $condition) {
      organizationId
      username
      idNumber
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
    }
  }
`;
export const createOrganizationUserTask = /* GraphQL */ `
  mutation CreateOrganizationUserTask(
    $input: CreateOrganizationUserTaskInput!
    $condition: ModelOrganizationUserTaskConditionInput
  ) {
    createOrganizationUserTask(input: $input, condition: $condition) {
      organizationId
      id
      taskName
      username
      status
      note
      transactionId
      points
      createdAt
      updatedAt
      user {
        organizationId
        username
        idNumber
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
      }
      transaction {
        organizationId
        id
        username
        refTransactionId
        isCancelled
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          idNumber
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      task {
        organizationId
        name
        isActive
        programName
        description
        point
        pointMin
        pointMax
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;
export const updateOrganizationUserTask = /* GraphQL */ `
  mutation UpdateOrganizationUserTask(
    $input: UpdateOrganizationUserTaskInput!
    $condition: ModelOrganizationUserTaskConditionInput
  ) {
    updateOrganizationUserTask(input: $input, condition: $condition) {
      organizationId
      id
      taskName
      username
      status
      note
      transactionId
      points
      createdAt
      updatedAt
      user {
        organizationId
        username
        idNumber
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
      }
      transaction {
        organizationId
        id
        username
        refTransactionId
        isCancelled
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          idNumber
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      task {
        organizationId
        name
        isActive
        programName
        description
        point
        pointMin
        pointMax
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;
export const deleteOrganizationUserTask = /* GraphQL */ `
  mutation DeleteOrganizationUserTask(
    $input: DeleteOrganizationUserTaskInput!
    $condition: ModelOrganizationUserTaskConditionInput
  ) {
    deleteOrganizationUserTask(input: $input, condition: $condition) {
      organizationId
      id
      taskName
      username
      status
      note
      transactionId
      points
      createdAt
      updatedAt
      user {
        organizationId
        username
        idNumber
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
      }
      transaction {
        organizationId
        id
        username
        refTransactionId
        isCancelled
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          idNumber
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      task {
        organizationId
        name
        isActive
        programName
        description
        point
        pointMin
        pointMax
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;
